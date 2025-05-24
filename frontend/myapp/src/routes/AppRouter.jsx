// src/routes/AppRouter.jsx 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import AddModelPage from '../pages/AddModelPage'

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Rediriger la racine vers /login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Route pour la page de connexion */}
                <Route path="/login" element={<LoginPage />} />

                {/* Route pour la page du Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Route pour la page d'ajout */}
                <Route path="/ajout" element={<AddModelPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;