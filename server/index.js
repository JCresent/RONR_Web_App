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
