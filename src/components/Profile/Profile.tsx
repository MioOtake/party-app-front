import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ReactLoading from "react-loading";

// export default function MediaCard() {
export const Profile = () => {
  const [people, setPeople] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    axios
      // .get("https://selfintroductionapp-back.onrender.com/")
      .get("http://localhost:3004")
      .then((response) => {
        console.log(response);
        // setPeople(response.data.file_contents);
        setPeople(response.data.items);
      })
      .catch((error) => {
        console.error("APIエラー:", error);
      })
      .finally(() => {
        // リクエストが終了したらisLoadingをfalseに設定
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // setIsLoading(true);
    // axios
    // 	.get("http://localhost:3004/")
    // 	.then((response) => {
    // 		console.log(response);
    // 		// setPeople(response.data.file_contents);
    // 		setPeople(response.data.items);
    // 	})
    // 	.catch((error) => {
    // 		console.error("APIエラー:", error);
    // 	})
    // 	.finally(() => {
    // 		// リクエストが終了したらisLoadingをfalseに設定
    // 		setIsLoading(false);
    // 	});
    fetchData();
  }, []);
  // useEffect(() => {
  // 	if (!isLoading) {
  // 		// FlaskのAPIエンドポイントを呼び出します
  // 		setIsLoading(true);
  // 		axios
  // 			.get("http://localhost:3004/")
  // 			.then((response) => {
  // 				console.log(response);
  // 				setPeople(response.data.file_contents);
  // 			})
  // 			.catch((error) => {
  // 				console.error("APIエラー:", error);
  // 			})
  // 			.finally(() => {
  // 				// リクエストが終了したらisLoadingをfalseに設定
  // 				setIsLoading(false);
  // 			});
  // 	}
  // }, []); // isLoadingが変更されたときにのみ実行
  const submitDelete = async (id: string) => {
    // console.log(name);
    try {
      // eslint-disable-next-line no-restricted-globals
      const confirmDelete = confirm("本当に削除しますか？");
      if (confirmDelete) {
        // データをJSON形式にまとめる
        const data = {
          id: id,
        };

        // POSTリクエストを送信
        const response = await axios.post(
          //   "https://selfintroductionapp-back.onrender.com/delete",
          "http://localhost:3004/delete",
          data
        );
        // const response = await axios.post("http://localhost:3004/delete", data);

        // リクエストが成功した場合の処理
        console.log("POSTリクエストが成功しました。", response.data);
        fetchData();
      }
    } catch (error) {
      // リクエストが失敗した場合のエラーハンドリング
      console.error("POSTリクエストが失敗しました。", error);
    }
  };
  console.log(people);
  return (
    <>
      <div className="mt-5"></div>
      {isLoading ? (
        <>
          <p>Loading...</p>
          <div className="ml-3">
            <ReactLoading
              type={"spin"}
              color={"blue"}
              height={"50px"}
              width={"50px"}
            />
          </div>
        </>
      ) : (
        <>
          <div className="Card row">
            {people.map((person, index) => {
              return (
                <>
                  <div key={index} className="col-6">
                    <Card sx={{ maxWidth: 200 }}>
                      <CardMedia
                        sx={{ height: 150 }}
                        image={person["fileData"]}
                        // image={"data:image/jpeg;base64," + person["image"]}
                        title={person["name"]}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {person["name"]}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                          {person["team"]}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {person["others"]}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => submitDelete(person["id"])}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </div>
                  {index % 2 === 0 && <br />}
                </>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};
