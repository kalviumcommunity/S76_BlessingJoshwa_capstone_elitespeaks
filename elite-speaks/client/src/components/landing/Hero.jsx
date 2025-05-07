import React from 'react';
import { Link } from 'react-router-dom';
import doodle from '../../assets/doodle.png';

const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-12 mt-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <p className="text-gray-600 text-sm uppercase font-medium mb-2">IT IS NOT FOR LOSERS</p>
          <h1 className="text-4xl font-bold mb-4">
            Elite Speaks isn't just another <span className="font-extrabold">English learning platform</span>
          </h1>
          <p className="text-gray-600 mb-8">It is a place where you can improve your speaking skills</p>
          <div className="flex space-x-4">
            <Link to="/signup" className="bg-blue-500 text-white px-6 py-2 rounded-md">Start today</Link>
            <button className="border border-gray-400 px-6 py-2 rounded-md">See how it works</button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src={doodle} 
            alt="Speaking practice illustration" 
            className="w-full max-w-md rounded-lg " 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;