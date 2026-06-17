// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { getRegister, postRegister, getLogin, postLogin, logout } = require("../controllers/authController");

// 회원가입 경로 매핑 (GET으로 화면 띄우고, POST로 데이터 처리)
router.route("/register")
  .get(getRegister)
  .post(postRegister);

// 로그인 경로 매핑 (GET으로 화면 띄우고, POST로 토큰 발급)
router.route("/login")
  .get(getLogin)
  .post(postLogin);

// 로그아웃 경로 매핑
router.route("/logout")
  .get(logout);

module.exports = router;