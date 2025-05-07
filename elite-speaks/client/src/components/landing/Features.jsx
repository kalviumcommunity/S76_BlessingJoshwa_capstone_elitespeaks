import React from 'react';

const Features = () => {
  const featuresList = [
    {
      title: "Daily Missions",
      description: "Kickstart your day with a 2-3 minute speaking prompt designed to build fluency one topic at a time.",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-200"
    },
    {
      title: "Feedback & Reflection",
      description: "Grow faster with self-ratings, peer feedback, and personalized insights on your journal entries.",
      bgColor: "bg-green-50",
      borderColor: "border-green-100"
    },
    {
      title: "Points & Streaks",
      description: "Stay consistent and motivated with daily points, streak rewards, and leaderboard glory.",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-100"
    },
    {
      title: "Community Forum",
      description: "Learn together in a safe space—ask questions, share wins, and connect with fellow learners.",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12 relative">
        Why Elite Speaks?
        <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-red-400 rounded-full"></div>
      </h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {featuresList.map((feature, index) => (
          <div key={index} className={`${feature.bgColor} p-6 rounded-3xl border-2 ${feature.borderColor}`}>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;