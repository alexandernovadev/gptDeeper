import React, { useState, useRef } from "react";
import { examGenerateUseCase } from "../../../core/use-cases/exam-generator/exam-generate.use-case";

interface ExamRequestData {
  topic: string;
  grammar: string;
  difficulty: "HARD" | "MEDIUM" | "EASY";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  ammountQuestions: number;
}

export const ExamGeneratorPage = () => {
  const [formData, setFormData] = useState<ExamRequestData>({
    topic: "La magia del amor de los gatos",
    grammar: "Present Simple",
    difficulty: "HARD",
    level: "B2",
    ammountQuestions: 3,
  });

  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortController = useRef(new AbortController());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "ammountQuestions" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setResult("");

      const stream = examGenerateUseCase(
        formData,
        abortController.current.signal
      );

      for await (const chunk of stream) {
        setResult((prevResult) => prevResult + chunk); // Actualiza el estado progresivamente
      }

      setIsLoading(false);
    } catch (error) {
      setResult("Error generating the exam. Please try again.");
      setIsLoading(false);
    }
  };

  const handleAbort = () => {
    abortController.current.abort();
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col p-1 min-h-screen overflow-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Exam Generator
        </h1>
        <button
          onClick={isLoading ? handleAbort : handleSubmit}
          className={`flex items-center justify-center w-12 h-12 rounded-full text-white 
            ${
              isLoading
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } 
            dark:bg-${isLoading ? "red-700" : "blue-700"} dark:hover:bg-${
            isLoading ? "red-800" : "blue-800"
          }`}
        >
          {isLoading ? (
            <div className="relative">
              <i className="fas fa-stop text-2xl"></i>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white opacity-25"></div>
              </div>
            </div>
          ) : (
            <i className="fas fa-arrow-up text-2xl"></i>
          )}
        </button>
      </div>

      <div className="w-full bg-transparent rounded-lg shadow mb-6">
        <div className="mb-4">
          <label
            className="block text-zinc-700 dark:text-zinc-300 mb-2"
            htmlFor="topic"
          >
            Topic
          </label>
          <input
            id="topic"
            name="topic"
            type="text"
            value={formData.topic}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-zinc-300"
          />
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label
              className="block text-zinc-700 dark:text-zinc-300 mb-2"
              htmlFor="grammar"
            >
              Grammar
            </label>
            <input
              id="grammar"
              name="grammar"
              type="text"
              value={formData.grammar}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-zinc-300"
            />
          </div>
          <div className="flex-shrink-0">
            <label
              className="block text-zinc-700 dark:text-zinc-300 mb-2"
              htmlFor="difficulty"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-zinc-300"
            >
              <option value="HARD">HARD</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="EASY">EASY</option>
            </select>
          </div>

          <div className="flex-shrink-0">
            <label
              className="block text-zinc-700 dark:text-zinc-300 mb-2"
              htmlFor="level"
            >
              Level
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-zinc-300"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>

          <div className="flex-shrink-0">
            <label
              className="block text-zinc-700 dark:text-zinc-300 mb-2"
              htmlFor="ammountQuestions"
            >
              Amount
            </label>
            <input
              id="ammountQuestions"
              name="ammountQuestions"
              type="number"
              value={+formData.ammountQuestions}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-zinc-300"
            />
          </div>
        </div>
      </div>

      <div className="w-full rounded-lg shadow p-2 pb-20">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Result
        </h2>
        <div className="w-full h-full p-2 border rounded dark:bg-zinc-800 dark:text-zinc-300 overflow-y-auto whitespace-pre-wrap">
          {result}
        </div>
      </div>
    </div>
  );
};
