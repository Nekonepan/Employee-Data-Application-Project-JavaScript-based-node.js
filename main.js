// DEPENDENCIES ===================================================================================
const inquirer = require("inquirer");
// ================================================================================================

// DATABASE =======================================================================================
const connectDB = require("./config/db");
console.log("App started");
connectDB();
// ================================================================================================

// SERVICES =======================================================================================
const tampilkan_data = require("./services/show-data");
const tambah_data = require("./services/add-data");
const cari_data = require("./services/search-data");
const sort_by_id = require("./services/sort-data");
const edit_data = require("./services/edit-data");
const delete_data = require("./services/delete-data");
const show_statistic = require("./services/show-statistic");
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
