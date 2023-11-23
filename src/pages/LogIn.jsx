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
import { useState, useRef, useEffect } from "react";
import "../App.css";
import { createStyles } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useCookies } from "react-cookie";
import { AlreadyLogin } from "../components/AlreadyLogin";

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

		UnderHalfcircle: {
			width: "100%" /* 半円の横幅 */,
			height: "50vh" /* 半円の高さ */,
			background: "#6b68ff" /* 半円の背景色 */,
			borderRadius: "0 0 25% 25%",
		},
	})
);

export const LogIn = ({ langValue, setSubmitting }) => {
	const [mailValue, setMailValue] = useState("");
	const [emailIsOK, setEmailIsOK] = useState(true);
	const emailRef = useRef(0);
	const mailRegex = new RegExp(
		/^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~.]+@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z0-9]+$/g
	);

	const [passValue, setPassValue] = useState("");
	const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
	const [cookies, setCookie, removeCookie] = useCookies(["session"]);

	const classes = useStyles();

	useEffect(() => {
		if (emailRef.current <= 1) {
			emailRef.current += 1;
		} else {
			setEmailIsOK(mailRegex.test(mailValue));
		}
	}, [mailValue]);

	const handleSubmit = () => {
		// データをJSON形式に整形
		const postData = {
			mail: mailValue,
			pass: passValue,
		};

		// PythonバックエンドのURLを指定
		const backendURL = process.env.REACT_APP_BACKEND_ENTRYPOINT + "/LogIn"; // あなたのバックエンドのURLに置き換えてください

		if (mailValue.length === 0) {
			alert(
				"入力されていない項目があります。" +
					"\n" +
					"There are fields that have not been filled in."
			);
		} else if (emailIsOK) {
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
					if (data["user"]) {
						setCookie("session", data["user"]);
						window.alert(langValue.submit_complete);
						document.location = "/Profiles";
					} else {
						window.alert(langValue.Login_fail);
					}
					// window.location.reload();
				})
				.catch((error) => {
					// エラーハンドリングを行うコードをここに追加
					console.error("Error:", error);
					window.alert(langValue.submit_fail);
				});
		} else {
			window.alert(langValue.Invalid_format_error);
		}
	};

	const handleMailChange = (event) => {
		const inputValue = event.target.value;
		setMailValue(inputValue);

		// if (inputValue.length <= 30) {
		//   setErrorNameMessage("");
		// } else {
		//   setErrorNameMessage(langValue.please_input_30);
		// }
	};

	const handlePassChange = (event) => {
		const inputValue = event.target.value;
		setPassValue(inputValue);

		// if (inputValue.length >= 8) {
		//   setErrorNameMessage("");
		// } else {
		//   setErrorNameMessage(langValue.please_input_30);
		// }
	};

	const handleConfirmSubmit = () => {
		// ボタンがクリックされたときの処理をここに記述
		// たとえば、フォームの送信処理を行う

		handleSubmit();

		// ポップアップを閉じる
		setIsSubmitDialogOpen(false);
		setSubmitting(true); //送信中のポップアップを表示するためtrueにする
	};

	function searchHandleKeyPress(e) {
		if (e.code === "Enter") {
			handleConfirmSubmit();
		}
		return false;
	}

	return (
		<>
			{cookies["session"] ? (
				<AlreadyLogin langValue={langValue} />
			) : (
				<div className={classes.UnderHalfcircle}>
					<h1 class="page_title">Party App</h1>
					<div className="centered-container">
						<div class="card_radius">
							<Card sx={{ minWidth: 275, maxWidth: 300 }} class="card_radius">
								{/* 私たちにCard contentの裏がCardなので、CSSが一見見えません */}
								<CardContent className={classes.WholeCard + " card_radius"}>
									<h3 class="center-card-text">{langValue.Log_in}</h3>

									<Typography
										sx={{ fontSize: 14 }}
										color="text.secondary"
										gutterBottom
										className={classes.ovalTextField}
									>
										<TextField
											label={langValue.Email_address}
											value={mailValue} //変数みたいな感じ。
											onChange={handleMailChange}
											onKeyDown={(e) => searchHandleKeyPress(e)}
											InputProps={{
												sx: {
													backgroundColor: !emailIsOK ? "indianred" : "inherit",
												}, // 背景色を変更
											}}
											// className="round_shape"
											// error={errorNameMessage !== ""}
											// helperText={errorNameMessage}
										/>
										{emailIsOK || (
											<h6 style={{ color: "#bf0000" }}>
												{langValue.Invalid_email_format}
											</h6>
										)}
										{/* Mail */}
									</Typography>

									<Typography
										sx={{ fontSize: 14 }}
										color="text.secondary"
										gutterBottom
										className={classes.ovalTextField}
									>
										<br />
										<TextField
											type="password"
											label={langValue.Password}
											value={passValue}
											onChange={handlePassChange}
											onKeyDown={(e) => searchHandleKeyPress(e)}
											// error={errorTeamMessage !== ""}
											// helperText={errorTeamMessage}
										/>{" "}
										{/* Password */}
									</Typography>

									<div className={"center-card-text" + " blueword"}>
										{langValue.forget_pass}
									</div>

									<br />

									<CardActions className={classes.BlueButton}>
										<Button
											size="small"
											onClick={handleConfirmSubmit}
											style={{
												margin: "auto",
												width: "50%",
											}}
										>
											<div
												style={{
													color: "white",
													fontWeight: "bold",
												}}
											>
												{langValue.Log_in}
											</div>
										</Button>
									</CardActions>

									<div className={classes.WholeCard + " center-card-text"}>
										{langValue.or}
									</div>

									<CardActions
										className={classes.WhiteButton + " center-card-text"}
									>
										<Button
											size="small"
											onClick={() => (document.location = "/SignUp")}
											style={{
												margin: "auto",
												width: "50%",
											}}
											className={classes.ovalTextField + " center-card-text"}
										>
											<div
												style={{
													color: "#6b68ff",
													fontWeight: "bold",
												}}
											>
												{langValue.Sign_up}
											</div>
										</Button>
									</CardActions>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
