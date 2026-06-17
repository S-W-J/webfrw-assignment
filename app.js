require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dbConnect = require("./config/db");

const app = express();

// 몽고디비 아틀라스 연결
dbConnect();

// 뷰 엔진(EJS) 세팅
app.set("view engine", "ejs");
app.set("views", "./views");

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser()); // 쿠키 분석기 등록

// 전역 유저 세션 주입 미들웨어 
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded; // res.locals에 넣으면 EJS에서 그냥 꺼내쓸 수 있음!
    } catch (err) {
      res.clearCookie("token");
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// 라우터 연결
app.use("/", require("./routes/authRoutes")); // 인증 라우터 추가
app.use("/", require("./routes/kboRoutes"));

// 포트 실행
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 서버 구동 성공! http://localhost:${port} 에서 대기 중...`);
});