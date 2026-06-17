const mongoose = require("mongoose");

const kboSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true, // 예: "LG 트윈스", "KIA 타이거즈"
  },
  cheerMessage: {
    type: String,
    required: true, // 예: "올해도 우승 가자!"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Kbo", kboSchema);