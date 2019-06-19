const teste = (req, res) => {
  res.send({ message: req.userId });
};

module.exports = {
  teste,
};
