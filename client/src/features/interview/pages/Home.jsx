import { Briefcase, CloudUpload, Info, LoaderCircle, Sparkles, User } from "lucide-react";
import styles from "./../style/home.module.scss";
import { useInterview } from "../hooks/useInterview";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

const Home = () => {
  const { isLoading, reports, generateReport, getAllReports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    getAllReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !jobDescription ||
      (!selfDescription && !resumeInputRef.current.files[0])
    ) {
      alert(
        "Please provide job description and either a resume or self-description",
      );
      return;
    }

    const resumeFile = resumeInputRef.current.files[0];

    const interviewReport = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    navigate(`/interview/${interviewReport._id}`);
  };

  if (isLoading) {
    return (
      <main>
        <LoaderCircle className="spin" />
      </main>
    );
  }

  return (
    <main className={styles["home-page"]}>
      <header className={styles["page-header"]}>
        <h1>
          Create Your Custom <span>Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      <form className={styles["plan-card"]} onSubmit={handleSubmit}>
        <div className={styles["card-body"]}>
          <section className={styles["panel"]}>
            <div className={styles["panel-heading"]}>
              <div className={styles["panel-title"]}>
                <Briefcase size={20} strokeWidth={2} />
                <h2>Target Job Description</h2>
              </div>
              <span className={styles["badge"]}>REQUIRED</span>
            </div>

            <div className={styles["job-field"]}>
              <textarea
                name="jobDescription"
                id="jobDescription"
                placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <span className={styles["char-count"]}>0 / 5000 chars</span>
            </div>
          </section>

          <div className={styles["divider-vertical"]} aria-hidden="true" />

          <section className={styles["panel"]}>
            <div className={styles["panel-heading"]}>
              <div className={styles["panel-title"]}>
                <User size={20} strokeWidth={2} />
                <h2>Your Profile</h2>
              </div>
            </div>

            <div className={styles["profile-content"]}>
              <div className={styles["field-block"]}>
                <div className={styles["field-label-row"]}>
                  <label htmlFor="resume">Upload Resume</label>
                  <span className={styles["badge"]}>BEST RESULTS</span>
                </div>

                <label className={styles["dropzone"]} htmlFor="resume">
                  <CloudUpload size={28} strokeWidth={1.75} />
                  <span className={styles["dropzone-title"]}>
                    Click to upload or drag &amp; drop
                  </span>
                  <span className={styles["dropzone-hint"]}>
                    Only PDF (Max 3MB)
                  </span>
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,application/pdf"
                  hidden
                  ref={resumeInputRef}
                />
              </div>

              <div className={styles["or-divider"]}>
                <span>OR</span>
              </div>

              <div className={styles["field-block"]}>
                <label
                  className={styles["field-label"]}
                  htmlFor="selfDescription"
                >
                  Quick Self-Description
                </label>
                <textarea
                  className={styles["self-description"]}
                  name="selfDescription"
                  id="selfDescription"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                />
              </div>

              <div className={styles["info-box"]}>
                <Info size={16} strokeWidth={2} />
                <p>
                  Either a <strong>Resume</strong> or a{" "}
                  <strong>Self Description</strong> is required to generate a
                  personalized plan.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className={styles["card-footer"]}>
          <p className={styles["footer-note"]}>
            AI-Powered Strategy Generation · Approx 30s
          </p>
          <button type="submit" className={styles["generate-btn"]}>
            <Sparkles size={18} strokeWidth={2} />
            Generate My Interview Strategy
          </button>
        </footer>
      </form>

    {reports && reports.length > 0 && (
      <section className={styles["reports-section"]}>
        <h2>My Recent Interview Plans</h2>
        <ul className={styles["reports-list"]}>
          {reports.map((report) => (
            <li key={report._id} className={styles["report-card"]}>
              <Link to={`/interview/${report._id}`} className={styles["card-link"]}>
                <h3 className={styles["card-title"]}>{report.title}</h3>
                <p className={styles["card-date"]}>
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p className={styles["card-score"]}>
                  Match Score: {report.matchScore !== undefined ? `${report.matchScore}%` : "0%"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )}
    
      <nav className={styles["page-footer"]}>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </nav>
    </main>
  );
};

export default Home;
