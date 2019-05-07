const bodyParser = require("body-parser");
const cors = require("cors");
const loginController = require("../controllers/login");
const categoryController = require("../controllers/category");
const productController = require("../controllers/products");
const {
  expressErrorHandler,
  pageNotFoundErrorHandler
} = require("../middlewares/error-handlers");

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.options("*", cors());
  app.use("/login", loginController);
  app.use("/category", categoryController);
  app.use("/product", productController);
  app.use(expressErrorHandler);
  app.use(pageNotFoundErrorHandler);
};
