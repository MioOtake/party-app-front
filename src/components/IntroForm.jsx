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
import ImageCropper from "./ImageCropper"; // ImageCropperコンポーネントのファイルパスを指定
import "../App.css";

export default function Message({ langValue }) {
  const [nameValue, setNameValue] = useState("");
  const [teamValue, setTeamValue] = useState("");
  const [othersValue, setOthersValue] = useState("");
  const [fileData, setFileData] = useState(null); // ファイルデータを保持するステート
  const [croppedData, setCroppedData] = useState(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [errorTeamMessage, setErrorTeamMessage] = useState("");
  const [errorOthersMessage, setErrorOthersMessage] = useState("");

  console.log(nameValue + " " + teamValue + " " + othersValue);

  // const onFileInputChange = (event) => {
  //   const selectedFile = event.target.files[0]; // 最初の選択されたファイルを取得

  //   if (selectedFile) {
  //     const reader = new FileReader();

  //     // ファイルの読み込みが完了したときの処理
  //     reader.onload = (e) => {
  //       const fileBinaryData = e.target.result; // ファイルの生データ（バイナリデータ）を取得

  //       // ファイルの生データをbase64に変換
  //       const base64Data = btoa(fileBinaryData);

  //       // ファイルのbase64でエンコードしたデータをステートに設定
  //       setFileData(base64Data);
  //     };

  //     // ファイルを読み込む
  //     reader.readAsBinaryString(selectedFile);
  //   }
  // };

  // サーバーからJSONデータを取得する関数
  console.log(
    nameValue.length + " " + teamValue.length + " " + othersValue.length
  );

  const handleSubmit = () => {
    // データをJSON形式に整形
    const postData = {
      name: nameValue,
      team: teamValue,
      others: othersValue,
      fileData: croppedData,
    };

    console.log("File Data:", fileData); // fileDataの中身をログに出力

    // PythonバックエンドのURLを指定
    const backendURL = "https://party-back.onrender.com/backend"; // あなたのバックエンドのURLに置き換えてください

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
        window.alert(langValue.submit_complete);
        window.location.reload();
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
      if (
        nameValue.length <= 30 &&
        teamValue.length <= 30 &&
        othersValue.length <= 300
      ) {
        setIsSubmitDialogOpen(true);
      } else {
        window.alert(langValue.input_too_long);
      }
    } else {
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

  return (
    <>
      <div>
        <Card sx={{ minWidth: 275, maxWidth: 300 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {langValue.name_nickname} <br />
              <TextField
                // label="Name"
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
              {langValue.team}
              <br />
              <TextField
                // label={langValue.team}
                value={teamValue}
                onChange={handleTeamChange} //こっちは入力して変更したときのイベント
                error={errorTeamMessage !== ""}
                helperText={errorTeamMessage}
              />{" "}
              {/* チーム */}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {langValue.others}
              <br />
              {/* その他 */}
              <TextField
                // label={langValue.others}
                value={othersValue}
                onChange={handleOthersChange}
                error={errorOthersMessage !== ""}
                helperText={errorOthersMessage}
              />{" "}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {langValue.your_image}
              {/* 画像 */}
              <div>
                <ImageCropper
                  fileData={fileData}
                  setFileData={setFileData}
                  croppedData={croppedData}
                  setCroppedData={setCroppedData}
                  langValue={langValue}
                />
              </div>
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleOpenSubmitDialog}>
              <div
                className={` ${fileData && !croppedData ? "SubmitGray" : ""}`}
              >
                {langValue.submit}
              </div>
            </Button>
          </CardActions>
        </Card>

        <Dialog open={isSubmitDialogOpen} onClose={handleCloseSubmitDialog}>
          <DialogTitle>{langValue.confirm}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {langValue.really_submit_question}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSubmitDialog} color="primary">
              {langValue.cancel}
            </Button>
            <Button onClick={handleConfirmSubmit} color="primary">
              {langValue.submit}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}