const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

const generateInterviewReportController = async (req, res) => {
  let resumeContent = { text: "" };
  // If a resume file is provided, parse its PDF content
  if (req.file && req.file.buffer) {
    resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
  }

  const { jobDescription, selfDescription } = req.body;

  try {
    const interviewReportByAI = await generateInterviewReport({
      jobDescription,
      selfDescription,
      resume: resumeContent.text,
    });

    const interviewReport = await interviewReportModel.create({
      ...interviewReportByAI,
      resume: resumeContent.text,
      jobDescription,
      selfDescription,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Interview report generated successfully!",
      interviewReport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//* getInterviewReportByIdController Function
const getInterviewReportByIdController = async (req, res) => {
  const { interviewReportId } = req.params;

  try {
    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview Report not found!",
      });
    }

    return res.status(200).json({
      message: "Interview report fetched successfully!",
      interviewReport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//* getAllInterviewReportsController
const getAllInterviewReportsController = async (req, res) => {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -jobDescription -selfDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  return res.status(200).json({
    message: "Interview reports fetched successfully!",
    interviewReports,
  });
};

//* generateResumePdfController Function
const generateResumePdfController = async (req, res) => {
  const { interviewReportId } = req.params;

  try {
    const interviewReport =
      await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview Report not found!" });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="ai_resume_${interviewReportId}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    return res.status(200).send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
