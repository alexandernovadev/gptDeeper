import { ExamGeneratorPage } from "../pages/exam-generator/ExamGeneratorPage";

export const LearnerRoutes = [
  {
    to: "/exam-generator",
    icon: "fa-solid fa-file-alt",
    title: "Exam Generator",
    description: "Generate exam for your students",
    component: <ExamGeneratorPage />,
  },
];
