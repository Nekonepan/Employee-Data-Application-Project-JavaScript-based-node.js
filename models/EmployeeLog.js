const mongoose = require("mongoose");

const employeeLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["CREATE", "UPDATE", "DELETE"],
    required: true,
  },

  data_before: {
    type: Object,
    default: null,
  },

  data_after: {
    type: Object,
    default: null,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("EmployeeLog", employeeLogSchema);
