const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require('./config/database');
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const app = express();
const cookieParser = require("cookie-parser");


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

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
