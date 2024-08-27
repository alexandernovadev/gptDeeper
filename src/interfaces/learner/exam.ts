import { Question } from "./question";

export interface Exam {
  _id?: string;
  lectureID: string;
  title: string;
  difficulty: "HARD" | "MEDIUM" | "EASY";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  score: number;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}
