require("dotenv").config();
require("express-async-errors"); //it will handle the async error as defined in middlewares
const connectDB = require("./db/connect");

const express = require("express");
const app = express();

const productRoute = require("./routes/products");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});
app.use("/api/v1/products", productRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = 3000 || process.env.PORT;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is listening at port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};
start();
