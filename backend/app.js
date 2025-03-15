import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/routes.js"; 

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static("C:/Users/taran/OneDrive/ResiCare SDL Project/AdminsList/frontend"));

// Use routes
app.use("/api", routes); 

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
