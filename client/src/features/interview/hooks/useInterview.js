import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import {
  generateInterviewReport,
  generateResumePdf,
  getAllInterviewReports,
  getInterviewReportById,
} from "../services/interview.api";

export const useInterview = () => {
  const { isLoading, setIsLoading, report, setReport, reports, setReports } =
    useContext(InterviewContext);

  //* generateReport Function
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setIsLoading(true);
    try {
      const data = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(data?.interviewReport);
      return data?.interviewReport;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //* getReportById Function
  const getReportById = async (interviewId) => {
    setIsLoading(true);
    try {
      const data = await getInterviewReportById(interviewId);
      setReport(data.interviewReport);
      return data.interviewReport;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //* getAllReports Function
  const getAllReports = async () => {
    setIsLoading(true);
    try {
      const data = await getAllInterviewReports();
      setReports(data.interviewReports);
      return data.interviewReports;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //* getResumePdf Function
  const getResumePdf = async (interviewReportId) => {
    setIsLoading(true);
    try {
      const pdfBlob = await generateResumePdf({ interviewReportId });

      const url = window.URL.createObjectURL(pdfBlob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai_resume-${interviewReportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    report,
    reports,
    generateReport,
    getReportById,
    getAllReports,
    getResumePdf,
  };
};
