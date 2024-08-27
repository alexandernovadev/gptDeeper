export interface ExamResponse {
  title: string;
  questions: {
    title: string;
    type: string;
    options: string[];
    correctAnswer: string;
  }[];
}
