const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const InitiateMongoServer = require("./config/db");
const auth = require("./middleware/auth");
const cookieParser = require('cookie-parser');
const api = require("./routes/api");
const index = require("./routes/index");
const users = require("./routes/users");
const models = require("./routes/models");

const { v4: uuidV4 } = require("uuid");
const { getModel } = require("./model");
const { getModel_new } = require("./model_new");

dotenv.config();
InitiateMongoServer();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use("/", index);
app.use("/u", users);
app.use("/m", models);
app.use("/api/user", api);
app.use(cookieParser())

io.sockets.on("connection", function (socket) {
	socket.on("getModel", function (data) {
		getModel_new(data.user, function (resp) {
			socket.emit("setModel", { model: resp.toString() });
		});
	});
});

const port = process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 3000;

server.listen(port, () => {
	console.log(`The application started on port http://localhost:${server.address().port}`);
});

function getId(playername) {
	return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
		.then((data) => data.json())
		.then((player) => player.id);
}
