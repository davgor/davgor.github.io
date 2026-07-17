import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AboutMe from './pages/AboutMe';
import Experience from './pages/Experience';
import CodingReference from './pages/CodingReference';
import Dogs from './pages/Dogs';
import Hobbies from './pages/Hobbies';
import ContactMe from './pages/ContactMe';

export const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AboutMe />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/coding-reference" element={<CodingReference />} />
        <Route path="/dogs" element={<Dogs />} />
        <Route path="/hobbies" element={<Hobbies />} />
        <Route path="/contact" element={<ContactMe />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </Router>
  );
};

export default App;
