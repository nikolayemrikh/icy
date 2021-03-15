import jwt from "jsonwebtoken";
import { Router } from "express";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";

const getAuthRouter = (params: { secret: string }): Router => {
  const { secret } = params;
  const router = Router();

  const users = [
    {
      id: 1,
      name: "javier",
      password: "password123"
    }
  ];

  const cookieField = "jwt";

  const strategy = new JwtStrategy(
    {
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies[cookieField];
        }
        return token;
      },
      secretOrKey: secret
    },
    (jwtPayload, next) => {
      console.log("payload received", jwtPayload);
      // TODO Найти юзера
      const user = users[0];
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    }
  );

  passport.use(strategy);

  router.get("/", async (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="csrf-token" content="${req.csrfToken()}">
      </head>
      <body>
        <form action="/auth" method="POST">
          <input type="hidden" name="_csrf" value="${req.csrfToken()}">
          
          <label>
            username
            <input type="text" name="username">
          </label>
          <label>
            password
            <input type="password" name="password">
          </label>

          <button type="submit">Войти</button>
        </form>
      </body>
    </html>
    `);
  });

  router.post("/", function (req, res) {
    console.log(req.body);

    // TODO validate
    const { name, password } = req.body;

    console.log(password);

    // TODO Найти юзера
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: "no such user found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, secret);
    res.cookie(cookieField, token, { httpOnly: true });

    if (req.headers["content-type"] === "application/json") {
      return res.json({ message: "ok", token: token });
    }
    return res.redirect("/");
  });

  return router;
};
// https://medium.com/@ryanchenkie_40935/react-authentication-how-to-store-jwt-in-a-cookie-346519310e81

export default getAuthRouter;
