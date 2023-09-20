import * as React from "react";
import Box from "@mui/material/Box";
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

export default function Message({ langValue }) {
  const [nameValue, setNameValue] = useState("");
  const [teamValue, setTeamValue] = useState("");
  const [othersValue, setOthersValue] = useState("");
  const [fileData, setFileData] = useState(null); // ファイルデータを保持するステート
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

  const handleSubmit = () => {
    // データをJSON形式に整形
    const postData = {
      name: nameValue,
      team: teamValue,
      others: othersValue,
      fileData: fileData,
    };

    console.log("File Data:", fileData); // fileDataの中身をログに出力

    console.log(
      nameValue.length + " " + teamValue.length + " " + othersValue.length
    );

    if (
      nameValue.length != 0 &&
      teamValue.length != 0 &&
      othersValue.length != 0 &&
      fileData != null
    ) {
      if (
        nameValue.length <= 50 &&
        teamValue.length <= 50 &&
        othersValue.length <= 300
      ) {
        // PythonバックエンドのURLを指定
        const backendURL = "http://127.0.0.1:5000/backend"; // あなたのバックエンドのURLに置き換えてください

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
            window.alert("登録しました！リロードします！");
            window.location.reload();
          })
          .catch((error) => {
            // エラーハンドリングを行うコードをここに追加
            console.error("Error:", error);
            window.alert("登録が失敗しました。");
          });
      } else {
        window.alert("入力が正しくありません");
      }
    } else {
      window.alert("すべて入力してください");
    }
  };

  const handleOpenSubmitDialog = () => {
    setIsSubmitDialogOpen(true);
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
      setErrorNameMessage("30文字以内で入力してください");
    }
  };

  const handleTeamChange = (event) => {
    const inputValue = event.target.value;
    setTeamValue(inputValue);
    if (inputValue.length <= 30) {
      setErrorTeamMessage("");
    } else {
      setErrorTeamMessage("30文字以内で入力してください");
    }
  };

  const handleOthersChange = (event) => {
    const inputValue = event.target.value;
    setOthersValue(inputValue);

    if (inputValue.length <= 300) {
      setErrorOthersMessage("");
    } else {
      setErrorOthersMessage("300文字以内で入力してください");
    }
  };

  return (
    <>
      <Card sx={{ minWidth: 275, maxWidth: 300 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {langValue.name_nickname} <br />
            <TextField
              label="Name"
              value={nameValue} //変数みたいな感じ。
              onChange={handleNameChange} //こっちは入力して変更したときのイベント
              error={errorNameMessage !== ""}
              helperText={errorNameMessage}
            />{" "}
            {/* 名前 */}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {langValue.team}
            <br />
            <TextField
              label="Team"
              value={teamValue}
              onChange={handleTeamChange} //こっちは入力して変更したときのイベント
              error={errorTeamMessage !== ""}
              helperText={errorTeamMessage}
            />{" "}
            {/* チーム */}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {langValue.others}
            <br />
            {/* その他 */}
            <TextField
              label="Others"
              value={othersValue}
              onChange={handleOthersChange}
              error={errorOthersMessage !== ""}
              helperText={errorOthersMessage}
            />{" "}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {langValue.your_image}
            {/* 画像 */}
            <div>
              <ImageCropper fileData={fileData} setFileData={setFileData} />
            </div>
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleOpenSubmitDialog}>
            {langValue.submit}
          </Button>
        </CardActions>
      </Card>

      <Dialog open={isSubmitDialogOpen} onClose={handleCloseSubmitDialog}>
        <DialogTitle>確認</DialogTitle>
        <DialogContent>
          <DialogContentText>本当に送信しますか？</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitDialog} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary">
            送信
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
