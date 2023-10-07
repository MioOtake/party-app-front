import * as React from "react";
import axios from "axios";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState, useCallback, useRef } from "react";
// import Cropper from "react-image-crop";
import Cropper, { CropperProps, Point, Area } from "react-easy-crop";
import Slider from "@mui/material/Slider";
// import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./IntroForm.css";
import { langdata } from "../langpack";
//トリミング機能(ボタンの位置いい感じに)
//チームでフィルタ
//submitやdeleteのあと、API読んでる時間にローディング中表示
//トリミングのzoomをもっと細かく設定できるように(SPだと問題なさそう)
//言語でalert追加した部分対応

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}
export const IntroForm = (props: { language: string }) => {
  const { language } = props;
  // const [language, setLanguage] = useState<string>("English");
  const [nameInitialized, setNameInitialized] = useState(false);
  const [teamInitialized, setTeamInitialized] = useState(false);
  const [otherInitialized, setOtherInitialized] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [nameIsOK, setNameIsOK] = useState(true);
  const [teamIsOK, setTeamIsOK] = useState(true);
  const [otherIsOK, setOtherIsOK] = useState(true);
  const [teamValue, setTeamValue] = useState("");
  const [othersValue, setOthersValue] = useState("");

  const [base64Data, setBase64Data] = useState<string>("");
  const [image, setImage] = useState<any>(null); // 画像のURLまたはファイルを格納
  const [crop, setCrop] = useState<Area>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  }); // クロップ情報
  const [zoom, setZoom] = useState<number>(1); // ズームレベル
  const cropperRef = useRef<any>(null);
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [croppedImage, setCroppedImage] = useState<any>(null);

  console.log("langdataは");
  console.log(langdata);

  useEffect(() => {
    // 最初のレンダリング時には実行されないコード
    if (nameInitialized) {
      // ここに実行したいコードを書きます
      nameValue !== "" ? setNameIsOK(true) : setNameIsOK(false);
    } else {
      // 初回レンダリング時に実行されるコード
      setNameInitialized(true);
    }
  }, [nameValue]);
  useEffect(() => {
    // 最初のレンダリング時には実行されないコード
    if (teamInitialized) {
      // ここに実行したいコードを書きます
      teamValue !== "" ? setTeamIsOK(true) : setTeamIsOK(false);
    } else {
      // 初回レンダリング時に実行されるコード
      setTeamInitialized(true);
    }
  }, [teamValue]);
  useEffect(() => {
    // 最初のレンダリング時には実行されないコード
    if (otherInitialized) {
      // ここに実行したいコードを書きます
      othersValue !== "" ? setOtherIsOK(true) : setOtherIsOK(false);
    } else {
      // 初回レンダリング時に実行されるコード
      setOtherInitialized(true);
    }
  }, [othersValue]);
  const hundleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      nameValue !== "" &&
      teamValue !== "" &&
      othersValue !== "" &&
      croppedImage !== ""
    ) {
      try {
        // データをJSON形式にまとめる
        const data = {
          name: nameValue,
          Team: teamValue,
          Other: othersValue,
          image: croppedImage,
        };

        // POSTリクエストを送信
        const response = await axios.post(
          // "https://selfintroductionapp-back.onrender.com/add_item",
          "http://localhost:3004/add_item",
          data
        );

        // リクエストが成功した場合の処理
        console.log("POSTリクエストが成功しました。", response.data);
        alert("登録成功！ページをリロードします");
        window.location.reload();
      } catch (error) {
        // リクエストが失敗した場合のエラーハンドリング
        console.error("POSTリクエストが失敗しました。", error);
      }
    } else {
      alert(langdata[language].submit_error);
      // alert("Name, Team, Othersには何か入力してください");
      // console.log("NG");
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64String = event.target?.result?.toString()?.split(",")[1];
        if (base64String) {
          setBase64Data(base64String);
          setImage(event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
      setCropping(true);
    }
  };
  // const onCropComplete = async (croppedArea: Area) => {
  // 	// クロップが完了したときに実行されるコールバック
  // 	console.log("トリミングcomplete");
  // 	console.log(croppedArea);
  // 	setCroppedAreaPixels(croppedArea);
  // 	if (croppedArea && image) {
  // 		console.log("トリミングします");
  // 		const croppedImage = await getCroppedImg(image, croppedArea);
  // 		setCroppedImage(croppedImage);
  // 	}
  // };
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropChange = (crop: Point) => {
    setCrop(crop as Area);
    console.log(crop);
  };
  const handleZoomChange = (zoom: number) => {
    // console.log(zoom);
    setZoom(zoom);
    // setZoom((prevZoom) => {
    // 	console.log(prevZoom);
    // 	console.log(zoom);
    // 	if (prevZoom <= zoom) {
    // 		return Math.min(prevZoom + 0.1, 3);
    // 	} else {
    // 		return Math.max(prevZoom - 0.1, 1);
    // 	}
    // });
  };
  // const handleZoomChange = (zoomLevel: number) => {
  // 	// setZoom(zoom);
  // 	const zoomSensitivity = 0.1; // ズームの速度を調整するためにこの値を変更できます
  // 	if (zoomLevel > 0) {
  // 		setZoom((prevZoom) => Math.min(3, prevZoom + zoomSensitivity));
  // 	} else if (zoomLevel < 0) {
  // 		setZoom((prevZoom) => Math.max(1, prevZoom - zoomSensitivity));
  // 	}
  // };
  const resetCrop = () => {
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
    setZoom(1);
  };
  const handleCropImage = async () => {
    if (croppedAreaPixels && image) {
      console.log("トリミングします");
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImage);
    }
    setCropping(false);
  };
  const getCroppedImg = async (
    base64Image: string,
    croppedAreaPixels: CroppedAreaPixels
  ): Promise<string> => {
    const image = new Image();
    image.src = base64Image;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas context not available");
    }

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Failed to create blob for cropped image");
        }
        // BlobからDataURLを作成して、それをresolveします。
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result.toString()?.split(",")[1]);
          } else {
            throw new Error("Failed to read data URL");
          }
        };
        reader.readAsDataURL(blob);
      }, "image/jpeg");
    });
  };
  return (
    <>
      <Card sx={{ minWidth: 275, maxWidth: 300 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {langdata[language].name_nickname}:{/* Name / Nickname: */}
            <br />
            <TextField
              label="Name"
              className={`mb-3 ml-3 ${nameIsOK ? "" : "not-appropriate"}`}
              value={nameValue} //変数みたいな感じ。
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setNameValue(event.target.value)
              } //こっちは入力して変更したときのイベント
            />{" "}
            {nameIsOK || (
              <h6 className="ml-3" style={{ color: "#bf0000" }}>
                {langdata[language].name_rule_error}
              </h6>
            )}
            {/* 名前 */}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {langdata[language].team}:
            <br />
            <TextField
              label="Team"
              className={`mb-3 ml-3 ${teamIsOK ? "" : "not-appropriate"}`}
              value={teamValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setTeamValue(event.target.value)
              } //こっちは入力して変更したときのイベント
            />{" "}
            {teamIsOK || (
              <h6 className="ml-3" style={{ color: "#bf0000" }}>
                {langdata[language].team_rule_error}
              </h6>
            )}
            {/* チーム */}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {langdata[language].others}:
            {/* Others{"("}hobby, greetings, etc...{")"}: */}
            <br />
            {/* その他 */}
            <TextField
              label="Others"
              className={`mb-3 ml-3 ${otherIsOK ? "" : "not-appropriate"}`}
              value={othersValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setOthersValue(event.target.value)
              } //こっちは入力して変更したときのイベント
            />{" "}
            {otherIsOK || (
              <h6 className="ml-3" style={{ color: "#bf0000" }}>
                {langdata[language].others_rule_error}
              </h6>
            )}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {langdata[language].your_image}:{/* 画像 */}
            <div>
              {/* <button onClick={fileUpload}>ファイルアップロード</button> */}
              {/* <label>
								{langdata[language].select_files} */}
              <label style={{ display: "inline-block", position: "relative" }}>
                <span
                  style={{
                    display: "block",
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {langdata[language].select_files}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileInputChange}
                  style={{ display: "none" }}
                />
              </label>
              {/* <input
								type="file"
								style={{ content: "aaaa" }}
								accept="image/*"
								onChange={onFileInputChange}
							/> */}
              {/* {base64Data && (
								<div>
									<img
										style={{ height: "100px", width: "auto" }}
										// src={base64Data}
										src={"data:image/jpeg;base64," + base64Data}
										alt="選択された画像"
									/>
								</div>
							)} */}
              {cropping && (
                <>
                  <div className="crop-container">
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3} // 画像のアスペクト比を設定
                      onCropChange={handleCropChange}
                      onCropComplete={onCropComplete}
                      onZoomChange={handleZoomChange}
                      // cropShape="round" // クロップの形状を設定
                      showGrid={false} // グリッドを非表示にする
                      ref={cropperRef}
                    />
                  </div>
                  <div className="controls">
                    <Slider
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e, zoom) => setZoom(Number(zoom))}
                      classes={{ root: "slider" }}
                    />
                  </div>
                  <Button onClick={resetCrop}>Reset Crop</Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCropImage}
                  >
                    トリミング
                  </Button>
                </>
              )}
              <div>
                <img
                  style={{ height: "100px", width: "auto" }}
                  // src={base64Data}
                  src={"data:image/jpeg;base64," + croppedImage}
                  alt=""
                />
              </div>
            </div>
            {/* <Cropper
							image={"Images/Summer Zoom pic.jpg"}
							crop={crop}
							zoom={zoom}
							aspect={4 / 3}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onZoomChange={setZoom}
						/> */}
            {/* <Cropper
							image={"Images/Summer Zoom pic.jpg"}
							crop={state.crop}
							zoom={state.zoom}
							aspect={state.aspect}
							onCropChange={onCropChange}
							onCropComplete={onCropComplete}
							onZoomChange={onZoomChange}
						/> */}
            {/* {src && (
							<Cropper
								src={src}
								crop={crop}
								onChange={(newCrop) => setCrop(newCrop)}
								onComplete={handleCropComplete}
							/>
						)} */}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={hundleSubmit}>
            {langdata[language].submit}
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
