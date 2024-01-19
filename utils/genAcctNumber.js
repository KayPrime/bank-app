import { UserModel } from "../models/userModel.js";

function genAcctNumber() {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  numbers.sort(() => 0.5 - Math.random());
  return parseInt(numbers.join(""));
}

export { genAcctNumber };