const Docker = require("dockerode");
const docker = new Docker();

// This function pulls images from dockerhub as local images
const pullImage = (imageName) => {
	return new Promise((resolve, reject) => {
		docker.pull(imageName, (err, stream) => {
			if (err) {
				return reject(err);
			}
			docker.modem.followProgress(stream, onFinished, onProgress);

			function onFinished(err, output) {
				if (err) return reject(err);
				resolve(output);
			}

			function onProgress(event) {
				console.log(event);
			}
		});
	});
};

// creates a new container with minimal configurations
async function createNewDockerContainer(
	imageName,
	containerName,
	portBinds = { container: 5000, host: 5000 }
) {
	console.log({
		[`${portBinds.container}/tcp`]: [{ HostPort: portBinds.host }],
	});
	const container = await docker.createContainer({
		Image: imageName,
		Tty: true,
		name: containerName,
		HostConfig: {
			// Binds: [
			// 	`D:\\cloud-ide/${user?.username}/${template}/${title}:/app/node`
			// ],
			PortBindings: {
				[`${portBinds.container}/tcp`]: [
					{ HostPort: portBinds.host.toString() },
				],
			},
		},
	});

	return container;
}

async function isContainerAvailable(id) {
	try {
		const data = await docker.getContainer(id).inspect();
		if (data.State.Running) {
			return true;
		}
	} catch (err) {}

	return false;
}

async function removeContainer(containerId) {
	console.log("deleting container");
	try {
		const container = docker.getContainer(containerId);

		// Remove the container forcefully (kills if running, then removes)
		await container.remove({ force: true });
		console.log(`Container ${containerId} removed successfully`);
	} catch (error) {
		console.error("Error removing container:", error);
	}
}
module.exports = {
	createNewDockerContainer,
	pullImage,
	isContainerAvailable,
	removeContainer,
};
