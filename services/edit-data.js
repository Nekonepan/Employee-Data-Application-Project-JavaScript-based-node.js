const inquirer = require("inquirer");
const Employee = require("../models/Employee");
const EmployeeLog = require("../models/EmployeeLog");

// EDIT DATA KARYAWAN =============================================================================
async function edit_data() {
  console.log("========== EDIT DATA KARYAWAN ==========");

  try {
    const { search_by } = await inquirer.prompt([
      {
        type: "list",
        name: "search_by",
        message: "Cari karyawan berdasarkan:",
        choices: ["ID", "Nama"],
      },
    ]);

    let matches = [];

    if (search_by === "ID") {
      const { id_query } = await inquirer.prompt([
        {
          type: "input",
          name: "id_query",
          message: "Masukkan ID karyawan :",
          validate: (val) => {
            if (!val.trim()) {
              return "ID tidak boleh kosong!";
            }
            return true;
          },
        },
      ]);

      matches = await Employee.find({
        ID: id_query.trim().toUpperCase(),
      });

    } else {
      const { name_query } = await inquirer.prompt([
        {
          type: "input",
          name: "name_query",
          message: "Masukkan nama :",
          validate: (val) => {
            if (!val.trim()) {
              return "Nama tidak boleh kosong!";
            }
            return true;
          },
        },
      ]);

      matches = await Employee.find({
        NAMA: { $regex: name_query, $options: "i" },
      });
    }

    if (matches.length === 0) {
      console.log("Data tidak ditemukan.");
      return;
    }

    const { chosen } = await inquirer.prompt([
      {
        type: "list",
        name: "chosen",
        message: "Pilih data yang ingin diedit:",
        choices: matches.map((k) => ({
          name: `${k.ID} | ${k.NAMA} | ${k.JABATAN} | ${k.TELP}`,
          value: k.ID,
        })),
      },
    ]);

    const current = matches.find((k) => k.ID === chosen);

    if (!current) {
      console.log("Data yang dipilih tidak ditemukan.");
      return;
    }
    console.log("Data saat ini :");

    const formatted = [
      {
        ID: current.ID,
        NAMA: current.NAMA,
        JABATAN: current.JABATAN,
        TELP: current.TELP,
      },
    ];
    console.table(formatted);

    // INPUT EDIT DATA BARU ------------------------------------------------------------
    const { ID, NAMA, JABATAN, TELP } = await inquirer.prompt([
      {
        type: "input",
        name: "ID",
        message: `Masukkan ID baru (kosongkan untuk tetap "${current.ID}") :`,
        validate: (val) => {
          const t = val.trim();
          if (!t) {
            return true;
          }
          if (!/^[A-Za-z0-9]+$/.test(t)) {
            return "ID hanya boleh huruf dan angka!";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "NAMA",
        message: `Masukkan nama baru (kosongkan untuk tetap "${current.NAMA}") :`,
      },
      {
        type: "input",
        name: "JABATAN",
        message: `Masukkan jabatan baru (kosongkan untuk tetap "${current.JABATAN}") :`,
      },
      {
        type: "input",
        name: "TELP",
        message: `Masukkan no telp baru (kosongkan untuk tetap "${current.TELP}") :`,
        validate: (val) => {
          const t = val.trim();
          if (!t) {
            return true;
          }
          if (!/^[0-9]+$/.test(t)) {
            return "Nomor telepon hanya boleh angka!";
          }
          return true;
        },
      },
    ]);
    // ---------------------------------------------------------------------------------

    const updated = {
      ID: ID && ID.trim() ? ID.trim().toUpperCase() : current.ID,
      NAMA: NAMA && NAMA.trim() ? NAMA.trim() : current.NAMA,
      JABATAN: JABATAN && JABATAN.trim() ? JABATAN.trim() : current.JABATAN,
      TELP: TELP && TELP.trim() ? TELP.trim() : current.TELP,
    };

    console.log("Data sebelumnya : \n");
    console.table(formatted);

    console.log("Data setelah di edit : \n");
    console.table([updated]);

    // KONFIRMASI SIMPAN ---------------------------------------------------
    const { confirm } = await inquirer.prompt([
      { type: "confirm", name: "confirm", message: "Simpan perubahan?" },
    ]);

    if (!confirm) {
      console.log("Perubahan dibatalkan.");
      return;
    }

    try {
      await Employee.updateOne(
        { ID: current.ID },
        {
          ID: updated.ID,
          NAMA: updated.NAMA,
          JABATAN: updated.JABATAN,
          TELP: updated.TELP,
        },
      );

      console.log("Data karyawan berhasil diperbarui di database.");
    } catch (err) {
      console.error("Gagal update data:", err.message);
    }

    console.log("Data karyawan berhasil diperbarui.");

    await EmployeeLog.create({
      action: "UPDATE",
      data_before: current,
      data_after: updated,
    });

  } catch (err) {
    console.error("Terjadi kesalahan saat mengedit data:", err.message);
  }
  // -----------------------------------------------------------------------
}
// ================================================================================================

module.exports = edit_data;