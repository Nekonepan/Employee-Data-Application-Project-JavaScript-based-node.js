const Employee = require("../models/Employee");

// TAMPILKAN DATA =================================================================================
async function tampilkan_data() {
  try {
    const data = await Employee.find();

    console.log("========== DATA KARYAWAN ==========");
    console.log("Jumlah Data : ", data.length);

    // Mapping biar format sama kayak sebelumnya
    const formatted = data.map((k) => ({
      ID: k.ID,
      NAMA: k.NAMA,
      JABATAN: k.JABATAN,
      TELP: k.TELP,
    }));

    console.table(formatted);
  } catch (err) {
    console.error("Gagal mengambil data:", err.message);
  }
}
// ================================================================================================

module.exports = tampilkan_data;