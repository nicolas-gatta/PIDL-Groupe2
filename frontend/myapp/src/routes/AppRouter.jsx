// src/routes/AppRouter.jsx 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';  
import HomePage from '../pages/HomePage';   
import Dashboard from '../pages/Dashboard'; 

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Route pour la page d'accueil */}
                <Route path="/" element={<HomePage />} />

                {/* Route pour la page de connexion */}
                <Route path="/login" element={<LoginPage />} />

                {/* Route pour la page du Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
