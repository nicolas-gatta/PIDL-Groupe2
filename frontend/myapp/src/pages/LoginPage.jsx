// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../images/Logo.png';



export default function LoginPage() {
    const navigate = useNavigate();
    const [showSignup, setShowSignup] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [signupError, setSignupError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState('');

    const BACKEND = 'http://127.0.0.1:8000';

    const checkTokenAndRedirect = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${BACKEND}/auth/validate_token/`, {
                method: 'GET',
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    navigate('/dashboard');
                }
            } else {
                console.log('Token found but invalid, staying on login.');
            }
        } catch (e) {
            console.error('Token check failed', e);
        }
    };

    const handleLogin = async () => {
        setLoginError('');
        if (!username || !password) {
            setLoginError('Tous les champs doivent être remplis');
            return;
        }
        try {
            const res = await fetch(`${BACKEND}/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setLoginError(data.error || 'Échec de la connexion');
            }
        } catch {
            setLoginError('Erreur réseau');
        }
    };

    const handleSignup = async () => {
        setSignupError('');
        setSignupSuccess('');
        if (!firstName || !lastName || !regEmail || !regPassword) {
            setSignupError('Tous les champs doivent être remplis');
            return;
        }
        try {
            const res = await fetch(`${BACKEND}/auth/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: regEmail,
                    password: regPassword,
                    first_name: firstName,
                    last_name: lastName
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSignupSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                setFirstName('');
                setLastName('');
                setRegEmail('');
                setRegPassword('');
                setShowSignup(false);
            } else {
                setSignupError(data.error || 'Échec de l’inscription');
            }
        } catch {
            setSignupError('Erreur réseau');
        }
    };

    useEffect(() => {
        checkTokenAndRedirect();
    }, []);

    return (
        <div className="login-container">
            <header className="login-header">
                <img src={logo} alt="Logo DeepCompare" className="login-logo" />
                <h1 className="brand-title">DeepCompare</h1>
            </header>

            <div className="login-box">
                {!showSignup ? (
                    <>
                        <h2>Se Connecter</h2>
                        {loginError && <p className="error-message">{loginError}</p>}

                        <input
                            type="email"
                            placeholder="Email"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="login-input"
                        />

                        <button onClick={handleLogin} className="login-button">
                            Se connecter
                        </button>

                        <button
                            onClick={() => {
                                setShowSignup(true);
                                setLoginError('');
                            }}
                            className="signup-switch-button"
                        >
                            Créer un compte
                        </button>
                    </>
                ) : (
                    <>
                        <h2>Inscription</h2>
                        {signupError && <p className="error-message">{signupError}</p>}
                        {signupSuccess && <p className="success-message">{signupSuccess}</p>}

                        <input
                            type="text"
                            placeholder="Prénom"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="text"
                            placeholder="Nom"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={regEmail}
                            onChange={e => setRegEmail(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={regPassword}
                            onChange={e => setRegPassword(e.target.value)}
                            className="login-input"
                        />

                        <button onClick={handleSignup} className="login-button">
                            S’inscrire
                        </button>

                        <button
                            onClick={() => {
                                setShowSignup(false);
                                setSignupError('');
                                setSignupSuccess('');
                            }}
                            className="signup-switch-button"
                        >
                            Déjà un compte ? Se connecter
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
