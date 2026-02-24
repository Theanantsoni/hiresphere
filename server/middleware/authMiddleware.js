import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const company = await Company.findById(decoded.id).select("-password");

    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Company not found",
      });
    }

    req.company = company;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token invalid",
    });
  }
};