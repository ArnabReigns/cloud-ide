import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../context/AppContexts";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Folders, Codesandbox, Coffee } from "lucide-react";
import Flex from "../components/utils/Flex";
import api from "../../utils/api";
import { format } from "timeago.js";
import { Link, useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";

const Bases = () => {
	const [bases, setBases] = useState([]);
	const { socket, connectToSocket } = useSocket();
	const ctx = useContext(appContext);

	function handleRestart(base) {
		if (socket) socket.disconnect();
		api.post("/cloudbase/restart/", {
			base,
		})
			.then((data) => {
				console.log(data);
				fetchBases();
			})
			.catch((err) => console.log(err));
	}

	function handleLaunch(name, port) {
		if (socket) socket.disconnect();
		connectToSocket(port, () => {
			navigate(`/@${ctx.user?.username}/${name}/`);
		});
	}

	function fetchBases() {
		api.get("/cloudBase/get-all/")
			.then((e) => {
				console.log(e.data);
				setBases(e.data.result);
			})
			.catch((e) => console.log(e));
	}
	useEffect(() => {
		document.title = "Cloudbase | bases";
		ctx.socketDisconnect();
		fetchBases();
	}, []);

	function deleteBase(containerId) {
		api.delete(`/cloudbase/base/${containerId}`)
			.then((res) => {
				console.log(res);
				fetchBases();
			})
			.catch((err) => console.log(err));
	}

	const navigate = useNavigate();
	return (
		<Stack
			gap={2}
			sx={{
				overflow: "hidden",
				height: "100%",
			}}
		>
			<Flex>
				<Coffee color="#287F71" />
				<Typography color="primary" fontSize={"1.1rem"}>
					CloudBases
				</Typography>
			</Flex>
			<Stack gap={1} height={"30rem"} overflow={"auto"}>
				{bases?.length == 0 && (
					<Typography color="textDisabled">
						You don't have any cloudbase.{" "}
						<Typography
							component={"span"}
							fontSize={'0.9rem'}
							sx={{ cursor: "pointer" }}
							color="primary"
							fontWeight={500}
							onClick={() => ctx.setOpenCreatePopup(true)}
						>
							create one 🚀
						</Typography>
					</Typography>
				)}
				{bases?.map((base, idx) => (
					<Box
						p={2}
						sx={{
							bgcolor: "white",
							borderRadius: 1,
						}}
						key={idx}
					>
						<Flex gap={2}>
							<Stack flex={1}>
								<Typography
									fontSize={"0.9rem"}
									fontWeight={500}
								>
									{base.template}
								</Typography>
								<Flex>
									<Typography
										fontSize={"1.2rem"}
										fontWeight={700}
									>
										{base.name}
									</Typography>{" "}
									{base.isAvailable && (
										<Box
											sx={{
												width: 8,
												aspectRatio: 1,
												bgcolor: "#00ff00",
												borderRadius: "100%",
											}}
										/>
									)}
								</Flex>
								<Typography mt={3} variant="caption">
									{format(base.updatedAt)}
								</Typography>
							</Stack>
							<Divider flexItem orientation="vertical" />
							<Stack gap={1}>
								{base.isAvailable ? (
									<Button
										variant="contained"
										onClick={() => {
											handleLaunch(base.name, base.port);
										}}
									>
										launch
									</Button>
								) : (
									<Button
										onClick={() => {
											handleRestart(base);
										}}
										variant="contained"
									>
										Restart
									</Button>
								)}
								<Button
									variant="contained"
									color="error"
									onClick={() => {
										ctx.socketDisconnect();
										deleteBase(base.containerId);
									}}
								>
									Delete
								</Button>
							</Stack>
						</Flex>
					</Box>
				))}
			</Stack>
		</Stack>
	);
};

export default Bases;
