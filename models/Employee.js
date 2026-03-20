const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
      unique: true,
    },
    NAMA: {
      type: String,
      required: true,
    },
    JABATAN: {
      type: String,
      required: true,
    },
    TELP: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Employee", employeeSchema);
