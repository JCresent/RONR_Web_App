const express = require("express");
const fs = require('fs');
const path = require('path');

//env variables 
// console.log(require("dotenv").config({path: '../.env'}))
const dotenv = require("dotenv"); 
dotenv.config({path: '../.env'}); // to use the .env file

//MongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9ffgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,  
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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
const discussionsFilePath = path.join(__dirname, 'sample_data', 'sample.json');

function getDiscussions() {
  try {
    // Read the file synchronously and parse JSON
    const data = fs.readFileSync(discussionsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading the discussions file:", error);
    return [];
  }
}

app.get("/", (req, res) => {
    res.json({
        "message": "Hello World"
    });
});

// route to get discussions using a discussion id
app.get("/discussion/:discussion_id", (req, res) => {
  //res.send(req.params);
  const discussionId = parseInt(req.params.id);

  // Find the discussion with the matching ID
  const discussion = discussions.find(d => d.discussion_id === discussionId);

  // If the discussion is not found, return a 404 error
  if (!discussion) {
    return res.status(404).json({ error: "Discussion not found" });
  }

  // Return the discussion in JSON format
  res.json(discussion);
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
