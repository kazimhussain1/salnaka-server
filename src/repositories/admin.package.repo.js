const User = require("../models/user.model");
const Package = require("../models/package.model");

module.exports = {
  async createPackage(req, res) {
    try {
      const {
        name,
        description,
        profitRangeStart,
        profitRangeEnd,
        profitRate,
        price,
      } = req.body;

      let package = await Package.findOne({
        name: name,
      });

      if (package) {
        return res.status(400).json({
          errors: [
            {
              msg: "Package with name " + name + " already exists",
            },
          ],
        });
      }

      package = new Package({
        name,
        description,
        profitRange: {
          start: profitRangeStart,
          end: profitRangeEnd,
        },
        profitRate,
        price,
      });

      await package.save();

      res.status(200).json({
        success: package,
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

  async deletePackage(req, res) {
    try {
      const id = req.body.packageId;

      let package = await Package.findOne({
        _id: id,
      });

      if (!package) {
        return res.status(400).json({
          errors: [
            {
              msg: "Package donot exists.",
            },
          ],
        });
      }

      await Package.findByIdAndDelete(id);
      const success = {
        msg: "Package with id " + id + " has been deleted",
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

  async updatePackage(req, res) {
    try {
      const {
        id,
        name,
        description,
        profitRangeStart,
        profitRangeEnd,
        profitRate,
        price,
      } = req.body;

      let package = Package.findById(id);

      if (!package) {
        return res.status(400).json({
          errors: [
            {
              msg: "Package donot exists.",
            },
          ],
        });
      }

      let updateQuery = {};

      if (name) updateQuery.name = name;
      if (description) updateQuery.description = description;
      if (profitRate) updateQuery.profitRate = profitRate;
      if (price) updateQuery.price = price;

      const profitRange = package.profitRange || {};

      if (profitRangeStart) profitRange.start = profitRangeStart;
      if (profitRangeEnd) profitRange.end = profitRangeEnd;

      updateQuery.profitRange = profitRange;

      package = await Package.findOneAndUpdate(
        {
          _id: id,
        },
        updateQuery,
        {
          new: true,
        }
      ).select("-password");

      const success = {
        msg: "Package with id " + id + " has been updated",
        package: package,
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

  async getPackage(req, res) {
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
