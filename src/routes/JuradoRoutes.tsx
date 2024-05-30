import React from 'react';
import { Route, Routes } from 'react-router-dom';
import JuradoDashboard from '../components/jurado/JuradoDashboard';

const JuradoRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<JuradoDashboard />} />
  </Routes>
);

export default JuradoRoutes;
