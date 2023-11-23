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
import { useNavigate } from "react-router-dom";
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

export const SignUp = ({ langValue, setSubmitting }) => {
	const [usernameValue, setUsernameValue] = useState("");
	const [mailValue, setMailValue] = useState("");
	const [emailIsOK, setEmailIsOK] = useState(true);
	const emailRef = useRef(0);
	const mailRegex = new RegExp(
		/^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~.]+@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z0-9]+$/g
	);
	const passwordRegex = new RegExp(/^[a-zA-Z0-9]{8,}$/g);
	const [passValue, setPassValue] = useState("");
	const passwordRef = useRef(0);
	const [passwordIsOK, setPasswordIsOK] = useState(true);
	const [confirmPassValue, setConfirmPassValue] = useState("");
	const [confirmationPasswordIsOK, setConfirmationPasswordIsOK] =
		useState(true);
	const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
	const [cookies, setCookie, removeCookie] = useCookies(["session"]);
	const navigate = useNavigate();

	const classes = useStyles();
	useEffect(() => {
		if (emailRef.current <= 1) {
			emailRef.current += 1;
		} else {
			setEmailIsOK(mailRegex.test(mailValue));
		}
	}, [mailValue]);

	useEffect(() => {
		if (passwordRef.current <= 1) {
			passwordRef.current += 1;
		} else {
			setPasswordIsOK(passwordRegex.test(passValue));
		}
	}, [passValue]);
	useEffect(() => {
		setConfirmationPasswordIsOK(passValue === confirmPassValue);
	}, [passValue, confirmPassValue]);

	const handleSubmit = () => {
		// データをJSON形式に整形
		const postData = {
			username: usernameValue,
			mail: mailValue,
			pass: passValue,
		};

		// PythonバックエンドのURLを指定
		const backendURL = process.env.REACT_APP_BACKEND_ENTRYPOINT + "/SignUp"; // あなたのバックエンドのURLに置き換えてください

		if (
			usernameValue.length === 0 ||
			mailValue.length === 0 ||
			passValue.length === 0 ||
			confirmPassValue.length === 0
		) {
			alert(
				"入力されていない項目があります。" +
					"\n" +
					"There are fields that have not been filled in."
			);
		} else if (emailIsOK && passwordIsOK && confirmationPasswordIsOK) {
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
					console.log("追加された値は");
					console.log(data);
					setSubmitting(false);
					window.alert(langValue.Signup_complete);
					setCookie("session", data["user"]);
					document.location = "/Profiles";
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

	const handleUsernameChange = (event) => {
		const inputValue = event.target.value;
		setUsernameValue(inputValue);

		// if (inputValue.length <= 30) {
		//   setErrorNameMessage("");
		// } else {
		//   setErrorNameMessage(langValue.please_input_30);
		// }
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

	const handleConfirmPassChange = (event) => {
		const inputValue = event.target.value;
		setConfirmPassValue(inputValue);

		// if (inputValue.length >= 8) {
		//   setErrorNameMessage("");
		// } else {
		//   setErrorNameMessage(langValue.please_input_30);
		// }
	};

	const handleOpenSubmitDialog = () => {
		if (usernameValue != 0 && mailValue.length != 0 && passValue.length != 0) {
			//各textfieldに何かしら入力があった時の処理
			if (
				usernameValue.match(/\S/g) === null ||
				mailValue.match(/\S/g) === null ||
				passValue.match(/\S/g) === null
			) {
				// 空白のみの入力があった場合
				window.alert(langValue.donot_input_blankonly);
			} else {
				//空白のみの入力がなかった場合
				if (passValue.length >= 8) {
					if (
						usernameValue.length === 0 ||
						mailValue.length === 0 ||
						passValue.length === 0 ||
						confirmPassValue.length === 0
					) {
						alert(
							"入力されていない項目があります。" +
								"\n" +
								"There are fields that have not been filled in."
						);
					} else if (emailIsOK && passwordIsOK && confirmationPasswordIsOK) {
						setIsSubmitDialogOpen(true);
					} else {
						window.alert(langValue.Invalid_format_error);
					}
					// 文字数制限で合格した場合
				} else {
					//　文字数制限でアウトだった場合
					window.alert(langValue.input_too_short);
				}
			}
		} else {
			// 入力されていないtextfieldがある場合の処理
			window.alert(langValue.input_all);
			if (usernameValue.length == 0) {
				// setErrorNameMessage(langValue.mandatory);
			}
			if (mailValue.length == 0) {
				// setErrorNameMessage(langValue.mandatory);
			}
			if (passValue.length == 0) {
				// setErrorTeamMessage(langValue.mandatory);
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
									<h3 class="center-card-text">{langValue.Sign_up}</h3>

									<Typography
										sx={{ fontSize: 14 }}
										color="text.secondary"
										gutterBottom
										className={classes.ovalTextField}
									>
										<TextField
											label={langValue.User_name}
											value={usernameValue} //変数みたいな感じ。
											onChange={handleUsernameChange}
											onKeyDown={(e) => searchHandleKeyPress(e)}
											// className="round_shape"
											// error={errorNameMessage !== ""}
											// helperText={errorNameMessage}
										/>
										{/* user name */}
									</Typography>

									<Typography
										sx={{ fontSize: 14 }}
										color="text.secondary"
										gutterBottom
										className={classes.ovalTextField}
									>
										<br />
										<TextField
											label={langValue.Email_address}
											value={mailValue}
											onChange={handleMailChange}
											onKeyDown={(e) => searchHandleKeyPress(e)}
											InputProps={{
												sx: {
													backgroundColor: !emailIsOK ? "indianred" : "inherit",
												}, // 背景色を変更
											}}
											// error={errorTeamMessage !== ""}
											// helperText={errorTeamMessage}
										/>
										{emailIsOK || (
											<h6 style={{ color: "#bf0000" }}>
												{langValue.Invalid_email_format}
											</h6>
										)}
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
											InputProps={{
												sx: {
													backgroundColor: !passwordIsOK
														? "indianred"
														: "inherit",
												}, // 背景色を変更
											}}
											// error={errorTeamMessage !== ""}
											// helperText={errorTeamMessage}
										/>{" "}
										{/* Password */}
										{passwordIsOK || (
											<h6 style={{ color: "#bf0000" }}>
												{langValue.Invalid_pass_format}
											</h6>
										)}
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
											label={langValue.ConfirmPassword}
											value={confirmPassValue}
											onChange={handleConfirmPassChange}
											onKeyDown={(e) => searchHandleKeyPress(e)}
											InputProps={{
												sx: {
													backgroundColor: !confirmationPasswordIsOK
														? "indianred"
														: "inherit",
												}, // 背景色を変更
											}}
											// error={errorTeamMessage !== ""}
											// helperText={errorTeamMessage}
										/>
										{confirmationPasswordIsOK || (
											<h6 style={{ color: "#bf0000" }}>
												{langValue.Invalid_confirmpass_format}
											</h6>
										)}
										{/* Password */}
									</Typography>

									<br />
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
												{langValue.Sign_up}
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
											onClick={() => (document.location = "/")}
											size="small"
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
												{langValue.Log_in}
											</div>
										</Button>
										{/* </Link> */}
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
