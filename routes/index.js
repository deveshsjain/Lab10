const resultRoutes = require("./result");

const constructorMethod = app => {
  app.use("/", resultRoutes);

};

module.exports = constructorMethod;
