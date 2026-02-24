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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find company
    const company = await Company.findById(decoded.id).select("-password");

    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Company not found",
      });
    }

    // Attach both for safety
    req.company = company;
    req.companyId = company._id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid",
    });
  }
};