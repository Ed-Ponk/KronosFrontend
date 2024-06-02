import React, {useState,useEffect}from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import JuradoPage from './pages/JuradoPage';

import { User } from './types/User';
const App = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/jurado" element={<JuradoPage />} />
        

      </Routes>
    </div>
  );
};

export default App;