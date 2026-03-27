const inquirer = require("inquirer");

const connectDB = require("./config/db");
console.log("App started");
connectDB();

const Employee = require("./models/Employee");
const DeletedEmployee = require("./models/DeletedEmployee");
const EmployeeLog = require("./models/EmployeeLog");

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

// MENU PILIHAN ===================================================================================
async function main_menu() {
  while (true) {
    const { menu } = await inquirer.prompt([
      {
        type: "list",
        name: "menu",
        message: "Pilih Menu : ",
        choices: [
          "1. Tampilkan Semua Data",
          "2. Tampilkan Statistik Data Karyawan",
          "3. Tambah Data Baru",
          "4. Urutkan Data",
          "5. Cari Karyawan",
          "6. Edit Data",
          "7. Hapus Data",
          "8. Keluar",
        ],
      },
    ]);

    switch (menu) {
      case "1. Tampilkan Semua Data": {
        console.log("\n");
        await tampilkan_data();
        console.log("\n");
        break;
      }

      case "2. Tampilkan Statistik Data Karyawan": {
        console.log("\n");
        show_statistic();
        console.log("\n");
        break;
      }

      case "3. Tambah Data Baru": {
        console.log("\n");
        await tambah_data();
        console.log("\n");
        break;
      }

      case "4. Urutkan Data": {
        console.log("\n");
        await sort_by_id();
        console.log("\n");
        break;
      }

      case "5. Cari Karyawan": {
        console.log("\n");
        await cari_data();
        console.log("\n");
        break;
      }

      case "6. Edit Data": {
        console.log("\n");
        await edit_data();
        console.log("\n");
        break;
      }

      case "7. Hapus Data": {
        console.log("\n");
        await delete_data();
        console.log("\n");
        break;
      }

      case "8. Keluar": {
        console.log("\n");
        console.log("Keluar dari program.");
        process.exit();
      }
    }
  }
}
// ================================================================================================

main_menu();
