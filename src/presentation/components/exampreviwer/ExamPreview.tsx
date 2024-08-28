import React, { useState } from "react";

interface Question {
  title: string;
  type: "MULTIPLE" | "UNIQUE";
  options: string[];
  correctAnswer: string;
}

interface ExamPreviewProps {
  title: string;
  questions: Question[];
}

export const ExamPreview: React.FC<ExamPreviewProps> = ({
  title,
  questions,
}) => {
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionIndex: number, option: string) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev };

      if (questions[questionIndex].type === "MULTIPLE") {
        const currentAnswers = updatedAnswers[questionIndex] || [];
        if (currentAnswers.includes(option)) {
          updatedAnswers[questionIndex] = currentAnswers.filter(
            (answer) => answer !== option
          );
        } else {
          updatedAnswers[questionIndex] = [...currentAnswers, option];
        }
      } else {
        updatedAnswers[questionIndex] = [option];
      }

      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const isCorrect = (questionIndex: number, option: string) => {
    return questions[questionIndex].correctAnswer === option;
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {title}
      </h1>

      {questions.map((question, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">
            {index + 1}. {question.title}
          </h2>

          <div className="space-y-2">
            {question.options.map((option, optionIndex) => {
              const isSelected = answers[index]?.includes(option) || false;
              const correct = isCorrect(index, option);

              return (
                <div
                  key={optionIndex}
                  onClick={() => handleSelect(index, option)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-150 border-2 ${
                    submitted
                      ? correct
                        ? "border-green-500"
                        : isSelected
                        ? "border-red-600"
                        : "border-gray-300"
                      : isSelected
                      ? "border-blue-500"
                      : "border-white"
                  }`}
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {option}
                  </span>

                  {submitted && (
                    <i
                      className={`ml-auto text-lg ${
                        correct
                          ? "text-green-500 fas fa-check"
                          : isSelected
                          ? "text-red-500 fas fa-times"
                          : ""
                      }`}
                    ></i>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 hover:bg-blue-700 hover:border-blue-300 text-white font-semibold py-2 px-4 rounded-lg shadow"
      >
        Submit Answers
      </button>
    </div>
  );
};
