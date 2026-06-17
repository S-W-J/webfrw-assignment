// controllers/authController.js

const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 회원가입 화면 띄우기 (GET /register)
const getRegister = (req, res) => res.render("register");

// 회원가입 처리 (POST /register)
const postRegister = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // 아이디 중복 체크
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.send("<script>alert('이미 존재하는 아이디입니다.'); history.back();</script>");
  }

  // 비밀번호 암호화 (수업 때 배운 bcrypt)
  const hashedPassword = await bcrypt.hash(password, 10);

  // DB에 저장
  await User.create({ username, password: hashedPassword });
  res.send("<script>alert('회원가입 완료! 로그인해주세요.'); location.href='/login';</script>");
});

// 로그인 화면 띄우기 (GET /login)
const getLogin = (req, res) => res.render("login");

// 로그인 처리 및 JWT 발급 (POST /login)
const postLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // 유저 찾기
  const user = await User.findOne({ username });
  if (!user) {
    return res.send("<script>alert('아이디 또는 비밀번호가 틀렸습니다.'); history.back();</script>");
  }

  // 비밀번호 비교 (bcrypt.compare)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.send("<script>alert('아이디 또는 비밀번호가 틀렸습니다.'); history.back();</script>");
  }

  // ⚡ 대망의 JWT 토큰 발행! (Id값만 페이로드에 쏙)
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h", // 1시간 동안 유효
  });

  // 발행한 토큰을 'token'이라는 이름의 쿠키에 구워서 브라우저에 전송!
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
});

// 로그아웃 (GET /logout)
const logout = (req, res) => {
  res.clearCookie("token"); // 쿠키 삭제
  res.redirect("/login");
};

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };