const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { spawn, exec } = require("child_process");
const fs = require("fs").promises; // Use promises for fs
const path = require("path");
const chokidar = require("chokidar");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		credentials: true,
	},
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	return res.json({
		success: true,
	});
});
const watchDir = "/app/node";
app.get("/files", async (req, res) => {
	try {
		const files = await getFilesList(watchDir);
		res.json(files);
	} catch (error) {
		res.status(500).json({ error: "Error fetching files" });
	}
});

let idCounter = 0;

function generateUniqueId() {
	return idCounter++;
}

async function getFilesList(targetFolder) {
	const results = [];

	try {
		const items = await fs.readdir(targetFolder, { withFileTypes: true });

		for (const item of items) {
			const itemPath = path.join(targetFolder, item.name);

			if (item.isDirectory()) {
				// Recursively get the list of files in the subdirectory

				const subFiles =
					item.name != "node_modules"
						? await getFilesList(itemPath)
						: [];
				results.push({
					_id: generateUniqueId(),
					type: "folder",
					isOpen: false,
					name: item.name,
					path: itemPath,
					checked: 0,
					children: subFiles, // Include contents of the subdirectory
				});
			} else {
				// Read the content of the file
				const content = await fs.readFile(itemPath, "utf-8"); // Read file contents as a string
				results.push({
					_id: generateUniqueId(),
					type: "file",
					checked: 0,
					name: item.name,
					path: itemPath,
					content, // Include the content of the file
				});
			}
		}
	} catch (error) {
		console.error("Error reading folder:", error);
		throw error;
	}

	return results;
}

io.on("connection", (socket) => {
	console.log("A user connected");
	console.log();

	const shell = spawn("bash", {
		cwd: "/app/node",
		shell: true,
		env: { ...process.env },
	});

	// Watch for changes in the directory
	const watcher = chokidar.watch(watchDir, {
		ignored: [path.join(watchDir, "node_modules/*")], // Ignore dotfiles
		persistent: true,
		// ignoreInitial: true,
	});

	watcher.on("all", async (event, path) => {
		console.log(`File ${event} at path ${path}`);
		try {
			const filesList = await getFilesList(watchDir);
			io.emit("files:update", filesList); // Emit the updated files list to all connected clients
		} catch (error) {
			console.error("Error updating file list:", error);
		}
	});

	shell.stdout.on("data", (data) => {
		console.log(data.toString());

		socket.emit("terminal:output", {
			type: "output",
			output: data.toString(),
			pwd: shell.spawnargs,
		});
	});

	shell.stderr.on("data", (data) => {
		console.log(data.toString());
		socket.emit("terminal:output", {
			type: "error",
			output: data.toString(),
			pwd: shell.spawnargs[1],
		});
	});

	socket.on("terminal:command", (data) => {
		console.log(data);
		shell.stdin.write(data + "\n");
	});

	socket.on("files", async () => {
		// Await the file list
		const files = await getFilesList(watchDir);
		socket.emit("files:update", files);
	});

	socket.on("save:file", async (data) => {
		// Use async for save
		const { file, content } = data;
		const safePath = path.normalize(file); // Normalize and join with watchDir

		console.log({
			file,
			content,
			safePath,
		});

		try {
			await fs.writeFile(safePath, content);
			console.log("File saved successfully");
			const files = await getFilesList(watchDir);
			socket.emit("files:update", files);
			socket.emit("save:file:success", {
				message: "File saved successfully",
			});
		} catch (err) {
			console.error("Error saving file:", err);
			socket.emit("save:file:error", { error: "Error saving file" });
		}
	});

	socket.on("disconnect", () => {
		console.log("User disconnected");
		shell.kill(); // Kill the shell process when user disconnects
	});
});

const PORT = 5000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
