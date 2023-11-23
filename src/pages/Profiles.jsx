import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import Text from "../components/Text";
import { createStyles } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useCookies } from "react-cookie";
import { NeedLogin } from "../components/NeedLogin";
//TODO
//編集ボタンが同化しちゃう
//ProfilesとProfile_Submitの左上に表示されているUser名のスタイル
//自分のプロフィールにYouみたいなの入れたい
//ユーザー削除機能
//Profilesを自分のチームのみに変更->Team名をどこかに保存しておく必要ある
//jsonをダウンロードできる機能追加

const useStyles = makeStyles(() =>
	createStyles({
		WholeCard: {
			color: "black",
			backgroundColor: "#ffffe0",
		},
		BlueButton: {
			color: "white",
			background: "#6b68ff",
		},
		WhiteButton: {
			color: "#6b68ff",
			background: "white",
		},
		BlueBack: {
			background: "#6b68ff",
			border: "none",
		},
		Halfcircle: {
			width: "100%" /* 半円の横幅 */,
			height: "100px" /* 半円の高さ */,
			background: "#6b68ff" /* 半円の背景色 */,
			// borderRadius: "50% 50% 0 0",
			clipPath: "ellipse(50% 100% at 50% 100%)",
		},
	})
);

function MediaCard({ langValue, submitting }) {
	const [jsonData, setJsonData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);
	const [showAllOthers, setShowAllOthers] = useState(false);
	const [showFullText, setShowFullText] = useState([]);
	const [cookies, setCookie, removeCookie] = useCookies(["session"]);

	const classes = useStyles();
	console.log(cookies);

	// サーバーからJSONデータを取得する関数
	// const fetchData = async () => {
	// 	if (cookies["session"]["team"]) {
	// 		const postData = {
	// 			team: cookies["session"]["team"],
	// 		};
	// 		try {
	// 			const response = await fetch(
	// 				process.env.REACT_APP_BACKEND_ENTRYPOINT + "/get_json_data",
	// 				{
	// 					method: "POST",
	// 					headers: {
	// 						"Content-Type": "application/json",
	// 					},
	// 					body: JSON.stringify(postData),
	// 				}
	// 			);

	// 			const data = await response.json();
	// 			setJsonData(data); // JSONデータをステートに設定
	// 			setLoading(false);
	// 			console.log(data);
	// 			// 長さが20で、すべての要素がfalseの配列を作成
	// 			const myArray = new Array(data.length).fill(false);
	// 			setShowFullText(myArray);
	// 		} catch (error) {
	// 			console.error("データの取得に失敗しました", error);
	// 		}
	// 	} else {
	// 		setJsonData([]); // JSONデータをステートに設定
	// 		setLoading(false);
	// 		const myArray = new Array(0).fill(false);
	// 		setShowFullText(myArray);
	// 	}
	// };
	const fetchData = async () => {
		if (cookies["session"]) {
			const postData = {
				team: cookies["session"]["team"],
			};
			try {
				const response = await fetch(
					process.env.REACT_APP_BACKEND_ENTRYPOINT + "/get_json_data"
				);
				const data = await response.json();
				setJsonData(data); // JSONデータをステートに設定
				setLoading(false);
				console.log(data);
				// 長さが20で、すべての要素がfalseの配列を作成
				const myArray = new Array(data.length).fill(false);
				setShowFullText(myArray);
			} catch (error) {
				console.error("データの取得に失敗しました", error);
			}
		}
	};
	useEffect(() => {
		fetchData(); // データを取得する関数を実行
	}, []); //［］なら最初だけ実行する

	const handleDelete = (itemId) => {
		setItemToDelete(itemId);
		setIsDeleteDialogOpen(true);
	};

	const deleteItem = (id) => {
		console.log(id);

		const postData = {
			id: id,
		};
		// PythonバックエンドのURLを指定
		const backendURL = process.env.REACT_APP_BACKEND_ENTRYPOINT + "/delete"; // あなたのバックエンドのURLに置き換えてください

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
				fetchData();
				window.alert(langValue.delete_complete);
				// window.location.reload();
			})
			.catch((error) => {
				// エラーハンドリングを行うコードをここに追加
				console.error("Error:", error);
				// window.alert("削除できませんでした");
			});

		// 削除が完了したらダイアログを閉じる
		setIsDeleteDialogOpen(false);
	};

	const confirmDelete = () => {
		// 実際の削除処理を行う
		// itemToDelete を使用してカードを削除するコードをここに追加
		deleteItem(itemToDelete);
	};

	const cancelDelete = () => {
		// 削除をキャンセルした場合、ダイアログを閉じる
		setIsDeleteDialogOpen(false);
	};

	// 表示するテキストの最大文字数
	const maxCharacters = 20;

	// テキストを折り返す関数
	const foldText = (text) => {
		return text.length > maxCharacters ? text.slice(0, maxCharacters) : text;
	};

	return (
		<>
			{cookies["session"] ? (
				<>
					<div class="parent_button">
						<a href="/Profile_Submit" class="fixed_btn">
							<p class="plus">📝</p>
						</a>
						{/* <button class="fixed_btn">
        </button> */}
					</div>
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
					<div class="bluetext">
						<br></br>
						<h4 style={{ fontWeight: "bold" }}>{langValue.greeting} </h4>
						<h4 style={{ fontWeight: "bold" }}>{langValue.inputprofile} </h4>
						<br></br>
					</div>
					<div className={classes.Halfcircle + " text"}>
						<br></br>
						<h1 style={{ fontWeight: "bold" }}>{langValue.profiles} </h1>
					</div>
					<div>
						{loading ? (
							<>
								<div className="popup-overlay">
									<div className="popup-content">
										<ReactLoading
											type="spin"
											color="#3366ff"
											height="50px"
											width="50px"
											className="mx-auto"
										/>
										<p className="text-center mt-3">{langValue.Loading}</p>
									</div>
								</div>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										margin: "0",
										minHeight: "100vh",
									}}
									className={classes.BlueBack}
								></div>
							</>
						) : submitting ? (
							// submittingがtrueの場合の処理をここに記述
							<>
								<div className="popup-overlay">
									<div className="popup-content">
										<ReactLoading
											type="spin"
											color="#3366ff"
											height="50px"
											width="50px"
											className="mx-auto"
										/>
										<p className="text-center mt-3">{langValue.submitting}</p>
									</div>
								</div>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										margin: "0",
										minHeight: "100vh",
									}}
									className={classes.BlueBack}
								></div>
							</>
						) : (
							// submittingがfalseかつloadingがfalseの場合の処理をここに記述
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									marginTop: "0",
									minHeight: "100vh",
								}}
								className={classes.BlueBack}
							>
								{jsonData.length !== 0 ? (
									jsonData.map((item, index) => (
										<div
											key={index}
											style={{
												flexBasis: "50%",
												padding: "10px",
												maxWidth: "50%",
											}}
											className={classes.BlueBack}
										>
											<Card
												variant="outlined"
												style={{
													width: "100%",
													height: "auto",
													minHeight: "400px",
													display: "flex",
													flexDirection: "column",
												}}
											>
												<div style={{ flex: "3" }}>
													<img
														src={item.fileData}
														alt="Image"
														style={{
															width: "100%",
															height: "100%",
															objectFit: "cover",
														}}
													/>
												</div>

												<CardContent
													style={{
														flex: "60",
														wordWrap: "break-word", // word-wrapの設定
													}}
													className={classes.WholeCard}
												>
													{/* <div
                      style={{
                        maxHeight: showAllOthers ? "none" : "2.4em", // 2.4emは約2行分の高さ
                        WebkitLineClamp: showAllOthers ? "unset" : 2, // ブラウザごとに異なる可能性があるので注意
                        display: "-webkit-box", // ブラウザごとに必要
                      }}
                    > */}

													<h5
														style={{
															whiteSpace: "pre-line",
															width: "100%",
														}}
													>
														<b>
															{item.name}
															{/* {item.name.match(/.{1,17}/g).join("\n")} */}
														</b>
													</h5>
													<div
														style={{
															whiteSpace: "pre-line",
															width: "100%",
														}}
													>
														Team:
														{/* Team: {item.team} */}
														{/* Team: {item.team.match(/.{1,17}/g).join("\n")} */}
														{showFullText[index] //文字を省略するかしないか
															? item.team + "\n" + item.others
															: foldText(item.team + "\n" + item.others)}
														{item.team.length + item.others.length >
															maxCharacters && ( //矢印付け加える
															<span
																onClick={() => {
																	const newArray = [...showFullText]; // 配列のコピーを作成
																	newArray[index] = !newArray[index]; // インデックスiの要素を反転
																	setShowFullText(newArray); // 新しい配列でsetStateを更新
																}}
																style={{
																	cursor: "pointer",
																	color: "blue",
																	marginLeft: "5px",
																}}
															>
																{showFullText[index] ? "▲" : "▼"}
															</span>
														)}
													</div>
												</CardContent>
												<CardActions className={classes.WholeCard}>
													<Button
														size="small"
														onClick={() => handleDelete(item.id)}
													>
														{" "}
														{langValue.delete}
													</Button>
												</CardActions>
											</Card>

											{/* 削除確認ダイアログ */}
											<Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
												<DialogTitle>
													{langValue.delete_confirmation}
												</DialogTitle>
												<DialogContent>
													<DialogContentText>
														{langValue.really_delete_question}
													</DialogContentText>
												</DialogContent>
												<DialogActions>
													<Button onClick={cancelDelete} color="primary">
														{langValue.no}
													</Button>
													<Button onClick={confirmDelete} color="primary">
														{langValue.yes}
													</Button>
												</DialogActions>
											</Dialog>
										</div>
									))
								) : (
									<h2 style={{ color: "white" }}>
										{langValue.No_profile_result}
									</h2>
								)}
							</div>
						)}
					</div>
				</>
			) : (
				<NeedLogin langValue={langValue} />
			)}
		</>
	);
}

export default MediaCard;
