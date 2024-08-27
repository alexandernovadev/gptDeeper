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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {title}
      </h1>

      {questions.map((question, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            {index + 1}. {question.title}
          </h2>

          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center">
                <input
                  type={question.type === "MULTIPLE" ? "checkbox" : "radio"}
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index]?.includes(option) || false}
                  onChange={() => handleSelect(index, option)}
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <label
                  htmlFor={`question-${index}-option-${optionIndex}`}
                  className="ml-3 text-gray-700 dark:text-gray-300"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => console.log(answers)}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
      >
        Submit Answers
      </button>
    </div>
  );
};
