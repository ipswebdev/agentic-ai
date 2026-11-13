const mongoose = require("mongoose");

const isValidObjectId = (id) => {
  return (
    typeof id === "string" &&
    /^[0-9a-fA-F]{24}$/.test(id) &&
    mongoose.Types.ObjectId.isValid(id)
  );
};

module.exports = {
  isValidObjectId
};