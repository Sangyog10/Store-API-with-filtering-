const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 100 } }).sort(" price");
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, field, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" }; //i means case insensitive and regex will return the name that contains entered words
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "eq",
    };
    const regEx = /\b(<|>|<=|>=|=)\b/g; //regular expressions
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
    // console.log(queryObject);
  }

  let result = Product.find(queryObject);
  //used for sorting acc. to user inputs
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  //field is used for filtering the content you wanna see. eg field=name,price will only display name and price
  if (field) {
    const fieldList = field.split(",").join(" ");
    result = result.select(fieldList);
  }
  const page = Number(req.query.page) || 1; //no.of pages to be displayed
  const limit = Number(req.query.limit) || 10; //yeuta page ma kati ota items dekhaune
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
