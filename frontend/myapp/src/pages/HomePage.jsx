// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard');  
    };

    return (
        <div className="home-container">
            <h1>Bienvenue sur la page d'accueil !</h1>
            <button className="navigate-button" onClick={handleGoToLogin}>
                Aller à la page de connexion
            </button>
            <br />
            <button className="navigate-button" onClick={handleGoToDashboard}>
                Aller au Dashboard
            </button>
        </div>
    );
};

export default HomePage;
