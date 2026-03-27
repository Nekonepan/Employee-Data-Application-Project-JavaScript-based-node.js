const inquirer = require("inquirer");
const Employee = require("../models/Employee");
const EmployeeLog = require("../models/EmployeeLog");


// TAMBAH DATA BARU ===============================================================================
async function tambah_data() {
  console.log("========== TAMBAH DATA BARU ==========");

  try {
    const { count: count_raw } = await inquirer.prompt([
      {
        type: "input",
        name: "count",
        message:
          "Masukkan jumlah data yang akan diinput. [MASUKKAN 0 UNTUK BATAL] : ",
        validate: (val) => {
          const n = parseInt(String(val).trim(), 10);
          if (Number.isNaN(n) || n < 0) {
            return "Masukkan angka >= 0";
          }
          return true;
        },
      },
    ]);

    const count = parseInt(String(count_raw).trim(), 10);

    // BATAL JIKA INPUT = 0 ----------------
    if (count === 0) {
      console.log("Input data dibatalkan.");
      return;
    }
    // -------------------------------------

    let new_data = [];

    for (let i = 0; i < count; i++) {
      console.log(`\nInput data karyawan ke-${i + 1}:`);

      const { ID, NAMA, JABATAN, TELP } = await inquirer.prompt([
        {
          type: "input",
          name: "ID",
          message: "Masukkan ID karyawan :",
          validate: async (val) => {
            const input = val.trim().toUpperCase();

            if (!input) {
              return "ID tidak boleh kosong!";
            }

            if (!/^[A-Za-z0-9]+$/.test(val)) {
              return "ID hanya boleh huruf & angka!";
            }

            const existsDB = await Employee.findOne({ ID: input });
            if (existsDB) {
              return "ID sudah digunakan di database!";
            }

            const existsLocal = new_data.some((k) => k.ID === input);
            if (existsLocal) {
              return "ID sudah digunakan di input ini!";
            }

            return true;
          },
        },
        {
          type: "input",
          name: "NAMA",
          message: "Masukkan nama karyawan :",
          validate: (val) => {
            return val.trim() ? true : "Nama tidak boleh kosong!";
          },
        },
        {
          type: "input",
          name: "JABATAN",
          message: "Masukkan jabatan karyawan :",
          validate: (val) => {
            return val.trim() ? true : "Jabatan tidak boleh kosong!";
          },
        },
        {
          type: "input",
          name: "TELP",
          message: "Masukkan no telp karyawan :",
          validate: (val) => {
            if (!val.trim()) {
              return "Nomor telepon tidak boleh kosong!";
            }
            if (!/^[0-9]+$/.test(val)) {
              return "Nomor telepon hanya boleh angka!";
            }
            return true;
          },
        },
      ]);

      new_data.push({
        ID: ID.trim().toUpperCase(),
        NAMA: NAMA.trim(),
        JABATAN: JABATAN.trim(),
        TELP: TELP.trim(),
      });
    }

    // KONFIRMASI SIMPAN ---------------------------------------------------------
    const { save_confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "save_confirm",
        message: `\nApakah anda yakin ingin menyimpan ${new_data.length} data ini?`,
      },
    ]);

    if (!save_confirm) {
      console.log("Data batal disimpan.");
      return;
    }

    try {
      await Employee.insertMany(new_data);
      console.log(`${new_data.length} data berhasil disimpan ke database.`);
    } catch (err) {
      console.error("Gagal menyimpan ke database:", err.message);
    }

    await Employee.insertMany(new_data);

    for (const item of new_data) {
      await EmployeeLog.create({
        action: "CREATE",
        data_before: null,
        data_after: item,
      });
    }
  } catch (err) {
    console.error("Terjadi kesalahan saat menambahkan data:", err.message);
  }
  // -----------------------------------------------------------------------------
}
// ================================================================================================

module.exports = tambah_data;
