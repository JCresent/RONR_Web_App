const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fs = require("fs");
const path = require("path");

//env variables
// console.log(require("dotenv").config({path: '../.env'}))
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" }); // to use the .env file

//MongoDB
const {
  MongoClient,
  ServerApiVersion,
  Timestamp,
  ObjectId,
} = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9ffgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//Database and Clusters
let database;
let com_cluster;
let user_cluster;
let motionsCollection;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //Grab database and clusters
    database = client.db("ronr_db");
    com_cluster = database.collection("commitees");
    user_cluster = database.collection("users");
    motionsCollection = database.collection("motions");
  }
}
run().catch(console.dir);

// Insert new users into db
async function insertUser(user_doc) {
  // Insert into the "users" cluster
  const result = await user_cluster.insertOne(user_doc);
  // Print the ID of the inserted document
  console.log(`A user was inserted with the _id: ${result.insertedId}`);
}

// User signups from signup page
app.post("/newuser/post", (req, res) => {
  try {
    const user_and_pass = req.body;
    console.log(user_and_pass.email);
    console.log(user_and_pass.psw);

    // Creating document to insert
    const user_doc = {
      username: user_and_pass.email,
      password: user_and_pass.psw,
      created_at: new Timestamp(),
      bio: "None",
      is_admin: false,
    };

    // Insert into the "users" cluster
    insertUser(user_doc);
  } finally {
    //Go back to login page
    console.log("Success! Created new user.");
    res.redirect("/");
  }
});

async function findUser(email, pwd) {
  const result = await user_cluster.findOne({ username: email, password: pwd });
  console.log("Result of the search: " + result);
  return result;
}

app.post("/findUser", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Username is: " + email + ". PWD is: " + password + ".");
    const resultOfSearch = await findUser(email, password);
    if (resultOfSearch != null) {
      res.status(200).json({
        message: "User login successful.",
      });
      //res.redirect("/home")
    } else {
      res.status(400).json({
        message: "Unsuccessful login! Please check your email & password.",
      });
    }
  } catch (error) {
    console.log(error);

    console.log("Error looking up user.");
  }
});

// ```
// OBJECTS FOR DB
// committees {
//             committee_id INTEGER,
//             owner_id INTEGER,
//             chair_id INTEGER,
//             members { member #: userid, member #: userid, ... },
//             created_at TIMESTAMP,
//             title TEXT
//             chat { message #: {userid, text}, message #: {userid, text} },
//             motioned BOOLEAN,
//             seconded BOOLEAN,
//             vote_for INTEGER,
//             vote_against INTEGER,
//             is_closed BOOLEAN
//           }

// users {
//             user_id INTEGER,
//             username TEXT,
//             created_at TIMESTAMP,
//             bio TEXT,
//             is_admin BOOLEAN
//       }
// ```

// code to get the sample json data
// Read and parse the JSON file
const discussionsFilePath = path.join(__dirname, "sample_data", "sample.json");

app.get("/getCommittees", async (req, res) => {
  try {
    // Read through the database
    const committees = await com_cluster
      .find({}, { projection: { title: 1, description: 1, _id: 0 } })
      .toArray(); //Projection only returns those fields from db
    // console.log(committees);
    res.json(committees);
  } catch (error) {
    console.error("Error grabbing committees:", error);
    res.status(500).json({ error: "Failed to retrieve committees" });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

// route to get discussions using a discussion id
app.get("/discussion/:discussion_id", (req, res) => {
  //res.send(req.params);
  const discussionId = parseInt(req.params.id);

  // Find the discussion with the matching ID
  const discussion = discussions.find((d) => d.discussion_id === discussionId);

  // If the discussion is not found, return a 404 error
  if (!discussion) {
    return res.status(404).json({ error: "Discussion not found" });
  }

  // Return the discussion in JSON format
  res.json(discussion);
});

// route to get motions using a motion id
app.get("/motions/:motion_id", async (req, res) => {
  const motionId = req.params.motion_id;

  try {
    // Log the motionId to ensure it's being received correctly
    console.log("Received motionId:", motionId);

    // Convert motionId to ObjectId
    const objectId = new ObjectId(motionId);
    console.log("Converted ObjectId:", objectId);

    // Query the database
    const motion = await motionsCollection.findOne({ _id: objectId });

    // If the motion is not found, return a 404 error
    if (!motion) {
      console.log("Motion not found for ObjectId:", objectId);
      return res.status(404).json({ error: "Motion not found" });
    }

    // Return the motion in JSON format
    res.json(motion);
  } catch (error) {
    console.error("Error fetching motion:", error);
    res.status(500).send("Error fetching motion");
  }
});

app.post("/motions/", async (req, res) => {
  const { title, body, user_id, created_at } = req.body;

  if (!title || !body || !user_id || !created_at) {
    return res.status(400).send("Missing required fields");
  }
  // Get existing requests from the database and assign id to the next number available
  const newMotion = {
    title,
    body,
    user_id,
    status: "pending",
    created_at: new Date(created_at),
  };

  try {
    const result = await motionsCollection.insertOne(newMotion);
    res.status(201).send(result.ops[0]);
  } catch (error) {
    res.status(500).send("Error creating motion");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
