import dotenv from "dotenv";
import RTSPStream from "node-rtsp-stream";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import bodyParser from "body-parser";
import getAuthRouter from "./routes/auth";
import csrf from "csurf";
import { join } from "path";

dotenv.config();

const csrfProtection = csrf({
  cookie: true
});

const serverHost = process.env.SERVER_HOST as string;
const serverPort = Number.parseInt(process.env.SERVER_PORT as string);
const camIp = process.env.CAM_IP;
const camRtspPort = process.env.CAM_RTSP_PORT;
const camUsername = process.env.CAM_USERNAME;
const camPass = process.env.CAM_PASS;
const secret = process.env.JWT_SECRET as string;

const wsPort = 9999;

const rtspStream = new RTSPStream({
  name: "isy",
  streamUrl: `rtsp://${camUsername}:${camPass}@${camIp}:${camRtspPort}/ISAPI/Streaming/Channels/101`,
  wsPort: wsPort,
  ffmpegOptions: {
    "-stats": "", // an option with no neccessary value uses a blank string
    "-r": 30 // options with required values specify the value after the key
  }
});

const isAuthenticated = () => passport.authenticate("jwt", { session: false, failureRedirect: "/auth" });

const server = express();
server.use(cors());
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(passport.initialize());
server.use(csrfProtection);
server.use("/auth", getAuthRouter({ secret }));
server.use("/static-node-modules", express.static(join(process.cwd(), "/node_modules")));
server.use("/static", express.static(join(process.cwd(), "/static")));

server.get("/", isAuthenticated(), async (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="csrf-token" content="${req.csrfToken()}">
    </head>
    <body>
      <canvas id="canvas"></canvas>
      <script src="/static/vendor/jsmpeg.js"></script>
      <script>
        const player = new JSMpeg.Player("ws://${serverHost}:${wsPort}", {
          canvas: document.getElementById('canvas') // Canvas should be a canvas DOM element
        });
      </script>
    </body>
  </html>
  `);
});

server.listen(serverPort, serverHost, () => {
  console.log(`App listening at http://${serverHost}:${serverPort}`);
});
