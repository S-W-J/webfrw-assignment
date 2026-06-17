// routes/kboRoutes.js

const express = require("express");
const router = express.Router();
const { getAllTeams, createTeam, deleteTeam } = require("../controllers/kboController");

// 메인 페이지 조회(GET) 및 새로운 팀 추가(POST)
router.route("/")
  .get(getAllTeams)
  .post(createTeam);

// 특정 팀 삭제(DELETE) - method-override 활용 예정
router.route("/:id")
  .delete(deleteTeam);

module.exports = router;