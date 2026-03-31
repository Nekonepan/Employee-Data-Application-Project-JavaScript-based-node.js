# 🗂️ Employee Data Management App - Node.js + MongoDB CLI

A feature-rich CLI (Command Line Interface) application for managing employee data using **JavaScript (Node.js)**. This app is a **rewrite and improvement** of my previous project written in **C++**, with added enhancements like bulk input, interactive editing, real file persistence, and modular design.

---

## 📌 Project Description

This project simulates a basic employee database management system that runs entirely in the terminal. It's designed for learning purposes, suitable for beginner-to-intermediate developers who want to understand:

- How to structure CLI apps in Node.js
- How to manage employee data with MongoDB using Mongoose ORM
- How to modularize code and separate logic
- How to mimic real-world HR-like data operations

---

## 🧬 Origin & Reference

This Node.js project is a **refactored and modernized version** of my previous C++ project:

### 🔁 Rewritten From:

- [Project-Algoritma-Pemrograman](https://github.com/Nekonepan/College/tree/main/C%2B%2B/Project-Algoritma-Pemrograman)

### 🎯 Enhancements Compared to C++ Version:

| Feature          | C++ Version             | Node.js Version                             |
| ---------------- | ----------------------- | ------------------------------------------- |
| Save to File     | ✅ TXT                  | ✅ MongoDB via Mongoose                     |
| Employee Input   | ✅ Manual               | ✅ Single & Bulk Input                      |
| ID / Name Search | ✅ Only by ID           | ✅ By ID & Name (with list selection)       |
| Edit Data        | ❌ None                 | ✅ Full interactive editing                 |
| Sort Data        | ✅ Yes (no persistence) | ✅ With option to save results to file      |
| Table View       | ✅ Static               | ✅ Dynamic with `console.table()`           |
| Input Validation | ❌ Very limited         | ✅ Rich & interactive validation            |
| Log Deleted Data | ❌ None                 | ✅ Yes (DeletedEmployee collection)         |
| Backup           | ❌ None                 | ✅ Built-in via MongoDB timestamps/logs     |
| Restore          | ❌ None                 | ✅ Yes (from backup file with confirmation) |

---

## ⚙️ Setup Requirements

- ✅ Node.js installed (v20+ recommended)
- ✅ MongoDB Atlas account (free: https://www.mongodb.com/atlas)
- ✅ Basic terminal/command prompt
- ✅ (Optional) Text editor like VS Code

---

## 🚀 How to Run the Project

### 1. **Clone this repository**

```
git clone https://github.com/Nekonepan/Employee-Data-Application-Project-JavaScript-based-node.js.git
cd Employee-Data-Application-Project-JavaScript-based-node.js
```

### 2. **Install dependencies**

```
npm install
```

### 3. **Configure MongoDB**

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create cluster, get connection string
3. Copy `.env.example` to `.env` and set `MONGO_URI`

### 4. **Run the app**

```
node main.js
```

> 📌 You'll be guided through an interactive menu system.

---

## 📂 Folder Structure

```
|-- main.js                          # Main application logic
|-- config/
|   `-- db.js                        # MongoDB connection
|-- models/
|   |-- Employee.js                  # Employee schema
|   |-- DeletedEmployee.js           # Deleted logs schema
|   `-- EmployeeLog.js               # Audit logs
|-- services/                        # Feature services
|-- package.json                     # Dependencies (mongoose, mongodb, etc.)
|-- .env                             # MongoDB URI
|-- node_modules/                    # Dependencies
```

---

## ✅ Features Implemented

| Feature                                               | Status |
| ----------------------------------------------------- | ------ |
| Input single & multiple data entries                  | ✅     |
| Edit data with summary & confirmation                 | ✅     |
| Search by ID or Name (list selection if duplicate)    | ✅     |
| Sort data by ID (ascending/descending, optional save) | ✅     |
| Empty field validation & interactive prompts          | ✅     |
| Confirm before save or restore                        | ✅     |
| Modularized functions per feature                     | ✅     |
| MongoDB persistence & audit logging                   | ✅     |

---

## ⚙️ How the App Works

Here’s a simplified breakdown of the logic flow behind the app:

1. 📂 **Program connects to MongoDB Atlas** via Mongoose on startup.
2. 📜 A **main menu** is displayed using `inquirer`, with options like View, Add, Search, Edit, Sort, Statistics, Backup/Restore, and Exit.
3. 📥 When adding data:
   - User is asked how many records to add (input `0` = cancel)
   - Each input is validated (non-empty, unique ID)
   - Data is optionally saved after confirmation
4. 🔍 When searching:
   - User can search by ID or Name (case-insensitive, partial match supported)
   - If multiple results are found (e.g., duplicate names), a list is displayed to select the correct record
5. ✏️ When editing:
   - User selects data from search results (by ID or Name)
   - Empty inputs are ignored (retain original value)
   - A summary table is shown after edit
   - Confirmation is required before saving
6. 🔃 When sorting:
   - User can choose Ascending or Descending by ID
   - Sorted result can be saved or discarded
7. 📊 Statistics:
   - Show total employee count
   - Group employees by job position
   - Count employees by ID prefix
8. 📁 Data stored in **MongoDB collections** with Mongoose schemas for persistence and auditing.

The application runs in a loop until the user chooses to exit.

---

## 📝 Data Format (MongoDB Collections)

### Employee Collection (`employees`):

Mongoose schema:

```
ID: { type: String, required: true, unique: true }
NAMA: { type: String, required: true }
JABATAN: { type: String, required: true }
TELP: { type: String, required: true }
timestamps: true  // createdAt, updatedAt
```

Data stored as MongoDB documents matching the schema.

### DeletedEmployee Collection (`deletedemployees`):

Mongoose schema:

```
ID: String
NAMA: String
JABATAN: String
TELP: String
deleted_at: { type: Date, default: Date.now }
```

Logs deleted records with timestamp.

### EmployeeLog Collection (`employeelogs`):

Mongoose schema for change history:

```
action: { type: String, enum: ["CREATE", "UPDATE", "DELETE"] }
data_before: Object (null for CREATE)
data_after: Object (null for DELETE)
timestamp: { type: Date, default: Date.now }
```

Tracks all data modifications.

---

## 📊 Summary & Takeaways

- 🔧 Implemented **modular practices** in a Node.js CLI application
- 💾 Built **full CRUD system with MongoDB Atlas** and Mongoose ORM
- 🧠 Focused on **algorithmic logic** and data handling, not UI/Frontend
- 🧰 Migrated from **procedural C++ (TXT storage)** into **modular JavaScript (MongoDB database)**
- ✅ Finished with clean documentation, maintainable structure, and extensible design

---

## 🌱 Potential Future Enhancements

| Development Ideas                        | Status  |
| ---------------------------------------- | ------- |
| 🔒 Add login system & user access rights | ⏺️ ToDo |
| 🧾 Export employee data to CSV/Excel     | ⏺️ ToDo |
| 🌐 Migrate backend to Express + MongoDB  | ✅ Done |
| 🧪 Add unit testing with Jest            | ⏺️ ToDo |

> "These are planned features for future versions"

---

## 🙋 Author's Note

This project is currently marked as complete but may receive further updates.
Feel free to fork, remix, or use it for your own learning.

If you want to know what the previous version of C++ looked like before it was refactored into Node.js, you can look at these two files:

- [data-karyawan-alpro.cpp](https://github.com/Nekonepan/College/blob/main/C%2B%2B/Project-Algoritma-Pemrograman/Data-Karyawan/data-karyawan-alpro.cpp)
- [data-karyawan-alpro-array2D.cpp](https://github.com/Nekonepan/College/blob/main/C%2B%2B/Project-Algoritma-Pemrograman/Data-Karyawan-2D/data-karyawan-alpro-array2D.cpp)

---

## 🙏 Final Words

This project started as a simple C++ console app and has now evolved into a more modular, maintainable, and interactive CLI application using JavaScript and Node.js. It was built as a personal learning project, but it’s fully functional and easy to expand.

Whether you're here to learn, improve it, or just curious, thank you for stopping by!

If you like this project or find it useful, feel free to:

- ⭐ Star the repository
- 🛠️ Fork it and build your own version
- 📬 Reach out for questions or collaboration

# Happy coding! 💻✨
