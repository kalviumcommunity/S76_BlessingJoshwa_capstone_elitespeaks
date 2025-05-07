import React from 'react';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Elite Speaks made daily English practice fun and encouraging. I never skipped overthinking and started speaking!",
      name: "Jack Sibre",
      position: "1st Year College Student"
    },
    {
      quote: "The prompts and streak system kept me motivated and made me more confident during college presentations.",
      name: "Blessing Joshwa",
      position: "1st Year College Student" 
    },
    {
      quote: "I used to be shy about my English, but the welcoming community gave me the courage to speak up every day.",
      name: "Rahul",
      position: "2nd Year College Student"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-6">till waiting??</h2>
      <div className="text-center mb-12">
        <span className="bg-cyan-200 px-6 py-2 rounded-full text-xl inline-block relative">
          See our elitespeakers feedback
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm mb-4">{testimonial.quote}</p>
            <div className="font-bold">{testimonial.name}</div>
            <div className="text-sm text-gray-600">{testimonial.position}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/signup" className="bg-yellow-300 text-2xl font-bold px-8 py-4 rounded-full inline-block">
          Become a elitespeaker
          <div className="text-sm font-normal">One day or Day One</div>
        </Link>
      </div>
    </section>
  );
};

export default Testimonials;