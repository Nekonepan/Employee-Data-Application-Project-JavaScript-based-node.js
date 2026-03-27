const inquirer = require("inquirer");
const Employee = require("../models/Employee");

// MENAMPILKAN STATISTIK KARYAWAN =================================================================
async function show_statistic() {
  console.log("========== STATISTIK DATA KARYAWAN ==========");
  // console.log("Total Data Karyawan:", data.length);

  try {
    const data = await Employee.find();

    console.log("Total Data Karyawan:", data.length);

    // STATISTIK PER JABATAN ----------------------------------
    const per_jabatan = data.reduce((acc, k) => {
      const jabatan = k.JABATAN.trim().toUpperCase();
      acc[jabatan] = (acc[jabatan] || 0) + 1;
      return acc;
    }, {});

    console.table(
      Object.entries(per_jabatan).map(([jabatan, jumlah]) => ({
        Jabatan: jabatan,
        Jumlah: jumlah,
      })),
    );
    // --------------------------------------------------------

    // STATISTIK PREFIX ID ----------------------------------
    const per_prefix = data.reduce((acc, k) => {
      const prefix = k.ID.trim().charAt(0).toUpperCase();
      acc[prefix] = (acc[prefix] || 0) + 1;
      return acc;
    }, {});

    console.table(
      Object.entries(per_prefix).map(([prefix, jumlah]) => ({
        Prefix_ID: prefix,
        Jumlah: jumlah,
      })),
    );
    // ------------------------------------------------------
  } catch (err) {
    console.error("Gagal mengambil statistik:", err.message);
  }
}
// ================================================================================================

module.exports = show_statistic;