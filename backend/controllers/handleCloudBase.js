const express = require("express");
const User = require("../models/UserModel");
const Base = require("../models/BasesModel");
const {
	createNewDockerContainer,
	isContainerAvailable,
	removeContainer,
} = require("../utils/DockerUtils");
const { getAvailablePort } = require("../utils/NetUtils");
const images = require("../consts/template_images");

const router = express.Router();

// get all bases for the currently logged-in user
router.get("/get-all", async (req, res) => {
	try {
		if (req.user) {
			const bases = await Base.find({ user: req.user }); // Fetch bases for the user
			const result = [];

			for (const base of bases) {
				const isAvail = await isContainerAvailable(base.containerId); // Check if the container is available
				result.push({
					...base._doc, // Spread the base's properties properly
					isAvailable: isAvail,
				});
			}

			console.log(result);

			return res.json({
				success: true,
				result,
			});
		} else {
			return res.json({
				success: false,
				message: "User not authenticated",
			});
		}
	} catch (error) {
		console.error("Error fetching bases:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
});

router.post("/restart", async (req, res) => {
	try {
		const { base } = req.body;
		console.log(base);

		const imageName = base.image;

		// Usage
		const startPort = 3001;
		const endPort = 4500;

		const port = await getAvailablePort(startPort, endPort);
		const container_name = `${req.user.username}-${base.template}-${
			base.name
		}-${Date.now()}`.replaceAll(" ", "-");
		// create container
		const container = await createNewDockerContainer(
			imageName,
			container_name,
			{
				container: 5000,
				host: port,
			}
		);
		// start container
		await container.start();

		// // create new base object
		await Base.findByIdAndUpdate(base._id, {
			containerId: container.id,
			port: port,
		});

		res.json({
			message: "Container started successfully",
			containerId: container.id,
			port: port,
		});
	} catch (error) {
		console.error("Error starting the container:", error);
		res.status(500).json({
			message: "Failed to start container",
			error: error.message,
		});
	}
});

router.post("/create-new", async (req, res) => {
	try {
		const { user, template, title } = req.body;
		console.log({ user, template, title });

		let imageName;
		switch (template) {
			case "Node Js":
				imageName = "node_template:latest";
				break;
			case "Python":
				imageName = "python_template:latest";
				break;
			case "CPP":
				imageName = "cpp_template:latest";
				break;
			case "React-Js-vite-js":
				imageName = "react_template:latest";
				break;
			default:
				imageName = "node_template:latest";
				break;
		}

		const containerName = `${
			user?.username
		}-${template}-${title}-${Date.now()}`.replaceAll(" ", "-");

		// Usage
		const startPort = 3001;
		const endPort = 4500;

		const port = await getAvailablePort(startPort, endPort);

		// create container
		const container = await createNewDockerContainer(
			imageName,
			containerName,
			{
				container: 5000,
				host: port,
			}
		);
		// start container
		await container.start();

		// create new base object
		const newBase = await new Base({
			name: title,
			user: user._id,
			template: template,
			containerId: container.id,
			port: port,
			image: imageName,
		}).save();

		// Add the Base ID to the User's bases array
		await User.findByIdAndUpdate(user._id, {
			$push: { bases: newBase._id },
		});
		console.log(newBase);

		setTimeout(() => {
			res.json({
				message: "Container started successfully",
				containerId: container.id,
				port: port,
			});
		}, 3000);
	} catch (error) {
		console.error("Error starting the container:", error);
		res.status(500).json({
			message: "Failed to start container",
			error: error.message,
		});
	}
});

// delete all bases for current loggedin user
router.delete("/all", async (req, res) => {
	try {
		await Base.deleteMany({ user: req.user._id });
		await User.updateOne({ _id: req.user._id }, { bases: [] });
		res.send({
			success: true,
			message: "All bases deleted successfully",
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

// delete a single project
router.delete("/base/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// delete the container
		await removeContainer(id);

		// find the base
		const base = await Base.findOne({
			user: req.user._id,
			containerId: id,
		});

		// Check if the base was found
		if (!base) {
			return res.status(404).json({ message: "Base not found." });
		}

		// Pull the base._id from the user's bases array
		await User.updateOne(
			{ _id: req.user._id },
			{
				$pull: {
					bases: base._id,
				},
			}
		);

		// Delete the base document
		await base.deleteOne();

		res.send({
			success: true,
			message: "base deleted successfully",
			containerDeleted: id,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});
module.exports = router;
