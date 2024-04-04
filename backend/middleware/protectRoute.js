import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req,res,next) => {

  try {
    const token = req.cookies.jwt;
    if(!token) res.status(401).json({message:"unauthorized"});
    const decoded = jwt.verify(token,process.env.JWT);
    const user = await User.findById(decoded.userId).select("-password")

    req.user = user
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("err in protectRoute", err.message);
  }
};

export default protectRoute
