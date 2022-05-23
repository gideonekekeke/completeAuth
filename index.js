require("dotenv").config();
require("./dbConfig/db");
const express = require("express");
const port = process.env.PORT || 4000;
const cors = require("cors");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json("api is ready!!!");
});

app.use("/api/user", require("./router/Authrouter"));

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
