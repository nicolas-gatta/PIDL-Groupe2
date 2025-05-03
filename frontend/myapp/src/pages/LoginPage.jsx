import React, { useState } from 'react';
import './LoginPage.css';  

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (username && password) {
            setError('Connexion réussie!');
        } else {
            setError('Tous les champs doivent être remplis');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Se Connecter</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <button onClick={handleLogin} className="login-button">
                    Se connecter
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}
