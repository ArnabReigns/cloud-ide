import {
	Autocomplete,
	Box,
	Dialog,
	Divider,
	FormControlLabel,
	IconButton,
	Radio,
	RadioGroup,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { CircleCheck, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import api from "../../../utils/api";
import { appContext } from "../../context/AppContexts";
import { useNavigate } from "react-router-dom";
import useSocket from "../../hooks/useSocket";
import Flex from "../../components/utils/Flex";

const templates = ["Node Js", "Python", "CPP", "React-Js-vite-js"];

const templates_details = {
	"Node Js": {
		name: "Node Js",
		description:
			"A JavaScript runtime built on Chrome's V8 engine, commonly used for backend development.",
		lang: "javascript",
		available: true,
	},

	Python: {
		name: "Python",
		description:
			"A versatile, high-level programming language known for its readability and wide range of libraries.",
		lang: "python",
		available: true,
	},
	CPP: {
		name: "CPP",
		description:
			"A high-performance, low-level programming language often used for system software, game development, and real-time applications.",
		lang: "cpp",
		available: true,
	},
	"React-Js-vite-js": {
		name: "React Js (Vite) Js",
		description:
			"A modern JavaScript framework for building user interfaces, bundled with Vite for fast development.",
		lang: "javascript",
		available: true,
	},
};

const SelectCodeBase = ({ open, onClose }) => {
	const ctx = useContext(appContext);
	const { connectToSocket } = useSocket();
	const [isLoading, setIsLoading] = useState(false);
	const [title, setTitle] = useState("");
	const [template, setTemplate] = useState(null);
	const navigate = useNavigate();
	const [titleErr, setTitleErr] = useState("");

	const close = () => {
		setTitle("");
		setTemplate(null);
		onClose();
	};

	useEffect(() => {
		if (title && title.includes(" "))
			setTitle((prev) => prev.replaceAll(" ", "-"));
	}, [title]);

	async function create() {
		if (!title || !template) return;

		if (title.length <= 3) {
			setTitleErr("Title length should be more than 3 letters");
			return;
		}

		console.log("initiating new cloudbase as " + title);
		setIsLoading(true);
		try {
			const res = await api.post("/cloudbase/create-new/", {
				user: ctx.user,
				template: template,
				title: title,
			});
			console.log(res.data);
			setIsLoading(false);
			connectToSocket(res.data.port, () => {
				navigate(`/@${ctx.user?.username}/${title}`);
			});
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
			close();
		}
	}

	return (
		<Dialog maxWidth={"sm"} fullWidth onClose={close} open={open}>
			<Box p={1} px={2} display={"flex"} justifyContent={"space-between"}>
				Choose Template
				<IconButton size="small" onClick={close}>
					<X size={"1.3rem"} />
				</IconButton>
			</Box>
			<Divider />
			<Box p={2} gap={1}>
				<Box>
					<Typography fontWeight={600} mb={1}>
						Template
					</Typography>

					<Autocomplete
						getOptionDisabled={(option) => {
							return (
								templates_details[option]?.available == false
							);
						}}
						disablePortal
						onChange={(e, val) => {
							console.log(val);
							setTemplate(val);
						}}
						fullWidth
						renderOption={({ key, ...e }) => {
							return (
								<AutoComplateItem
									key={key}
									item={{ name: key, ...e }}
								/>
							);
						}}
						options={templates}
						renderInput={(params) => (
							<TextField
								{...params}
								size="small"
								placeholder="Search Templates"
							/>
						)}
					/>

					{template && (
						<Box
							bgcolor={"#EBEDEE"}
							p={1}
							// border={"1px solid black"}
							borderRadius={1}
							mt={1}
						>
							<Flex mb={2}>
								<Typography
									fontSize={"1.2rem"}
									fontWeight={700}
								>
									{templates_details[template]?.name}
								</Typography>
								<CircleCheck
									size={"1rem"}
									color="#287F71"
									strokeWidth={3}
								/>
							</Flex>
							<Typography fontSize={"0.9rem"}>
								{templates_details[template]?.description}
							</Typography>
						</Box>
					)}
				</Box>
				<Box mt={2}>
					<Typography fontWeight={700}>Title</Typography>
					<TextField
						variant="standard"
						fullWidth
						value={title}
						error={Boolean(titleErr)}
						helperText={titleErr}
						onChange={(e) => {
							if (titleErr) setTitleErr("");
							setTitle(e.target.value);
						}}
					/>

					<Typography fontWeight={700} mt={2}>
						Privacy
					</Typography>

					<RadioGroup row defaultValue="public">
						<FormControlLabel
							value="public"
							control={<Radio />}
							label="public"
						/>
						<FormControlLabel
							disabled
							value="private"
							control={<Radio />}
							label="private"
						/>
					</RadioGroup>
					<LoadingButton
						loading={isLoading}
						fullWidth
						sx={{ mt: 2 }}
						variant="contained"
						onClick={create}
					>
						Create CloudBase
					</LoadingButton>
				</Box>
			</Box>
		</Dialog>
	);
};

const AutoComplateItem = ({ item }) => {
	const e = item;
	return (
		<Flex
			gap={1.5}
			{...e}
			sx={{
				p: 0.5,
				px: 1,
				borderRadius: 1,
			}}
		>
			<Box
				width={"2rem"}
				bgcolor={"primary.main"}
				sx={{
					aspectRatio: 1,
					borderRadius: 1,
				}}
			></Box>
			<Stack>
				<Typography lineHeight={1} fontWeight={500}>
					{templates_details[e.name]?.name }
				</Typography>
				<Typography variant="caption">cloudbase</Typography>
			</Stack>
		</Flex>
	);
};
export default SelectCodeBase;
