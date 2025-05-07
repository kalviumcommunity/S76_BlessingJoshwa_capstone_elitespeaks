import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import { Link } from 'react-router-dom';

const Landingpage = () => {
  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Landingpage;