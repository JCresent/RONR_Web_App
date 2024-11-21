const express = require("express");
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// ROUTES BELOW
// POST route to login
app.post("/login", (req, res) => {
  
})

// POST route to create a discussion
app.post("/discussion/new", (req, res) => {
  //res.send(req.body);
  const { title, description, members } = req.body;

  // get the current discussions
  const curDiscussions = getDiscussions();

  // Create a new discussion object
  const newDiscussion = {
    discussion_id: curDiscussions.length + 1,
    title,
    description,
    members: members || [],
    motions: []
  };

  // Add the discussion to the list of discussions
  curDiscussions.push(newDiscussion);

  // Return the newly created discussion
  res.json(curDiscussions);
})

// POST route to add a member to a committee
app.post("/discussion/add", (req, res) => {
  //res.send(req.body);
  const { discussion_id, member_id } = req.body;
  // Find the discussion with the matching ID
  const discussion = discussions.find(d => d.discussion_id === discussion_id);

  // If the discussion is not found, return a 404 error
  if (!discussion) {
    return res.status(404).json({ error: "Discussion not found" });
  }

  // Add the member to the discussion
  discussion.members.push(member_id);

  // Return the updated discussion
  res.json(discussion);
});
// POST route to create a motion in a committee
app.post("/discussion/motion", (req, res) => {
  //res.send(req.body);
  const { discussion_id, motion } = req.body;
  // Find the discussion with the matching ID 
  const discussion = discussions.find(d => d.discussion_id === discussion_id);

  // If the discussion is not found, return a 404 error
  if (!discussion) {
    return res.status(404).json({ error: "Discussion not found" });
  }

  // Add the motion to the discussion
  discussion.motions.push(motion);

  // Return the updated discussion
  res.json(discussion);
});

// route to get discussions using a discussion id
app.get("/discussion/:discussion_id", (req, res) => {
  const discussions = getDiscussions()

  //res.send(req.params);
  const dId = req.params.discussion_id;
  console.log("Looking for ", dId)

  // Find the discussion with the matching ID
  let discussion = null
  for (const d of discussions) {
    console.log(d["discussion_id"])
    if (d["discussion_id"] == dId) {
      discussion = d
    }
  }
  //const discussion = discussions.find(d => d.discussion_id === discussionId);
  console.log(discussion)

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
