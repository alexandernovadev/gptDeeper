import React, { useState, useRef } from "react";
import { examGenerateUseCase } from "../../../core/use-cases/exam-generator/exam-generate.use-case";
import { ExamPreview } from "../../components/exampreviwer/ExamPreview";

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEndedStream, setIsEndedStream] = useState<boolean>(false);
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
    } finally {
      setIsEndedStream(true);
    }
  };

  const handleAbort = () => {
    abortController.current.abort();
    setIsLoading(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col p-1 min-h-screen overflow-auto pb-20">
      <div className="flex justify-between items-center">
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

      <div className="w-full bg-transparent rounded-lg shadow mb-2">
        <div className="mb-1">
          <label
            className="block text-zinc-700 dark:text-zinc-300 mb-1"
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

        <div className="flex space-x-4 mb-2">
          <div className="flex-1">
            <label
              className="block text-zinc-700 dark:text-zinc-300 mb-1"
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
              className="block text-zinc-700 dark:text-zinc-300 mb-1"
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
              className="block text-zinc-700 dark:text-zinc-300 mb-1"
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
              className="block text-zinc-700 dark:text-zinc-300 mb-1"
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
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            JSON Exam
          </h2>
          {result && isEndedStream && (
            <button
              onClick={handleModalOpen}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-4 rounded-lg shadow"
            >
              Preview Exam
            </button>
          )}
        </div>
        <div className="w-full h-full p-2 border rounded dark:bg-zinc-800 dark:text-zinc-300 overflow-y-auto whitespace-pre-wrap">
          {result}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 max-w-xl w-full h-[95vh] overflow-auto">
            <button
              onClick={handleModalClose}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-full"
            >
              Close
            </button>
            <ExamPreview
              title={
                "The Enchanting World of Feline Love: Present Simple Mastery"
              }
              questions={JSON.parse(result).questions}
            />
          </div>
        </div>
      )}
    </div>
  );
};
