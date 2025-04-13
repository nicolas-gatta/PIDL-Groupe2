# 📂 `database/` – MySQL SQL Files

This folder contains all the SQL logic required to set up the database:

- `schema.sql` – Defines the **database structure** (tables, constraints, foreign keys)
- `seed.sql` – Inserts **sample/test data** for development and testing
- `views.sql` – Adds **predefined SQL views** for performance analysis and reporting

---

## 💡 Tips

### ▶️ Importing with phpMyAdmin
If you're using **phpMyAdmin**, import the files in this order:

1. `schema.sql`
2. `seed.sql`
3. `views.sql`

### 🖥️ Importing with MySQL CLI (Command Line)

If you're working via the terminal or on a remote server:

```bash
mysql -u root -p your_database_name < database/schema.sql
mysql -u root -p your_database_name < database/seed.sql
mysql -u root -p your_database_name < database/views.sql
