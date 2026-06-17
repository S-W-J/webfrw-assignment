const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  // 브라우저 쿠키에서 token을 읽어옵니다.
  const token = req.cookies.token;

  if (!token) {
    // 토큰이 없으면 로그인 페이지로 튕겨버림
    return res.redirect("/login");
  }

  try {
    // 토큰이 진짜인지 .env의 비밀키로 검증합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 서버 로직에서 쓸 수 있게 유저 정보 저장
    next(); // 문 통과! 다음 함수(진짜 처리 로직) 실행
  } catch (err) {
    // 토큰이 조작되었거나 만료되었으면 쿠키를 굽고 로그인으로 리다이렉트
    res.clearCookie("token");
    return res.redirect("/login");
  }
};

module.exports = { checkLogin };