const inquirer = require("inquirer");
const Employee = require("../models/Employee");
const EmployeeLog = require("../models/EmployeeLog");
const DeletedEmployee = require("../models/DeletedEmployee");


// HAPUS DATA KARYAWAN ============================================================================
async function delete_data() {
  console.log("========== HAPUS DATA KARYAWAN ==========");

  try {
    const { search_by } = await inquirer.prompt([
      {
        type: "list",
        name: "search_by",
        message: "Cari data berdasarkan:",
        choices: ["ID", "Nama"],
      },
    ]);

    let results = [];

    if (search_by === "ID") {
      const { search_id } = await inquirer.prompt([
        {
          type: "input",
          name: "search_id",
          message: "Masukkan ID karyawan:",
          validate: (val) => (val.trim() ? true : "ID tidak boleh kosong!"),
        },
      ]);

      results = await Employee.find({
        ID: search_id.trim().toUpperCase(),
      });

    } else {
      const { search_name } = await inquirer.prompt([
        {
          type: "input",
          name: "search_name",
          message: "Masukkan nama karyawan :",
          validate: (val) => (val.trim() ? true : "Nama tidak boleh kosong!"),
        },
      ]);

      results = await Employee.find({
        NAMA: { $regex: search_name.trim(), $options: "i" },
      });
    }

    if (results.length === 0) {
      console.log("Data karyawan tidak ditemukan.");
      return;
    }

    // PILIH DATA JIKA LEBIH DARI SATU HASIL ----------------------------
    let target;
    if (results.length > 1) {
      const { pilih } = await inquirer.prompt([
        {
          type: "list",
          name: "pilih",
          message: "Pilih data yang ingin dihapus:",
          choices: results.map(
            (k) => `${k.ID} | ${k.NAMA} | ${k.JABATAN} | ${k.TELP}`,
          ),
        },
      ]);

      target = results.find((k) => k.ID === pilih);
    } else {
      target = results[0];
    }
    // ------------------------------------------------------------------

    console.table([
      {
        ID: target.ID,
        NAMA: target.NAMA,
        JABATAN: target.JABATAN,
        TELP: target.TELP,
      },
    ]);

    // KONFIRMASI HAPUS -------------------------------------------------
    const { konfirmasi } = await inquirer.prompt([
      {
        type: "confirm",
        name: "konfirmasi",
        message: "Apakah anda yakin ingin menghapus data ini?",
      },
    ]);

    if (!konfirmasi) {
      console.log("Penghapusan dibatalkan.");
      return;
    }

    // SIMPAN KE LOG ------------------------------------------
    try {
      await DeletedEmployee.create({
        ID: target.ID,
        NAMA: target.NAMA,
        JABATAN: target.JABATAN,
        TELP: target.TELP,
      });

      await EmployeeLog.create({
        action: "DELETE",
        data_before: target,
        data_after: null,
      });

      await Employee.deleteOne({ ID: target.ID });

      await Employee.deleteOne({ ID: target.ID });

      console.log("Data berhasil dihapus & disimpan ke log.");
    } catch (err) {
      console.error("Gagal proses delete + log:", err.message);
    }

    console.log("Data karyawan berhasil dihapus.");
  } catch (err) {
    console.error("Terjadi kesalahan saat menghapus data:", err.message);
  }
  // --------------------------------------------------------------------
}
// ================================================================================================

module.exports = delete_data;