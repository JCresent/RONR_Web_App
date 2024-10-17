const express = require("express");

const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({
        "message": "Hello World"
    });
});

// route to get discussions using a discussion id
app.get("/discussion/:discussion_id", (req, res) => {
  res.send(req.params);
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
