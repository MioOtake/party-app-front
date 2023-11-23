import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Text from "../components/Text";
import { useState, useRef, useEffect } from "react";
import ImageCropper from "../components/ImageCropper"; // ImageCropperコンポーネントのファイルパスを指定
import "../App.css";
import { createStyles } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useCookies } from "react-cookie";
import { NeedLogin } from "../components/NeedLogin";

const useStyles = makeStyles(() =>
	createStyles({
		WholeCard: {
			color: "black",
			background: "#fafad2",
		},
		BlueButton: {
			color: "white",
			background: "#6b68ff",
			// borderRadius: "40%",
			borderRadius: "40px 40px",
		},
		WhiteButton: {
			color: "#6b68ff",
			background: "white",
			borderRadius: "40px 40px",
			border: "1px solid #6b68ff",
		},
		BlueBack: {
			background: "#6b68ff",
			height: "50%",
		},
		// textField: { [`& fieldset`]: { borderRadius: "40% 40% 40% 40%" } },
		ovalTextField: {
			"& .MuiOutlinedInput-root": { borderRadius: "40px 40px" },
			// borderRadius: "40px 40px"
			// background: "red",
		},
		Halfcircle: {
			width: "100%" /* 半円の横幅 */,
			height: "100px" /* 半円の高さ */,
			background: "#6b68ff" /* 半円の背景色 */,
			clipPath: "ellipse(50% 100% at 50% 100%)",
			// borderRadius: "50% 50% 0 0",
		},
		UnderHalfcircle: {
			width: "100%" /* 半円の横幅 */,
			height: "50vh" /* 半円の高さ */,
			background: "#6b68ff" /* 半円の背景色 */,
			borderRadius: "0 0 25% 25%",
		},
	})
);

