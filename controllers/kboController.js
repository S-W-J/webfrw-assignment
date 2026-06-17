// controllers/kboController.js

const asyncHandler = require("express-async-handler");
const Kbo = require("../models/Kbo");
const axios = require("axios");

const allowedTeams = [
  "KIA 타이거즈", "삼성 라이온즈", "LG 트윈스", "두산 베어스", "KT 위즈",
  "SSG 랜더스", "롯데 자이언츠", "한화 이글스", "NC 다이노스", "키움 히어로즈"
];

// @desc 로그인한 유저의 구단만 조회
const getAllTeams = asyncHandler(async (req, res) => {
  // 💡 로그인한 유저(req.user.id)의 데이터만 필터링하여 조회
  const teams = await Kbo.find({ user: req.user.id }).sort({ createdAt: -1 });

  const teamsWithNews = await Promise.all(
    teams.map(async (team) => {
      try {
        const response = await axios.get("https://openapi.naver.com/v1/search/news.json", {
          params: { query: team.teamName, display: 3 },
          headers: {
            "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
          },
        });
        
        return {
          _id: team._id,
          teamName: team.teamName,
          news: response.data.items,
        };
      } catch (error) {
        return { _id: team._id, teamName: team.teamName, news: [] };
      }
    })
  );

  res.render("index", { teams: teamsWithNews });
});

// @desc 로그인한 유저의 ID와 함께 구단 등록
const createTeam = asyncHandler(async (req, res) => {
  const { teamName } = req.body;

  if (!teamName || !allowedTeams.includes(teamName)) {
    return res.send("<script>alert('올바른 구단을 선택해주세요!'); history.back();</script>");
  }

  // 💡 DB 저장 시 유저 ID를 함께 기록
  await Kbo.create({ 
    teamName, 
    user: req.user.id 
  });
  res.redirect("/");
});

// @desc 본인 구단 삭제
const deleteTeam = asyncHandler(async (req, res) => {
  // 본인의 데이터인지 확인 후 삭제
  await Kbo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.redirect("/");
});

module.exports = { getAllTeams, createTeam, deleteTeam };