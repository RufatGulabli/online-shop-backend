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

module.exports = {
  validateLogin,
  validateProduct
};
