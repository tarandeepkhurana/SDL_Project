import { Router } from "express";
const router = Router();
import db from "../config/db.js";  // Ensure `.js` is added

// Get all admins
router.get("/admins", (req, res) => {
    db.query("SELECT * FROM admins", (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});


// Add a new admin
router.post("/admins/add", (req, res) => {
    console.log("Received Data:", req.body);

    const { block, flat_no, admin_name, contact_no, flat_status, email } = req.body;

    // Check for missing fields
    if (!block || !flat_no || !admin_name || !contact_no || !flat_status || !email) {
        console.log("Missing Fields:", req.body);
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate contact number (must be 10 digits)
    if (!/^\d{10}$/.test(contact_no)) {
        return res.status(400).json({ error: "Contact number must be exactly 10 digits" });
    }

    // Check if email already exists in the database
    const checkEmailSql = "SELECT * FROM admins WHERE email = ?";
    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            // Email already exists
            return res.status(400).json({ error: "This email is already registered. Please use a different email." });
        }

        // Insert new admin if email is unique
        const insertSql = "INSERT INTO admins (block, flat_no, admin_name, contact_no, flat_status, email) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(insertSql, [block, flat_no, admin_name, contact_no, flat_status, email], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: err.message });
            }

            console.log("Insert Successful:", result);
            res.status(201).json({ message: "Admin added successfully", insertedId: result.insertId });
        });
    });
});

// Route to check if block and flat_no already exist
router.get("/admins/check", async (req, res) => {
    try {
        const { block, flat_no } = req.query;

        if (!block || !flat_no) {
            return res.status(400).json({ error: "Block and Flat No are required" });
        }

        // Check if the given block and flat_no exist in the database
        const query = "SELECT * FROM admins WHERE block = ? AND flat_no = ?";
        db.query(query, [block, flat_no], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length > 0) {
                return res.json({ exists: true });
            } else {
                return res.json({ exists: false });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});



// Get admin by block and flat_no
router.get("/admins/:block/:flat_no", (req, res) => {
    const { block, flat_no } = req.params;

    console.log(`Received Block: ${block}`);
    console.log(`Received Flat No: ${flat_no}`);

    const query = "SELECT * FROM admins WHERE block = ? AND flat_no = ?";
    db.query(query, [block, flat_no], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err.message });
        }

        console.log("Query Result:", result); // Log database response

        if (result.length === 0) {
            return res.status(404).json({ error: "Admin not found" });
        } 

        res.json(result[0]);
    });
});

// Update admin details
router.put("/admins/edit/:id", (req, res) => {
    const { id } = req.params;
    const { admin_name, contact_no, flat_status, email } = req.body;

    const sql = "UPDATE admins SET admin_name = ?, contact_no = ?, flat_status = ?, email = ? WHERE id = ?";
    db.query(sql, [admin_name, contact_no, flat_status, email, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Admin updated successfully" });
        }
    });
});


// Delete an admin
router.delete("/admins/delete/:block/:flat_no", (req, res) => {
    let { block, flat_no } = req.params;

    block = block.trim().toLowerCase();
    flat_no = flat_no.trim();

    const query = "DELETE FROM admins WHERE block = ? AND flat_no = ?";

    db.query(query, [block, flat_no], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.json({ message: "Admin deleted successfully" });
    });
});

export default router;
