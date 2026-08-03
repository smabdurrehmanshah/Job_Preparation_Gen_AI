const { Router } = require("express");
const {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
} = require("./../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = new Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
router.post("/login", loginUserController);

/**
 * @route GET /api/auth/logout
 * @description Logout a user
 * @access Public
 */
router.get("/logout", logoutUserController);

/**
 * @route GET /api/auth/me
 * @description Get the currently logged-in user's information
 * @access Private
 */
router.get("/me", verifyToken, getMeController);

module.exports = router;
