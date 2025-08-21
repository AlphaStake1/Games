'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestingPage() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 'visual_appeal',
      question: 'How visually appealing is the Football Squares website?',
      options: [
        'Very Unappealing',
        'Unappealing',
        'Neutral',
        'Appealing',
        'Very Appealing',
      ],
    },
    {
      id: 'ease_of_use',
      question: 'How easy is it to navigate and use the website?',
      options: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy'],
    },
    {
      id: 'wallet_connection',
      question: 'How smooth was the wallet connection process?',
      options: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
    },
    {
      id: 'square_selection',
      question: 'How intuitive is the square selection process?',
      options: [
        'Very Confusing',
        'Confusing',
        'Neutral',
        'Clear',
        'Very Clear',
      ],
    },
    {
      id: 'signature_variety',
      question: 'How do you rate the variety of signature styles available?',
      options: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
    },
    {
      id: 'performance',
      question: 'How fast and responsive is the website?',
      options: ['Very Slow', 'Slow', 'Average', 'Fast', 'Very Fast'],
    },
    {
      id: 'trust_level',
      question: 'How much do you trust this platform with transactions?',
      options: [
        'Not at all',
        'Slightly',
        'Moderately',
        'Very Much',
        'Completely',
      ],
    },
    {
      id: 'recommendation',
      question: 'How likely are you to recommend this to a friend?',
      options: [
        'Very Unlikely',
        'Unlikely',
        'Neutral',
        'Likely',
        'Very Likely',
      ],
    },
    {
      id: 'overall_experience',
      question:
        'Rate your overall experience with the Football Squares platform',
      options: [
        '1 - Poor',
        '2 - Below Average',
        '3 - Average',
        '4 - Good',
        '5 - Excellent',
      ],
    },
  ];

  const handleSubmit = () => {
    console.log('Test Responses:', responses);
    setSubmitted(true);

    // In a real app, you'd send this to your backend
    localStorage.setItem(
      'testResponses_' + Date.now(),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        responses,
      }),
    );
  };

  const allQuestionsAnswered = questions.every((q) => responses[q.id]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white p-8">
        <div className="max-w-2xl mx-auto bg-black/30 backdrop-blur-md rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Thank You!</h1>
          <p className="text-xl text-center mb-8">
            Your feedback has been recorded. We appreciate your time testing our
            platform!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setResponses({});
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Take Test Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Football Squares Testing
          </h1>
          <p className="text-center text-lg opacity-90">
            Please test the platform and answer the following questions about
            your experience
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-black/30 backdrop-blur-md rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4">
                {index + 1}. {q.question}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      setResponses({ ...responses, [q.id]: option })
                    }
                    className={`p-3 rounded-lg transition-all ${
                      responses[q.id] === option
                        ? 'bg-green-600 text-white scale-105 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-black/30 backdrop-blur-md rounded-xl p-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-center">
              {Object.keys(responses).length} of {questions.length} questions
              answered
            </p>
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                allQuestionsAnswered
                  ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              Submit Feedback
            </button>
            {!allQuestionsAnswered && (
              <p className="text-yellow-400 text-sm">
                Please answer all questions before submitting
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
}
