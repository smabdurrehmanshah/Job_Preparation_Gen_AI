import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

//* generateInterviewReport Function
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();

  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  try {
    const response = await api.post("/interview/generate-report", formData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//* getInterviewReportById Function
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/interview/report/${interviewId}`);

  return response.data;
};

//* getAllInterviewReports Function
export const getAllInterviewReports = async () => {
  const response = await api.get("/interview/");

  return response.data;
};

export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await api.post(
    `/interview/resume/pdf/${interviewReportId}`,
    null,
    { responseType: "blob" },
  );

  return response.data;
};
