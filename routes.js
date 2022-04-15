module.exports = (app) => {
  const handler = require("./controller");

  var router = require("express").Router();

  // Retrieve all Tutorials
  router.get("/", handler.get);

  app.use("/api/", router);
};
