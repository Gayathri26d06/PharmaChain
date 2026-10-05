const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect private routes via Bearer JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "pharmachain_jwt_secure_secret_key_2026_production_grade"
      );

      // Attach user object to request (excluding password)
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User session expired or user no longer exists"
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error("[Auth Middleware Error]", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed or expired"
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization denied, no Bearer token provided"
    });
  }
};

// Middleware to restrict access by role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`
      });
    }

    if (req.user.role === "manufacturer" && req.user.manufacturerStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your manufacturer account is pending approval or rejected."
      });
    }

    next();
  };
};

// Middleware to optionally populate user if token is present
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "pharmachain_jwt_secure_secret_key_2026_production_grade");
      const user = await User.findById(decoded.id).select("-password");
      if (user) req.user = user;
    } catch (error) {
      // Ignore errors for optional auth
    }
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };
