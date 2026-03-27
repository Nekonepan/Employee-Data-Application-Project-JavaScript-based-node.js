const inquirer = require("inquirer");
const Employee = require("../models/Employee");

// CARI DATA KARYAWAN =============================================================================
async function cari_data() {
  console.log("========== CARI DATA KARYAWAN ==========");

  try {
    const { tipe } = await inquirer.prompt([
      {
        type: "list",
        name: "tipe",
        message: "Cari berdasarkan:",
        choices: ["ID", "Nama"],
      },
    ]);

    // INPUT KATA KUNCI -------------------------------
    const { keyword } = await inquirer.prompt([
      {
        type: "input",
        name: "keyword",
        message: `Masukkan ${tipe} yang ingin dicari:`,
        validate: (val) => {
          if (!val.trim()) {
            return `${tipe} tidak boleh kosong!`;
          }
          return true;
        },
      },
    ]);
    // ------------------------------------------------

    let hasil = [];

    if (tipe === "ID") {
      hasil = await Employee.find({
        ID: { $regex: keyword, $options: "i" },
      });
    } else {
      hasil = await Employee.find({
        NAMA: { $regex: keyword, $options: "i" },
      });
    }

    const formatted = hasil.map((k) => ({
      ID: k.ID,
      NAMA: k.NAMA,
      JABATAN: k.JABATAN,
      TELP: k.TELP,
    }));

    if (hasil.length === 0) {
      console.log("Data tidak ditemukan.");
    } else {
      console.table(formatted);
    }
  } catch (err) {
    console.error("Terjadi kesalahan saat mencari data:", err.message);
  }
}
// ================================================================================================

module.exports = cari_data;
