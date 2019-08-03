const JOI = require("@hapi/joi");

function validateLogin(body) {
  const schema = {
    email: JOI.string()
      .email()
      .min(10)
      .max(156)
      .required(),
    password: JOI.string()
      .trim()
      .min(8)
      .max(64)
      .required()
  };
  return JOI.validate(body, schema);
}

function validateSignUp(body) {
  const schema = {
    firstName: JOI.string()
      .required()
      .min(2),
    lastName: JOI.string()
      .required()
      .min(2),
    email: JOI.string()
      .email()
      .min(10)
      .max(156)
      .required(),
    password: JOI.string()
      .trim()
      .min(8)
      .max(64)
      .required()
  };
  return JOI.validate(body, schema);
}

function validateProduct(body) {
  const schema = JOI.object({
    id: JOI.number().min(1),
    title: JOI.string()
      .required()
      .max(64)
      .min(3)
      .trim(),
    price: JOI.number()
      .precision(2)
      .strict()
      .positive()
      .required(),
    category: JOI.number()
      .positive()
      .required(),
    imageUrl: JOI.string()
      .trim()
      .required()
      .uri()
  });
  return JOI.validate(body, schema);
}

function orderValidator(order) {
  const schema = JOI.object({
    userID: JOI.number().min(1).required(),
    orderItems: JOI.array().items(
      JOI.object({
        productId: JOI.number().min(1).required(),
        quantity: JOI.number().min(1).required()
      })).required(),
    shipping: JOI.object({
      name: JOI.string().required(),
      address_1: JOI.string().required(),
      city: JOI.string().required(),
      address_2: JOI.optional()
    }).required(),
    total_price: JOI.number().min(1).required(),
    created_on: JOI.date().required()
  })
  return JOI.validate(order, schema);
}

module.exports = {
  validateLogin,
  validateSignUp,
  validateProduct,
  orderValidator
};
