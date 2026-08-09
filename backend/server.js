require("dotenv").config();

const express = require("express");
const testRoutes = require("./routes/testRoutes");

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/api", testRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});