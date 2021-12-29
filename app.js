//require packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//create the express sever
const app = express();

//sever port number
const PORT = process.env.PORT || 3000;

//set template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//need to parse html data for POST request
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/convert-mp3", async (req, res) => {
  const videoId = req.body.videoID;
  if (!videoId) {
    return res.render("index", {
      success: false,
      message: "Please enter videoId",
    });
  }
  const fetchApi = await fetch(
    `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
    {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": process.env.API_HOST,
        "x-rapidapi-key": process.env.API_KEY,
      },
    }
  );

  const fetchResponse = await fetchApi.json();
  if (fetchResponse.status === "ok") {
    return res.render("index", {
      success: true,
      song_title: fetchResponse.title,
      song_link: fetchResponse.link,
    });
  } else {
    return res.render("index", { success: false, message: fetchResponse.msg });
  }
});
//start the sever
app.listen(PORT, () => {
  console.log(`sever's listening on port ${PORT}`);
});
