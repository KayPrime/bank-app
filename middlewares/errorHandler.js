import { apiVersion } from "../app.js";
import { UserError } from "../utils/error.js";

function errorHandler(err, req, res, next) {
  console.log(err);
  const error = { email: "", password: "" };

  if (err instanceof UserError)
    switch (err.message) {
      case "password is incorrect":
        error.password = "password is incorrect";
        return res.status(400).json({
          success: false,
          error,
        });
      case "user with this email does not exist":
        error.email = "user with this email does not exist";
        return res.status(400).json({
          success: false,
          error,
        });
      case "user with this email already exist":
        return res.status(400).render("error", { apiVersion, error: err.message });
      default:
        return res.status(400).json({
          success: false,
          error: err.message,
        });
    }
}

export { errorHandler };
