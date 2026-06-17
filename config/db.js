const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    // .env 파일의 MONGO_URI를 읽어와 연결합니다.
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(` success to connect: ${connect.connection.host}`);
  } catch (err) {
    console.error(` DB connect fail: ${err.message}`);
    process.exit(1);
  }
};

module.exports = dbConnect;