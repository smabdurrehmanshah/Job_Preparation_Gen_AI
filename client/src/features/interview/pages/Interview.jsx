import { useEffect, useState } from "react";
import {
  Astroid,
  ChevronDown,
  ChevronUp,
  Code2,
  LoaderCircle,
  MessageSquare,
  Navigation,
} from "lucide-react";
import styles from "./../style/interview.module.scss";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router";

const SECTIONS = [
  { id: "technical", label: "Technical Questions", icon: Code2 },
  { id: "behavioral", label: "Behavioral Questions", icon: MessageSquare },
  { id: "roadmap", label: "Road Map", icon: Navigation },
];

const matchLabelForScore = (score) => {
  if (score >= 80) return "Strong match for this role";
  if (score >= 60) return "Good match for this role";
  if (score >= 40) return "Partial match for this role";
  return "Needs improvement for this role";
};

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [expandedIds, setExpandedIds] = useState(() => new Set([0, 1]));

  const { report, getReportById, isLoading, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) getReportById(interviewId);
  }, [interviewId]);

  if (isLoading || !report) {
    return (
      <main>
        <LoaderCircle className="spin" />
      </main>
    );
  }

  const questions =
    activeSection === "technical"
      ? report.technicalQuestions
      : activeSection === "behavioral"
        ? report.behavioralQuestions
        : [];

  const sectionTitle =
    activeSection === "technical"
      ? "Technical Questions"
      : activeSection === "behavioral"
        ? "Behavioral Questions"
        : "Preparation Road Map";

  const sectionBadge =
    activeSection === "roadmap"
      ? `${report.preparationPlan.length}-day plan`
      : `${questions.length} questions`;

  const toggleQuestion = (index) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === "technical" || sectionId === "behavioral") {
      setExpandedIds(new Set([0]));
    }
  };

  const score = report.matchScore;
  const circumference = 2 * Math.PI * 54;
  const progressOffset = circumference - (score / 100) * circumference;

  return (
    <main className={styles["interview-page"]}>
      {/* Left — Sections nav */}
      <aside className={styles.sidebar}>
        <p className={styles["sidebar-label"]}>Sections</p>
        <nav className={styles["section-nav"]} aria-label="Interview sections">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`${styles["nav-item"]} ${
                activeSection === id ? styles["nav-item--active"] : ""
              }`}
              onClick={() => handleSectionChange(id)}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={() => getResumePdf(interviewId)}
          className={`button primary-button ${styles["custom-btn"]}`}
        >
          Download Resume
        </button>
      </aside>

      {/* Center — Content */}
      <section className={styles.content}>
        <header className={styles["content-header"]}>
          <h1>{sectionTitle}</h1>
          <span className={styles["count-badge"]}>{sectionBadge}</span>
        </header>

        {activeSection !== "roadmap" && (
          <ul className={styles["question-list"]}>
            {questions.map((item, index) => {
              const isExpanded = expandedIds.has(index);
              return (
                <li
                  key={`${activeSection}-${index}`}
                  className={`${styles["question-card"]} ${
                    isExpanded ? styles["question-card--expanded"] : ""
                  }`}
                >
                  <button
                    type="button"
                    className={styles["question-toggle"]}
                    onClick={() => toggleQuestion(index)}
                    aria-expanded={isExpanded}
                  >
                    <span className={styles["q-badge"]}>Q{index + 1}</span>
                    <span className={styles["q-text"]}>{item.question}</span>
                    {isExpanded ? (
                      <ChevronUp
                        className={styles["q-chevron"]}
                        size={20}
                        strokeWidth={2}
                      />
                    ) : (
                      <ChevronDown
                        className={styles["q-chevron"]}
                        size={20}
                        strokeWidth={2}
                      />
                    )}
                  </button>

                  {isExpanded && (
                    <div className={styles["question-body"]}>
                      <div className={styles["detail-block"]}>
                        <span
                          className={`${styles["detail-badge"]} ${styles["detail-badge--intention"]}`}
                        >
                          Intention
                        </span>
                        <p>{item.intention}</p>
                      </div>
                      <div className={styles["detail-block"]}>
                        <span
                          className={`${styles["detail-badge"]} ${styles["detail-badge--answer"]}`}
                        >
                          Model Answer
                        </span>
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {activeSection === "roadmap" && (
          <ol className={styles.timeline}>
            {report.preparationPlan.map((dayPlan) => (
              <li key={dayPlan.day} className={styles["timeline-item"]}>
                <div className={styles["timeline-marker"]} aria-hidden="true" />
                <div className={styles["timeline-body"]}>
                  <div className={styles["timeline-heading"]}>
                    <span className={styles["day-badge"]}>
                      Day {dayPlan.day}
                    </span>
                    <h2>{dayPlan.focus}</h2>
                  </div>
                  <ul className={styles["task-list"]}>
                    {dayPlan.tasks.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Right — Match score & skill gaps */}
      <aside className={styles.metrics}>
        <div className={styles["metric-block"]}>
          <p className={styles["metric-label"]}>Match Score</p>
          <div className={styles["score-ring-wrap"]}>
            <svg
              className={styles["score-ring"]}
              viewBox="0 0 120 120"
              aria-hidden="true"
            >
              <circle
                className={styles["score-ring-track"]}
                cx="60"
                cy="60"
                r="54"
                fill="none"
                strokeWidth="8"
              />
              <circle
                className={styles["score-ring-progress"]}
                cx="60"
                cy="60"
                r="54"
                fill="none"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className={styles["score-value"]}>
              <span className={styles["score-number"]}>{score}%</span>
            </div>
          </div>
          <p className={styles["score-caption"]}>{matchLabelForScore(score)}</p>
        </div>

        <div className={styles["metric-block"]}>
          <p className={styles["metric-label"]}>Skill Gaps</p>
          <ul className={styles["gap-list"]}>
            {report.skillGaps.map((gap, index) => (
              <li
                key={index}
                className={`${styles["gap-item"]} ${
                  styles[`gap-item--${gap.severity}`]
                }`}
              >
                {gap.skill}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
};

export default Interview;
