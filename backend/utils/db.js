const mongoose = require("mongoose");

const db = mongoose
	.connect(
		"mongodb+srv://reigns:reigns@cluster0.jcmx0zk.mongodb.net/code-editor?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => {
		console.log("db connected");
	});
