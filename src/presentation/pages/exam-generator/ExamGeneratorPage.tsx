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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setResult("");

      const response = await examGenerateUseCase(
        formData,
        abortController.current.signal
      );

      if (response) {
        setResult(JSON.stringify(response, null, 2)); // Formatea la respuesta como JSON para mostrarla
      } else {
        setResult("No data received from the exam generator.");
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
    <div className="flex flex-col p-1 min-h-screen overflow-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Exam Generator
      </h1>
  
      <div className="w-full bg-transparent rounded-lg shadow  mb-6">
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-2"
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
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
  
        <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-2"
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
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
          <div className="flex-shrink-0">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="difficulty"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="HARD">HARD</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="EASY">EASY</option>
            </select>
          </div>
  
          <div className="flex-shrink-0">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="level"
            >
              Level
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
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
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="ammountQuestions"
            >
              Amount
            </label>
            <input
              id="ammountQuestions"
              name="ammountQuestions"
              type="number"
              value={formData.ammountQuestions}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
  
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Exam"}
          </button>
          <button
            onClick={handleAbort}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
            disabled={!isLoading}
          >
            Abort
          </button>
        </div>
      </div>
  
      <div className="w-full rounded-lg shadow p-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Result
        </h2>
        <textarea
          readOnly
          value={result}
          className="w-full h-48 p-2 border rounded dark:bg-gray-800 dark:text-gray-300"
        />
      </div>
    </div>
  );
  
};
