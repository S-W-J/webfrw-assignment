const asyncHandler = require("express-async-handler");
const Kbo = require("../models/Kbo");
const axios = require("axios");

// KBO 허용 구단 리스트
const allowedTeams = [
  "KIA 타이거즈", "삼성 라이온즈", "LG 트윈스", "두산 베어스", "KT 위즈",
  "SSG 랜더스", "롯데 자이언츠", "한화 이글스", "NC 다이노스", "키움 히어로즈"
];

// @desc 선호 구단 전체 조회 및 네이버 뉴스 매칭
const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Kbo.find().sort({ createdAt: -1 });

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
          news: response.data.items, // 응원 메시지 매핑 제거
        };
      } catch (error) {
        console.error(`${team.teamName} 뉴스 가져오기 실패:`, error.message);
        return {
          _id: team._id,
          teamName: team.teamName,
          news: [],
        };
      }
    })
  );

  res.render("index", { teams: teamsWithNews });
});

// @desc 선호 구단 등록 (응원 메시지 완전 제거 및 백엔드 검증)
const createTeam = asyncHandler(async (req, res) => {
  const { teamName } = req.body;

  if (!teamName) {
    return res.send("<script>alert('구단을 선택해주세요!'); history.back();</script>");
  }

  // 백엔드 최종 검증 (해킹 및 비정상 접근 차단)
  if (!allowedTeams.includes(teamName)) {
    return res.send("<script>alert('올바른 KBO 구단이 아닙니다.'); history.back();</script>");
  }

  // DB에 구단 이름만 깔끔하게 저장
  await Kbo.create({ teamName });
  res.redirect("/");
});

// @desc 선호 구단 삭제
const deleteTeam = asyncHandler(async (req, res) => {
  await Kbo.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = { getAllTeams, createTeam, deleteTeam };