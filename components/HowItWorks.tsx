import { Target, Square, Trophy } from "lucide-react";

const HowItWorks = () => {
  const steps: {
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
  }[] = [
    {
      icon: Target,
      title: "Pick a Board",
      description:
        "Choose from available NFL game boards and find your perfect match.",
      color: "bg-[#002244]",
    },
    {
      icon: Square,
      title: "Claim Your Square",
      description:
        "Select your lucky square on the 10x10 grid and make it yours.",
      color: "bg-[#8d594d]",
    },
    {
      icon: Trophy,
      title: "Watch & Win",
      description:
        "Cheer for your numbers as the game unfolds and collect your prizes.",
      color: "bg-[#004953]",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#002244] dark:text-white mb-4 transition-colors duration-300">
            How It Works
          </h2>
          <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-2xl mx-auto transition-colors duration-300">
            Get started with Football Squares in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="text-center group hover:scale-105 transform transition-all duration-300"
            >
              {/* Step Number */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div
                    className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-[#ed5925] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-4 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-[#708090] dark:text-[#96abdc] leading-relaxed transition-colors duration-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/free-board"
            className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
          >
            Play For Free
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
