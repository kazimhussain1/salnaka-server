const Package = require("../models/package.model");

module.exports = {
  async getPackages(req, res) {
    try {
      let package = await Package.find({});

      const success = {
        packages: package,
      };

      res.status(200).json({
        success,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        errors: [
          {
            code: 500,
            msg: err.toString(),
          },
        ],
      });
    }
  },
};
