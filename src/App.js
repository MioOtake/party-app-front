import "./App.css";
import { langdata } from "./components/Lang_pack";
import { MenuItem, InputLabel, FormControl, Select, Box } from "@mui/material";
import { useState } from "react";
import Button from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LogIn } from "./pages/LogIn";
import Profile_Submit from "./pages/Profile_Submit";
import Profiles from "./pages/Profiles";
import { SignUp } from "./pages/SignUp";
import NotFound from "./pages/NotFound";



function App() {
  const [langValue, setLangValue] = useState(langdata.English);
  const [submitting, setSubmitting] = useState(false);

  // console.log(langdata.Japanese);
  console.log(langValue.greeting);
  console.log(langValue);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLangValue(langdata[selectedLanguage]);
  };

  return (
    <>
      <Box
        sx={{
          minWidth: 130,
          maxWidth: 300,
          height: "50px",
          position: "absolute",
          top: 5,
          right: 10,
        }}
      >
        <FormControl fullWidth>
          <InputLabel
            variant="standard"
            htmlFor="uncontrolled-native"
            style={{ width: "100%", textAlign: "center" }}
          >
            Language
          </InputLabel>
          <Select value={langValue.language} onChange={handleLanguageChange}>
            {Object.keys(langdata).map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Router>
      <Routes>
        <Route path="/" element={<LogIn langValue={langValue} setSubmitting={setSubmitting} />} />
        <Route path="/SignUp" element={<SignUp langValue={langValue} setSubmitting={setSubmitting} />} />
        <Route path="/Profiles" element={<Profiles langValue={langValue} submitting={submitting} />} />
        <Route path="/Profile_Submit" element={<Profile_Submit langValue={langValue} setSubmitting={setSubmitting} />} />
        {/* <Route component={NotFound} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>


      {/* <br></br>
      <br></br>

      <div class="text">
        <br></br>
        <Text text={langValue.greeting} />
        <Text text={langValue.inputprofile} />
        <br></br>
      </div> */}

      {/* <div class="centered-container">
        <IntroForm langValue={langValue} setSubmitting={setSubmitting} />
      </div> */}

      {/* <div class="text">
        <Text text={langValue.profiles} />
      </div>

      <br></br>

      <Profile langValue={langValue} submitting={submitting} />

      <br></br>
      <br></br>
      <br></br> */}
    </>
  );
}

export default App;

{
  /* <div>
        <Button size="small" onClick={() => setLangValue(langdata.Japanese)}>
          日本語
        </Button>
        <Button size="small" onClick={() => setLangValue(langdata.English)}>
          English
        </Button>
        <Button size="small" onClick={() => setLangValue(langdata.Chinese)}>
          中文
        </Button>
        <Button size="small" onClick={() => setLangValue(langdata.Hindi)}>
          हिन्दी
        </Button>
      </div> */
}
