const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authMiddleware = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");
const app = express();
require("./utils/db");
dotenv.config();

const PORT = process.env.PORT || 4000;
app.use(
	cors({
		origin: ["http://localhost:5173"],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Hello There"));

// authentications
app.use("/api/auth/", require("./controllers/AuthRoutes"));

app.get("/api/me", authMiddleware, (req, res) => res.send(req.user));
app.use(
	"/api/user-activity",
	authMiddleware,
	require("./controllers/ActivityRoutes")
);
app.use(
	"/api/cloudbase/",
	authMiddleware,
	require("./controllers/handleCloudBase")
);

app.listen(PORT, () =>
	console.log(`server started at http://localhost:${PORT}`)
);
