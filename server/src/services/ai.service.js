const { GoogleGenAI } = require("@google/genai");
const z = require("zod");
const puppeteer = require("puppeteer");

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A match score between 0 to 100 indicating how well the candidate's profile matches the job description",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked in the interview.",
          ),
        intention: z
          .string()
          .describe(
            "The intention of interviewer behind asking this question.",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical Questions that can be asked in the interview along with their intention and how to answer them.",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked in the interview.",
          ),
        intention: z
          .string()
          .describe(
            "The intention of interviewer behind asking this question.",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral Questions that can be asked in the interview along with their intention and how to answer them.",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate lacking."),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap i.e How important is this skill for the job a candidate applying.",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with severity level.",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mockup interveiws etc",
          ),
        tasks: z
          .array(z.string())
          .describe("List of tasks of this day in the preparation plan"),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

const client = new GoogleGenAI({
  apiKey: process.env.GENAI_API_KEY,
});

//* generateInterviewReport Function
const generateInterviewReport = async ({
  resume,
  jobDescription,
  selfDescription,
}) => {
  const prompt = `Generate an interview report for a candidate with the following details:
                  Resume: ${resume}
                  Job Description: ${jobDescription},
                  Self Description: ${selfDescription}
  `;

  const interaction = await client.interactions.create({
    model: process.env.GEMINI_MODEL,
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: z.toJSONSchema(interviewReportSchema),
    },
  });

  const interviewReport = interviewReportSchema.parse(
    JSON.parse(interaction.output_text),
  );

  return interviewReport;
};

//* generatePdfFromHtml Function
const generatePdfFromHtml = async (htmlContent) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });


    console.log("Executable Path: ", puppeteer.executablePath);

    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//* generateResumePdf Function
const generateResumePdf = async ({
  resume,
  jobDescription,
  selfDescription,
}) => {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `You are an expert resume writer and senior UI/UX designer.

Generate a modern, ATS-friendly, recruiter-ready resume using the following information.

Candidate Resume:
${resume}

Job Description:
${jobDescription}

Self Description:
${selfDescription}

Return ONLY a valid JSON object with the following schema:

{
  "html": "<complete HTML document>"
}

Requirements:

- Create a complete HTML document with embedded CSS only (no JavaScript, Tailwind, Bootstrap, external fonts, icons, or CDN).
- The HTML must be optimized for Puppeteer PDF generation using A4 pages with print-friendly CSS (@page, proper margins, and page-break-inside: avoid where appropriate).
- Use a clean, premium, single-column layout with excellent typography, spacing, alignment, and visual hierarchy.
- The design should look like it was created by a professional resume designer for experienced software engineers—not by AI or using a generic template.
- Use a subtle professional color palette, minimal borders, and plenty of whitespace. Avoid sidebars, excessive colors, gradients, unnecessary graphics, or decorative elements.
- Tailor the resume to the provided Job Description while remaining truthful. Naturally incorporate relevant ATS keywords without keyword stuffing or inventing experience.
- Include only sections supported by the candidate's information, such as:
  - Header (Name, Title, Contact: Links should be working...)
  - Professional Summary
  - Technical Skills (grouped by category)
  - Experience (achievement-focused bullet points with measurable impact where possible)
  - Projects (highlight technologies, impact, and key accomplishments)
  - Education
  - Certifications/Achievements (if available)
- Use strong action verbs and concise, professional language. Avoid generic AI phrases and repetition.
- Ensure the final resume is visually polished, highly readable, ATS-compatible, and ready to send directly to recruiters.

Return only the JSON object.
  `;

  try {
    const interaction = await client.interactions.create({
      model: process.env.GEMINI_MODEL,
      input: prompt,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: z.toJSONSchema(resumePdfSchema),
      },
    });

    const jsonContent = resumePdfSchema.parse(
      JSON.parse(interaction.output_text),
    );

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateInterviewReport,
  generateResumePdf,
};
