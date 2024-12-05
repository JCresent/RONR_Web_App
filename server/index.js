const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fs = require('fs');
const path = require('path');

//env variables 
// console.log(require("dotenv").config({path: '../.env'}))
const dotenv = require("dotenv"); 
dotenv.config({path: '../.env'}); // to use the .env file

//MongoDB
const { MongoClient, ServerApiVersion, Timestamp, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9ffgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//Database and Clusters 
let database; 
let com_cluster; 
let user_cluster; 


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3002 });

// Track clients per discussion
const discussionClients = new Map();

wss.on('connection', (ws) => {
  let discussionId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'join') {
        discussionId = data.discussionId;
        if (!discussionClients.has(discussionId)) {
          discussionClients.set(discussionId, new Set());
        }
        discussionClients.get(discussionId).add(ws);
      } else if (data.type === 'message') {
        const clients = discussionClients.get(discussionId);
        if (clients) {
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
              client.send(JSON.stringify({
                type: 'message',
                userId: data.userId,
                message: data.message
              }));
            }
          });
        }
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });

  ws.on('close', () => {
    if (discussionId && discussionClients.has(discussionId)) {
      discussionClients.get(discussionId).delete(ws);
    }
  });
});


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
    //Grab database and clusters
    database = client.db("ronr_db");
    com_cluster = database.collection("commitees");
    user_cluster = database.collection("users");
  }
}
run().catch(console.dir);

// Insert new users into db
async function insertUser(user_doc) {
  // Insert into the "users" cluster
  const result = await user_cluster.insertOne(user_doc); 
  // Print the ID of the inserted document
  console.log(`A user was inserted with the _id: ${result.insertedId}`);
  return result;
}

// User signups from signup page
app.post("/newuser/post", async (req, res) => {
  try {
    const user_doc = {
      username: req.body.email,
      password: req.body.psw,
      created_at: new Timestamp(),
      bio: "None", 
      is_admin: false,
    }
    
    const result = await insertUser(user_doc);
    console.log("Success! Created new user.");
    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertedId
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

async function findUser(email, pwd){
  const result = await user_cluster.findOne( {username:email, password:pwd} );
  console.log("Result of the search: " + result);
  return result;
}

app.post("/findUser", async (req, res) => {
  try {
    const email = req.body.email; 
    const password = req.body.password;
    const user = await findUser(email, password);
    
    if (user) {
      res.status(200).json({
        message: 'User login successful',
        userId: user._id,
        username: user.username
      });
    } else {
      res.status(400).json({
        message: 'Unsuccessful login! Please check your email & password.',
      });
    }
  } catch (error) {
    console.error("Error looking up user:", error);
    res.status(500).json({ error: "Failed to login" });
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
const discussionsFilePath = path.join(__dirname, 'sample_data', 'sample.json');

app.get("/getCommittees", async (req, res) => {
  try {
    // Remove the projection to get all fields
    const committees = await com_cluster.find({}).toArray();
    console.log("Sending committees:", committees); // Debug log
    res.json(committees);
  } catch (error) {
    console.error("Error grabbing committees:", error);
    res.status(500).json({ error: "Failed to retrieve committees" });
  }
}); 

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

// Create new discussion
app.post("/creatediscussion", async (req, res) => {
  try {
    const ownerId = new ObjectId(req.body.owner_id);
    const discussion = {
      owner_id: ownerId,
      chair_id: ownerId,
      members: [ownerId.toString()],
      created_at: new Timestamp(),
      title: req.body.title,
      description: req.body.description,
      messages: [],
      motioned: false,
      seconded: false,
      vote_for: 0,
      vote_against: 0,
      is_closed: false
    };
    
    const result = await com_cluster.insertOne(discussion);
    res.status(201).json({
      message: 'Discussion created successfully',
      discussion_id: result.insertedId
    });
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(500).json({ error: "Failed to create discussion" });
  }
});

// Get messages for a specific discussion
app.get("/discussion/:discussionId/messages", async (req, res) => {
  try {
    const discussionId = new ObjectId(req.params.discussionId);
    const discussion = await com_cluster.findOne({ _id: discussionId });
    
    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }
    
    res.json(discussion.messages || []);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

// Add a new message to a discussion
app.post("/discussion/:discussionId/message", async (req, res) => {
  try {
    const { discussionId } = req.params;
    console.log("Received discussion ID:", discussionId);

    // Validate ObjectId format
    if (!ObjectId.isValid(discussionId)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ error: "Invalid discussion ID format" });
    }

    const mongoId = new ObjectId(discussionId);
    const { userId, message } = req.body;
    
    const result = await com_cluster.updateOne(
      { _id: mongoId },
      { 
        $push: { 
          messages: [userId, message]
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Discussion not found" });
    }
    
    res.status(201).json({ message: "Message added successfully" });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ error: "Failed to add message" });
  }
});

app.post("/discussion/:discussionId/join", async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { userId } = req.body;

    if (!ObjectId.isValid(discussionId)) {
      return res.status(400).json({ error: "Invalid discussion ID format" });
    }

    const mongoId = new ObjectId(discussionId);
    
    // Add member only if they're not already in the array
    const result = await com_cluster.updateOne(
      { _id: mongoId },
      { 
        $addToSet: { 
          members: userId 
        }
      }
    );
    
    // Fetch the updated discussion
    const updatedDiscussion = await com_cluster.findOne({ _id: mongoId });
    
    if (!updatedDiscussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }
    
    res.status(200).json({ 
      message: "Successfully joined discussion",
      discussion: updatedDiscussion
    });
  } catch (error) {
    console.error("Error joining discussion:", error);
    res.status(500).json({ error: "Failed to join discussion" });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const user = await user_cluster.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      userId: user._id,
      username: user.username
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});