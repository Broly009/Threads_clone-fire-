import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT, {
    expiresIn: "300d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 300 * 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: "true"
  });
  return token;
};
export default generateTokenAndSetCookie;
