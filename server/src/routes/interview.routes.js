const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
} = require("../controllers/interview.controller");
const upload = require("../middlewares/multer.middleware");

const router = new Router();

/**
 * @route POST /api/interview/generate-report
 * @description Generate a new interview report on the basis of the user self description, job description and resume
 * @access Private
 */
router.post(
  "/generate-report",
  verifyToken,
  upload.single("resume"),
  generateInterviewReportController,
);

/**
 * @route POST /api/interview/report/:interviewReportId
 * @access Private
 */
router.get(
  "/report/:interviewReportId",
  verifyToken,
  getInterviewReportByIdController,
);

/**
 * @route GET /api/interview/
 * @access Private
 */
router.get("/", verifyToken, getAllInterviewReportsController);

/**
 * @route POST /api/interview/resume/pdf
 * @access Private
 */
router.post(
  "/resume/pdf/:interviewReportId",
  verifyToken,
  generateResumePdfController,
);

module.exports = router;
