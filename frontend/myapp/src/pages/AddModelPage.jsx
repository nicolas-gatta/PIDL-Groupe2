import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddModelPage.css';

export default function AddModelPage() {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const exampleJson = {
        model: "Exemple",
        version: 1,
        data: []
    };

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(exampleJson, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exemple-modele.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFile = (file) => {
        setError('');
        setSuccess('');
        if (file.type !== 'application/json') {
            setError('Veuillez sélectionner un fichier JSON valide.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setJsonInput(e.target.result);
        };
        reader.readAsText(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        setError('');
        setSuccess('');
        try {
            JSON.parse(jsonInput);
            setSuccess('JSON valide ! Modèle ajouté.');
        } catch {
            setError('JSON invalide, merci de vérifier la syntaxe.');
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="page-wrapper">
            <header className="brand-header">
                <h1 className="brand-title">DeepCompare</h1>
            </header>

            <button className="back-button" onClick={handleBack}>
                ←
            </button>

            <main className="add-model-container">
                <h2 style={{ marginBottom: '20px', color: 'black' }}>
                    Importez facilement vos modèles JSON !
                </h2>

                <button className="download-button" onClick={handleDownload}>
                    Télécharger un modèle JSON exemple
                </button>

                <div
                    className="drop-zone"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current.click()}
                    style={{ cursor: 'pointer' }}
                >
                    Glissez-déposez un fichier JSON ici ou cliquez pour parcourir
                </div>

                <input
                    type="file"
                    accept=".json,application/json"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                />

                <textarea
                    className="json-textarea"
                    placeholder="Ou collez votre JSON ici..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                />

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <button className="submit-button" onClick={handleSubmit}>
                    Ajouter le modèle
                </button>
            </main>
        </div>
    );
}
