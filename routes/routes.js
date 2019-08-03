const bodyParser = require("body-parser");
const cors = require("cors");
const loginController = require("../controllers/login");
const signupController = require("../controllers/signup");
const categoryController = require("../controllers/category");
const productController = require("../controllers/products");
const orderController = require("../controllers/orders");
const {
  expressErrorHandler,
  pageNotFoundErrorHandler
} = require("../middlewares/error-handlers");

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.options("*", cors());
  app.use("/login", loginController);
  app.use("/signup", signupController);
  app.use("/category", categoryController);
  app.use("/product", productController);
  app.use("/order", orderController);
  app.use(expressErrorHandler);
  app.use(pageNotFoundErrorHandler);
};
