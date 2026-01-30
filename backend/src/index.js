const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require('./config/database');
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const ideaRoutes = require("./routes/idea.routes");
const projectRoutes = require("./routes/project.routes");
const mlServiceRoutes = require("./routes/mlService.routes");
const taskRoutes = require("./routes/task.routes");

const cookieParser = require("cookie-parser");
const app = express();

connectDB();
// // Security middleware
// app.use(helmet());
app.use(cookieParser());
app.use(cors());
morgan.token("req-body", (req) => JSON.stringify(req.body));
morgan.token("query", (req) => JSON.stringify(req.query));
app.use(
  morgan(
    ":method :url :status :response-time ms | body=:req-body | query=:query"
  )
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/idea", ideaRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ml", mlServiceRoutes);
app.use("/api", taskRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
