import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import "../App.css";
import { createStyles } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

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

export const AlreadyLogin = ({ langValue, setSubmitting }) => {
	const classes = useStyles();

	return (
		<>
			<div className={classes.UnderHalfcircle}>
				<h1 class="page_title">Party App</h1>
				<div className="centered-container">
					<div class="card_radius">
						<h4 style={{ color: "white", textAlign: "center" }}>
							You are already login/SignUp
						</h4>
						<Card
							sx={{ minWidth: "100%", maxWidth: "80%" }}
							class="card_radius"
						>
							{/* 私たちにCard contentの裏がCardなので、CSSが一見見えません */}
							<CardContent className={classes.WholeCard + " card_radius"}>
								<CardActions className={classes.BlueButton}>
									<Button
										size="small"
										onClick={() => (document.location = "/Profiles")}
										style={{
											margin: "auto",
											width: "70%",
										}}
									>
										<div
											style={{
												color: "white",
												fontWeight: "bold",
											}}
										>
											{langValue.Jump_profiles}
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
										onClick={() => (document.location = "/Profile_Submit")}
										size="small"
										style={{
											margin: "auto",
											width: "70%",
										}}
										className={classes.ovalTextField + " center-card-text"}
									>
										<div
											style={{
												color: "#6b68ff",
												fontWeight: "bold",
											}}
										>
											{langValue.Jump_Profile_Submit}
										</div>
									</Button>
									{/* </Link> */}
								</CardActions>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};
