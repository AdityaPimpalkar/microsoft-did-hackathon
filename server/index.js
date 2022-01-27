const express = require("express");

const msal = require("@azure/msal-node");
const config = require("./config.json");
const issuer = require("./issuer.js");

const app = express();
app.use(express.static("public"));
app.use(express.json());
// app.use(cors());

const port = process.env.PORT || 8080;

app.use("/api/issuer", issuer);

app.listen(port, () => console.log(`Listening on port ${port}...`));
