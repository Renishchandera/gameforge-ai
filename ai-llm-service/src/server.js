const app = require("./app");
const { PORT } = require("./config/env");

app.listen(PORT, () => {
  console.log(`AI LLM Service running on port ${PORT}`);
});
