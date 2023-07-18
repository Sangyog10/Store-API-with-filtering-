//we are adding the product.json file to the db
require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");
const jsonProuducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany(); //delete all the pre-existing products
    await Product.create(jsonProuducts);
    console.log("success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
