import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Boxes, FolderOpen, Home, Plus } from "lucide-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { appContext } from "../context/AppContexts";
import SelectCodeBase from "../popups/dashboard/SelectCodeBase";
import logo from "../assets/logo.png";
import Flex from "./utils/Flex";

const Sidebar = () => {
	const ctx = useContext(appContext);

	return (
		<Stack
			sx={{
				p: 2,
				height: "100vh",
				width: "14rem",
				borderRight: "1px solid black",
				borderColor: "rgba(0,0,0,0.3)",
				bgcolor: "#FFFFFF",
			}}
		>
			<Flex mb={4}>
				<img src={logo} height={25} />
				<Typography fontWeight={500} fontSize={"1.1rem"}>
					Cloud<span style={{ color: "#195f53" }}>Base</span>
				</Typography>
			</Flex>

			<Stack flex={1}>
				<Button
					size="small"
					disableElevation
					startIcon={<Plus size={18} />}
					color="primary"
					fullWidth
					onClick={() => {
						ctx.setOpenCreatePopup(true);
					}}
				>
					Create Base
				</Button>

				<Stack mt={2} gap={0.5} flex={1}>
					<Item icon={<Home size={18} />} name={"Home"} link={"/~"} />
					<Item
						icon={<FolderOpen size={18} />}
						name={"Bases"}
						link={"/bases"}
					/>
					<Item
						icon={<FolderOpen size={18} />}
						name={"dev"}
						link={"/test"}
					/>

					<Box sx={{ mt: "auto" }} />
					<Box>
						<Typography variant="caption">logged in as</Typography>
						<Typography fontWeight={500}>
							{ctx.user?.username}
						</Typography>
					</Box>
				</Stack>
			</Stack>

			<SelectCodeBase
				open={ctx.openCreatePopup}
				onClose={() => {
					ctx.setOpenCreatePopup(false);
				}}
			/>
		</Stack>
	);
};

const Item = ({ icon, name, link }) => {
	return (
		<Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
			<Box
				display={"flex"}
				alignItems={"center"}
				borderRadius={1}
				gap={1}
				sx={{
					p: 0.5,
					color: "#093830",
					cursor: "pointer",
					":hover": {
						bgcolor: "rgba(0, 0, 0, 0.078)",
						transition: "all 0.1s",
					},
				}}
			>
				{icon}
				{name}
			</Box>
		</Link>
	);
};

export default Sidebar;
