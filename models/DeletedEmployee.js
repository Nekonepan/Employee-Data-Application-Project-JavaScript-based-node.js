const mongoose = require("mongoose");

const deletedEmployeeSchema = new mongoose.Schema({
  ID: String,
  NAMA: String,
  JABATAN: String,
  TELP: String,
  deleted_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DeletedEmployee", deletedEmployeeSchema);
