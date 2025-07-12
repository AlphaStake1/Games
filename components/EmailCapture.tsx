"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Simulate submission
    setIsSubmitted(true);
    setEmail("");
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-[#004953]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <CheckCircle className="w-16 h-16 text-[#004953] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#002244] mb-4">
              You're All Set!
            </h2>
            <p className="text-[#708090] text-lg">
              Thanks for subscribing! You'll receive our weekly NFL Squares &
              Fantasy tips in your inbox.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 text-[#004953] hover:underline font-semibold"
            >
              Subscribe another email
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#004953]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <Mail className="w-16 h-16 text-[#004953] mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002244] mb-4">
              Get Weekly NFL Squares & Fantasy Tips
            </h2>
            <p className="text-[#708090] text-lg max-w-2xl mx-auto">
              Stay ahead of the game with insider tips, weekly picks, and
              exclusive strategies delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 border-2 rounded-lg text-[#002244] placeholder-[#708090] focus:outline-none focus:ring-2 focus:ring-[#004953] transition-colors duration-200 ${
                  error
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#004953]"
                }`}
                aria-describedby={error ? "email-error" : undefined}
              />
              {error && (
                <p
                  id="email-error"
                  className="mt-2 text-red-600 text-sm"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white py-3 rounded-lg font-bold text-lg hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>

          <p className="text-center text-sm text-[#708090] mt-6">
            We respect your privacy. Unsubscribe at any time. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;
