import { Validations } from "./validations";

// Modelo de Pregunta (Question)
export interface Question {
  _id: string;
  title: string;
  type: "MULTIPLE" | "UNIQUE" | "OPENTEXT";
  options?: string[];
  correctAnswer: string;
  validations?: Validations;
}
