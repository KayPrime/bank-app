function handleError(error) {
  const err = { email: "", password: "" };

  if (error.message === "password is incorrect") {
    err.password = "password is incorrect";
    return err;
  } else if (error.message === "user with this email does not exist") {
    err.email = "user with this email does not exist";
    return err;
  } else {
    return err;
  }
}

export { handleError };
