const catchErrorFunc = (controllerFunc) => async (req, res, next) => {
  try {
    await controllerFunc(req, res);
  } catch (err) {
    next(err);
  }
};

export { catchErrorFunc };
