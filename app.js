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
    origin: [
      "http://localhost:5173",
      "https://main--celebrated-cat-6772f5.netlify.app",
    ],
  })
);

app.options("*", cors());

app.use(require("./router/userRoute"));
app.use(require("./router/managerRoute"));
app.use(require("./router/waiterRoute"));

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