export default function Profile_Submit({ langValue, setSubmitting }) {
	const [nameValue, setNameValue] = useState("");
	const [teamValue, setTeamValue] = useState("");
	const [othersValue, setOthersValue] = useState("");
	const [fileData, setFileData] = useState(null); // ファイルデータを保持するステート
	const [croppedData, setCroppedData] = useState(null);
	const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
	const [errorNameMessage, setErrorNameMessage] = useState("");
	const [errorTeamMessage, setErrorTeamMessage] = useState("");
	const [errorOthersMessage, setErrorOthersMessage] = useState("");
	const [cookies, setCookie, removeCookie] = useCookies(["session"]);

	console.log(nameValue + " " + teamValue + " " + othersValue);

	console.log(
		nameValue.length + " " + teamValue.length + " " + othersValue.length
	);

	const classes = useStyles();

	const handleSubmit = () => {
		console.log("sessionは");
		console.log(cookies["session"]);
		// データをJSON形式に整形
		const postData = {
			id: cookies["session"]["id"],
			name: nameValue,
			team: teamValue,
			others: othersValue,
			fileData: croppedData,
		};

		console.log("File Data:", fileData); // fileDataの中身をログに出力

		// PythonバックエンドのURLを指定
		const backendURL = process.env.REACT_APP_BACKEND_ENTRYPOINT + "/backend"; // あなたのバックエンドのURLに置き換えてください

		console.log("SUbmit the following data");
		console.log(postData);
		// データをPOSTリクエストで送信
		fetch(backendURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postData),
		})
			.then((response) => response.json())
			.then((data) => {
				// レスポンスを処理するコードをここに追加
				console.log(data);
				setSubmitting(false);
				// setCookie("session", data["user"]);
				window.alert(langValue.submit_complete);
				document.location = "/Profiles";
			})
			.catch((error) => {
				// エラーハンドリングを行うコードをここに追加
				console.error("Error:", error);
				window.alert(langValue.submit_fail);
			});
	};

	const handleOpenSubmitDialog = () => {
		if (
			nameValue.length != 0 &&
			teamValue.length != 0 &&
			othersValue.length != 0 &&
			croppedData != null
		) {
			//各textfieldに何かしら入力があった時の処理
			if (
				nameValue.match(/\S/g) === null ||
				teamValue.match(/\S/g) === null ||
				othersValue.match(/\S/g) === null
			) {
				// 空白のみの入力があった場合
				window.alert(langValue.donot_input_blankonly);
			} else {
				//空白のみの入力がなかった場合
				if (
					nameValue.length <= 30 &&
					teamValue.length <= 30 &&
					othersValue.length <= 300
				) {
					// 文字数制限で合格した場合
					setIsSubmitDialogOpen(true);
				} else {
					//　文字数制限でアウトだった場合
					window.alert(langValue.input_too_long);
				}
			}
		} else {
			// 入力されていないtextfieldがある場合の処理
			window.alert(langValue.input_all);
			if (nameValue.length == 0) {
				setErrorNameMessage(langValue.mandatory);
			}
			if (teamValue.length == 0) {
				setErrorTeamMessage(langValue.mandatory);
			}
			if (othersValue.length == 0) {
				setErrorOthersMessage(langValue.mandatory);
			}
		}
	};

	const handleConfirmSubmit = () => {
		// ボタンがクリックされたときの処理をここに記述
		// たとえば、フォームの送信処理を行う

		handleSubmit();

		// ポップアップを閉じる
		setIsSubmitDialogOpen(false);
		setSubmitting(true); //送信中のポップアップを表示するためtrueにする
	};

	const handleCloseSubmitDialog = () => {
		setIsSubmitDialogOpen(false);
	};

	const handleNameChange = (event) => {
		const inputValue = event.target.value;
		setNameValue(inputValue);

		if (inputValue.length <= 30) {
			setErrorNameMessage("");
		} else {
			setErrorNameMessage(langValue.please_input_30);
		}
	};

	const handleTeamChange = (event) => {
		const inputValue = event.target.value;
		setTeamValue(inputValue);
		if (inputValue.length <= 30) {
			setErrorTeamMessage("");
		} else {
			setErrorTeamMessage(langValue.please_input_30);
		}
	};

	const handleOthersChange = (event) => {
		const inputValue = event.target.value;
		setOthersValue(inputValue);

		if (inputValue.length <= 300) {
			setErrorOthersMessage("");
		} else {
			setErrorOthersMessage(langValue.please_input_300);
		}
	};

	const download = () => {
		fetch(process.env.REACT_APP_BACKEND_ENTRYPOINT + "/download_db");
	};

	return (
		<>
			{cookies["session"] ? (
				<>
					<div className="d-flex">
						<p style={{ marginRight: "10px" }}>
							User: {cookies["session"]["username"]}
						</p>
						<p
							style={{ cursor: "pointer", color: "#6b68ff" }}
							onClick={() => {
								removeCookie("session");
								document.location = "/";
							}}
						>
							ログアウト
						</p>
					</div>
					<h1
						className={classes.Halfcircle + " text"}
						style={{
							marginBottom: "0px",
							marginTop: "0px",
							display: "block",
							// transform: "translate(0%, 50%)",
							fontWeight: "bold",
						}}
					>
						<br></br>
						{langValue.Profile_input}
					</h1>
					<div class={classes.BlueBack}>
						{/* これは有効 */}
						<div class="centered-container-Profile-Submit">
							<div className={classes.BlueBack} style={{ marginTop: "30px" }}>
								<Card sx={{ minWidth: 275, maxWidth: 300 }}>
									<CardContent className={classes.WholeCard + " card_radius"}>
										<Typography
											sx={{ fontSize: 14 }}
											color="text.secondary"
											gutterBottom
											className={classes.ovalTextField}
										>
											<br />
											<TextField
												label="Name"
												value={nameValue} //変数みたいな感じ。
												onChange={handleNameChange} //こっちは入力して変更したときのイベント
												error={errorNameMessage !== ""}
												helperText={errorNameMessage}
											/>{" "}
											{/* 名前 */}
										</Typography>

										<Typography
											sx={{ fontSize: 14 }}
											color="text.secondary"
											gutterBottom
										>
											<br />
											<TextField
												label={langValue.team}
												value={teamValue}
												onChange={handleTeamChange} //こっちは入力して変更したときのイベント
												error={errorTeamMessage !== ""}
												helperText={errorTeamMessage}
												className={classes.ovalTextField}
											/>{" "}
											{/* チーム */}
										</Typography>
										<Typography
											sx={{ fontSize: 14 }}
											color="text.secondary"
											gutterBottom
										>
											<br />
											{/* その他 */}
											<TextField
												label={langValue.others}
												value={othersValue}
												onChange={handleOthersChange}
												error={errorOthersMessage !== ""}
												helperText={errorOthersMessage}
												className={classes.ovalTextField}
											/>{" "}
										</Typography>

										<Typography
											sx={{ fontSize: 14 }}
											color="text.secondary"
											gutterBottom
										>
											{langValue.your_image}
											{/* 画像 */}
											<div className={classes.ChooseFile}>
												<ImageCropper
													fileData={fileData}
													setFileData={setFileData}
													croppedData={croppedData}
													setCroppedData={setCroppedData}
													langValue={langValue}
												/>
											</div>
										</Typography>

										<br />

										<CardActions className={classes.BlueButton}>
											<Button
												size="small"
												onClick={handleOpenSubmitDialog}
												style={{
													margin: "auto",
													width: "50%",
												}}
											>
												<div
													className={` ${
														fileData && !croppedData ? "SubmitGray" : ""
													}`}
													style={{
														color: "white",
														fontWeight: "bold",
													}}
												>
													{langValue.submit}
												</div>
											</Button>
										</CardActions>
									</CardContent>
								</Card>

								<h6
									style={{
										color: "white",
									}}
								>
									{langValue.Back}
								</h6>
							</div>

							<Dialog
								open={isSubmitDialogOpen}
								onClose={handleCloseSubmitDialog}
							>
								<DialogTitle>{langValue.confirm}</DialogTitle>
								<DialogContent>
									<DialogContentText>
										{langValue.really_submit_question}
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleCloseSubmitDialog}>
										{langValue.cancel}
									</Button>
									<Button onClick={handleConfirmSubmit}>
										{langValue.submit}
									</Button>
								</DialogActions>
							</Dialog>
						</div>
					</div>
				</>
			) : (
				<NeedLogin langValue={langValue} />
			)}
		</>
	);
}
