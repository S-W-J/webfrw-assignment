// controllers/kboController.js

const asyncHandler = require("express-async-handler");
const Kbo = require("../models/Kbo");
const axios = require("axios");

// @desc 선호 구단 전체 조회 및 네이버 뉴스 매칭
// @route GET /
const getAllTeams = asyncHandler(async (req, res) => {
  // DB에서 등록된 구단 목록을 최신순으로 가져옵니다.
  const teams = await Kbo.find().sort({ createdAt: -1 });

  // 각 팀 이름으로 네이버 뉴스 API를 동시 호출합니다.
  const teamsWithNews = await Promise.all(
    teams.map(async (team) => {
      try {
        const response = await axios.get("https://openapi.naver.com/v1/search/news.json", {
          params: { query: team.teamName, display: 3 }, // 팀당 뉴스 3개씩만 콤팩트하게 출력
          headers: {
            "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
          },
        });
        
        return {
          _id: team._id,
          teamName: team.teamName,
          cheerMessage: team.cheerMessage,
          news: response.data.items, // 네이버로부터 받은 뉴스 배열
        };
      } catch (error) {
        console.error(`${team.teamName} 뉴스 가져오기 실패:`, error.message);
        return {
          _id: team._id,
          teamName: team.teamName,
          cheerMessage: team.cheerMessage,
          news: [], // 에러 시 빈 배열 처리로 서버 터짐 방지
        };
      }
    })
  );

  // views/index.ejs 파일로 데이터를 보냅니다.
  res.render("index", { teams: teamsWithNews });
});

// @desc 선호 구단 등록
// @route POST /
const createTeam = asyncHandler(async (req, res) => {
  const { teamName, cheerMessage } = req.body;

  if (!teamName || !cheerMessage) {
    return res.status(400).send("<script>alert('구단 이름과 응원 문구를 입력해주세요!'); history.back();</script>");
  }

  // DB에 새 야구팀 데이터 저장
  await Kbo.create({ teamName, cheerMessage });
  res.redirect("/");
});

// @desc 선호 구단 삭제
// @route DELETE /:id
const deleteTeam = asyncHandler(async (req, res) => {
  await Kbo.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = { getAllTeams, createTeam, deleteTeam };
