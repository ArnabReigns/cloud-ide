import {
	Badge,
	Box,
	Button,
	InputBase,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import Flex from "../components/utils/Flex";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { File, Folder, FolderClosed } from "lucide-react";
import { appContext } from "../context/AppContexts";
import { Editor as MonacoEditor, useMonaco } from "@monaco-editor/react";

const Editor = () => {
	const [selected, setSelected] = useState(null);
	const [language, setLanguage] = useState("text");
	const ctx = useContext(appContext);
	const socket = ctx.socket;

	useEffect(() => {
		// return () => ctx.socketDisconnect();
	}, []);

	return !socket ? (
		<>trying to connect</>
	) : (
		<Flex
			gap={0}
			sx={{
				height: "100vh",
			}}
		>
			<PanelGroup direction="horizontal">
				<Panel defaultSize={15} minSize={15}>
					<FileTree setSelected={setSelected} socket={socket} />
				</Panel>
				<PanelResizeHandle />
				<Panel>
					<Code
						setLanguage={setLanguage}
						language={language}
						selected={selected}
						socket={socket}
					/>
				</Panel>
				<PanelResizeHandle />
				<Panel defaultSize={30} minSize={20}>
					<Terminal
						language={language}
						selected={selected}
						socket={socket}
					/>
				</Panel>
			</PanelGroup>
		</Flex>
	);
};

const languageMap = {
	js: {
		displayName: "JavaScript",
		mimeType: "application/javascript",
		extension: ".js",
	},
	py: {
		displayName: "Python",
		mimeType: "text/x-python",
		extension: ".py",
	},
	java: {
		displayName: "Java",
		mimeType: "text/x-java",
		extension: ".java",
	},
	c: {
		displayName: "C",
		mimeType: "text/x-c",
		extension: ".c",
	},
	cpp: {
		displayName: "CPP",
		mimeType: "text/x-c++",
		extension: ".cpp",
	},
	csharp: {
		displayName: "C#",
		mimeType: "text/x-csharp",
		extension: ".cs",
	},
	go: {
		displayName: "Go",
		mimeType: "text/x-go",
		extension: ".go",
	},
	ruby: {
		displayName: "Ruby",
		mimeType: "text/x-ruby",
		extension: ".rb",
	},
	php: {
		displayName: "PHP",
		mimeType: "application/x-httpd-php",
		extension: ".php",
	},
	html: {
		displayName: "HTML",
		mimeType: "text/html",
		extension: ".html",
	},
	css: {
		displayName: "CSS",
		mimeType: "text/css",
		extension: ".css",
	},
	sql: {
		displayName: "SQL",
		mimeType: "application/sql",
		extension: ".sql",
	},
	ts: {
		displayName: "TypeScript",
		mimeType: "application/typescript",
		extension: ".ts",
	},
	swift: {
		displayName: "Swift",
		mimeType: "text/x-swift",
		extension: ".swift",
	},
	kotlin: {
		displayName: "Kotlin",
		mimeType: "text/x-kotlin",
		extension: ".kt",
	},
	r: {
		displayName: "R",
		mimeType: "text/x-r",
		extension: ".r",
	},
	json: {
		displayName: "JSON",
		mimeType: "application/json",
		extension: ".json",
	},
	yaml: {
		displayName: "YAML",
		mimeType: "text/x-yaml",
		extension: ".yaml",
	},
	yml: {
		displayName: "YAML",
		mimeType: "text/x-yaml",
		extension: ".yml",
	},
	md: {
		displayName: "Markdown",
		mimeType: "text/markdown",
		extension: ".md",
	},
	mjs: {
		displayName: "JavaScript (ES Module)",
		mimeType: "application/javascript",
		extension: ".mjs",
	},
	jsx: {
		displayName: "JavaScript (JSX)",
		mimeType: "text/jsx",
		extension: ".jsx",
	},
	tsx: {
		displayName: "TypeScript (TSX)",
		mimeType: "text/tsx",
		extension: ".tsx",
	},
	lock: {
		displayName: "Lockfile",
		mimeType: "text/plain",
		extension: ".lock",
	},
	sh: {
		displayName: "Shell Script",
		mimeType: "application/x-sh",
		extension: ".sh",
	},
};

const runnableLangs = ["javascript", "python", "cpp", "c"];
const Code = ({ selected, socket, setLanguage, language }) => {
	const [code, setCode] = useState("");
	const [saved, setSaved] = useState(true);
	const selectedRef = useRef();

	useEffect(() => {
		setSaved((prev) => code == selected?.content);
	}, [code]);

	useEffect(() => {
		if (selected) {
			setCode(selected?.content);
			selectedRef.current = selected;

			const extension = selected.name.split(".").pop();
			setLanguage(languageMap[extension]?.displayName ?? "");
		}
	}, [selected]);

	useEffect(() => {
		socket.on("save:file:success", (data) => {
			setSaved(true);
		});
	}, []);

	return (
		<Box bgcolor={"#1E1E1E"} height={"100vh"}>
			{selected ? (
				<>
					<Flex p={1} width={"100%"} bgcolor={"#a8a8a8"}>
						<Typography fontWeight={500}>
							{selected?.name}
						</Typography>
						{!saved && (
							<Box
								sx={{
									borderRadius: "100%",
									height: "5px",
									aspectRatio: 1,
									bgcolor: "primary.main",
								}}
							/>
						)}
						<Typography ml={"auto"}>{language}</Typography>
					</Flex>

					<Box
						height={"100vh"}
						position={"relative"}
						p={1}
						py={2}
						bgcolor={"#1E1E1E"}
					>
						<MonacoEditor
							language={language.toLowerCase()}
							height={"100%"}
							width={"100%"}
							path={selected.name}
							defaultValue={selected.content}
							// value={code}
							onChange={(e) => setCode(e)}
							theme="vs-dark"
							onMount={(editor) => {
								editor.onKeyDown((e) => {
									if (e.ctrlKey && e.code == "KeyS") {
										e.preventDefault();
										if (e.keyCode === 49 && e.ctrlKey) {
											console.log({
												file: selectedRef.current.path,
												content: editor.getValue(),
											});
											socket.emit("save:file", {
												file: selectedRef.current.path,
												content: editor.getValue(),
											});
										}
									}
								});
							}}
						/>
					</Box>
				</>
			) : (
				<Stack
					height={"100%"}
					alignItems={"center"}
					justifyContent={"center"}
				>
					<Typography
						fontWeight={500}
						fontSize={"2rem"}
						color="#282828"
					>
						Select a File to Start
					</Typography>
				</Stack>
			)}
		</Box>
	);
};

const FileTree = ({ setSelected, socket }) => {
	const [files, setFiles] = useState([]);

	useEffect(() => {
		socket.emit("files");

		socket.on("files:update", (data) => {
			setFiles(data);
			console.log(data);
		});

		// Clean up the socket listener when the component unmounts
		return () => {
			socket.off("files:update");
		};
	}, []);

	// Recursive component to render files and directories
	const renderFileTree = (items) => {
		return (
			<Box pl={1}>
				{items.map((f, i) => (
					<Box key={i}>
						<Flex
							gap={0.5}
							onClick={(e) => {
								if (f.type === "file") {
									setSelected(f);
								}
							}}
							sx={{
								cursor: "pointer",
								":hover": {
									bgcolor: "#1E1E1E",
								},
								px: 1,
							}}
						>
							{f.type === "folder" ? (
								<FolderClosed size={"1rem"} />
							) : (
								<File size={"1rem"} />
							)}
							<Typography p={0.5} fontSize={"0.85rem"}>
								{f.name}
							</Typography>
							{/* If the item is a directory and has children, render them recursively */}
						</Flex>
						{f.type === "folder" &&
							f.children &&
							renderFileTree(f.children)}
					</Box>
				))}
			</Box>
		);
	};

	return (
		<>
			{files && (
				<Box
					p={1}
					pl={0}
					height={"100%"}
					bgcolor={"#282828"}
					color={"white"}
				>
					{renderFileTree(files)}
				</Box>
			)}
		</>
	);
};

const Terminal = ({ socket, selected, language }) => {
	const [commands, setCommands] = useState([]);
	const [cmd, setCmd] = useState("");
	const terminal = useRef();
	const termin = useRef();

	const [history, setHistory] = useState([]);

	useEffect(() => {
		socket.on("terminal:output", (data) => {
			let newCommand = {
				...data,
			};

			setCommands((prev) => [...prev, newCommand]);
		});

		return () => {
			socket.off("terminal:output");
		};
	}, []);

	useEffect(() => {
		// Scroll to the bottom whenever commands change
		if (terminal.current) {
			terminal.current.scrollTop = terminal.current.scrollHeight;
		}
	}, [commands]);

	const [pointer, setPointer] = useState(history.length);

	const run = () => {
		if (!selected) return;
		let runCommand = "";

		switch (language.toLowerCase()) {
			case "javascript":
				runCommand = "node " + selected.path;
				break;
			case "python":
				runCommand = "python " + selected.path;
				break;
			case "cpp":
				runCommand = `g++ ${selected.path} -o output.out && ./output.out`;
				break;
		}

		socket.emit("terminal:command", runCommand);
	};

	return (
		<>
			<Box
				p={2}
				bgcolor={"#282828"}
				color={"white"}
				ref={terminal}
				height={"100%"}
				// width={"25rem"}
				// ml={"auto"}
				overflow={"auto"}
				onClick={() => {
					termin.current.focus();
				}}
			>
				<Flex>
					<Typography>Terminal</Typography>
					<Button
						disabled={
							!runnableLangs.includes(language.toLowerCase())
						}
						sx={{ ml: "auto" }}
						size="small"
						onClick={run}
					>
						Run
					</Button>
				</Flex>

				{commands.map((com, idx) => (
					<Box mt={1} key={idx} onClick={(e) => e.stopPropagation()}>
						{/* <Typography>{com.type}</Typography> */}
						<Typography
							component={"pre"}
							// p={0.5}
							// bgcolor={"#262627"}
							variant="body2"
							color={com.type == "error" ? "red" : "white"}
							sx={{
								whiteSpace: "pre-wrap",
								overflowWrap: "break-word",
							}}
						>
							{com.output}
						</Typography>
					</Box>
				))}
				<InputBase
					fullWidth
					sx={{ color: "white" }}
					inputRef={termin}
					value={cmd}
					onChange={(e) => {
						setCmd(e.target.value);
					}}
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							if (cmd == "clear" || cmd == "cls") {
								setCommands([]);
								setPointer((p) => p + 1);
								setHistory((prev) => [...prev, cmd]);
							} else {
								console.log("command sent : " + cmd);
								socket.emit("terminal:command", cmd);
								setCommands((prev) => [
									...prev,
									{
										type: "command",
										output: cmd,
									},
								]);
							}
							setHistory((prev) => [...prev, cmd]);
							setPointer((p) => p + 1);
							setCmd("");
						}

						let his = [...history, ""];

						if (e.key == "ArrowDown") {
							e.preventDefault();
							console.log("down");
							if (pointer < his.length - 1) {
								setPointer((p) => p + 1);
								setCmd(his[pointer + 1]);
							}
							console.log(his, pointer);
						}
						if (e.key == "ArrowUp") {
							e.preventDefault();
							console.log("up");
							if (pointer > 0) {
								setPointer((p) => p - 1);
								setCmd(his[pointer - 1]);
							}
							console.log(his, pointer);
						}
					}}
				/>
			</Box>
		</>
	);
};

export default Editor;
