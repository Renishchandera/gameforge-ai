const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const aiRoutes = require("./routes/ai.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
morgan.token("req-body", (req) => JSON.stringify(req.body));
morgan.token("query", (req) => JSON.stringify(req.query));
app.use(
  morgan(
    ":method :url :status :response-time ms | body=:req-body | query=:query"
  )
);


app.use("/ai", aiRoutes);
app.use(errorMiddleware);

module.exports = app;
