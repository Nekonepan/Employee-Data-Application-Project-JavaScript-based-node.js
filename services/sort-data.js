const inquirer = require("inquirer");
const Employee = require("../models/Employee");

// SORTING DATA BERDASARKAN ID KARYAWAN ===========================================================
async function sort_by_id() {
  console.log("========== URUTKAN DATA BERDASARKAN ID ==========");

  try {
    const { arah } = await inquirer.prompt([
      {
        type: "list",
        name: "arah",
        message: "Pilih arah pengurutan data : ",
        choices: ["Ascending (A-Z)", "Descending (Z-A)"],
      },
    ]);

    const sortOrder = arah === "Ascending (A-Z)" ? 1 : -1;

    const results = await Employee.find().sort({ ID: sortOrder });

    const formatted = results.map((k) => ({
      ID: k.ID,
      NAMA: k.NAMA,
      JABATAN: k.JABATAN,
      TELP: k.TELP,
    }));

    console.log("\n========== HASIL SORTING ==========");
    console.table(formatted);

  } catch (err) {
    console.error("Terjadi kesalahan saat mengurutkan data:", err.message);
  }
}
// ================================================================================================

module.exports = sort_by_id;
