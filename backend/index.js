const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-idea", (req, res) => {
  const { genre, platform, audience } = req.body;

  res.json({
    idea: `A ${genre} game for ${platform} targeting ${audience}`
  });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
