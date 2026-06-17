require("dotenv").config(); 
const express = require("express");
const methodOverride = require("method-override");
const dbConnect = require("./config/db");

const app = express();

// 몽고디비 아틀라스 클라우드 연결
dbConnect();

// 뷰 엔진(EJS) 세팅
app.set("view engine", "ejs");
app.set("views", "./views");

// 미들웨어 설정 (바디 파서 & Put/Delete 우회 도구)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // Form 태그에서 ?_method=DELETE 사용 가능하게 함

// 라우터 연결
app.use("/", require("./routes/kboRoutes"));

// Render 배포용 동적 포트 세팅 (매우 중요)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running: http://localhost:${port} listening...`);
});