const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT;

require("./db/conn");

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.options("*", cors());

app.use(require("./router/userRoute"));

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
