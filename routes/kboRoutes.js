// routes/kboRoutes.js

const express = require("express");
const router = express.Router();
const { getAllTeams, createTeam, deleteTeam } = require("../controllers/kboController");
const { checkLogin } = require("../middlewares/authMiddleware"); // 💡 추가

// 메인 페이지 조회(GET)와 구단 추가(POST) 모두 checkLogin 통과 필수!
router.route("/")
  .get(checkLogin, getAllTeams) // GET / 접속 시 로그인 검사
  .post(checkLogin, createTeam); // POST / 등록 시 로그인 검사

router.route("/:id")
  .delete(checkLogin, deleteTeam); // DELETE 시 로그인 검사

module.exports = router;
