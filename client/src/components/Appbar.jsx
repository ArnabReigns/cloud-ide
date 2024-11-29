import React, { useContext, useState } from "react";
import { appContext } from "../context/AppContexts";
import {
	Avatar,
	Box,
	Fade,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import { Plus } from "lucide-react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
const Appbar = () => {
	const ctx = useContext(appContext);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const nav = useNavigate();
	return (
		<Box
			sx={{
				bgcolor: "#FFFFFF",
				borderBottom: "1px solid black",
				borderColor: "rgba(0,0,0,0.4)",
				p: 1,
				px: 6,
				display: "flex",
				alignItems: "center",
				gap: 1,
			}}
		>
			<Box
				sx={{
					ml: "auto",
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}
			>
				<IconButton size="small">
					<Plus />
				</IconButton>
				<Avatar
					sx={{ width: 30, height: 30, bgcolor: "primary.main" }}
					onClick={handleClick}
				>
					A
				</Avatar>
				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					sx={{ mt: 1.3 }}
				>
					<MenuItem onClick={handleClose}>Profile</MenuItem>
					<MenuItem onClick={handleClose}>My account</MenuItem>
					<MenuItem
						onClick={() => {
							api.get("/auth/logout/").then((res) => {
								console.log(res.data);
								ctx.setUser(null);
								nav("/login");
							});
							handleClose();
						}}
					>
						Logout
					</MenuItem>
				</Menu>
			</Box>
		</Box>
	);
};

export default Appbar;
