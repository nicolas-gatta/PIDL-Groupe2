import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';  

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Tous les champs doivent être remplis');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Stocker le token dans localStorage par exemple
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
                // Redirection ou autre logique ici
            } else {
                const err = await response.json();
                setError(err.error || 'Échec de la connexion');
            }
        } catch (error) {
            setError('Erreur réseau');
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
