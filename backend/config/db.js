import { createConnection } from "mysql2";

const db = createConnection({
    host: "localhost",
    user: "root",
    password: "Boshitu@123",
    database: "ResiCare"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL Database");
});

export default db;
