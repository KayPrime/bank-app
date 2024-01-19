import jwt from "jsonwebtoken";
import { apiVersion } from "../app.js";

function verifyUser(req, res, next) {
  const userToken = req.cookies["userToken"];
  jwt.verify(userToken, process.env.JWT_SECRET, async (err, verified) => {
    if (verified) {
      next();
    } else {
      res.redirect(`${apiVersion}/login`);
    }
  });
}

export { verifyUser };