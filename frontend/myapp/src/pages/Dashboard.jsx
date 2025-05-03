import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisation du hook React Router pour la navigation
import { FaBars, FaArrowLeft } from 'react-icons/fa'; // Remplacement de Ionicons avec react-icons
import './Dashboard.css'; // Fichier CSS pour les styles

const Dashboard = () => {
    const navigate = useNavigate();
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const data = [
        {
            id: 1,
            modelName: 'GPT-4',
            size: 'Très grand',
            type: 'GPT-4',
            task: 'Génération de texte',
            accuracy: '92%',
            finalLoss: '0.02',
            numLayers: 48,
            numParameters: '175B',
            parameters: { learningRate: '0.001', epochs: 10, batchSize: 32 },
            flops: '1.5E+12',
            fps: '50 images/sec',
            co2Emissions: '0.5 kg',
            avgEnergyConsumption: '200 kWh',
            mAP50: '0.85',
            mAP095: '0.90',
            totalTrainingTime: '15 jours'
        },
        {
            id: 2,
            modelName: 'BERT',
            size: 'Moyen',
            type: 'BERT',
            task: 'Classification',
            accuracy: '89%',
            finalLoss: '0.05',
            numLayers: 24,
            numParameters: '110M',
            parameters: { learningRate: '0.0005', epochs: 5, batchSize: 64 },
            flops: '3.2E+11',
            fps: '40 images/sec',
            co2Emissions: '0.3 kg',
            avgEnergyConsumption: '150 kWh',
            mAP50: '0.80',
            mAP095: '0.85',
            totalTrainingTime: '7 jours'
        },
        {
            id: 3,
            modelName: 'Llama',
            size: 'Grand',
            type: 'Llama',
            task: 'Détection',
            accuracy: '91%',
            finalLoss: '0.03',
            numLayers: 32,
            numParameters: '100B',
            parameters: { learningRate: '0.0008', epochs: 8, batchSize: 64 },
            flops: '1.2E+12',
            fps: '60 images/sec',
            co2Emissions: '0.4 kg',
            avgEnergyConsumption: '180 kWh',
            mAP50: '0.82',
            mAP095: '0.88',
            totalTrainingTime: '10 jours'
        }
    ];

    const [selectedTask, setSelectedTask] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedEmissionRange, setSelectedEmissionRange] = useState([0, 1]);
    const [selectedEnergyConsumptionRange, setSelectedEnergyConsumptionRange] = useState([0, 250]);
    const [selectedTrainingTimeRange, setSelectedTrainingTimeRange] = useState([0, 20]);

    const filteredData = data.filter(item => {
        return (
            (selectedTask ? item.task === selectedTask : true) &&
            (selectedType ? item.type === selectedType : true) &&
            (parseFloat(item.co2Emissions) >= selectedEmissionRange[0] && parseFloat(item.co2Emissions) <= selectedEmissionRange[1]) &&
            (parseFloat(item.avgEnergyConsumption) >= selectedEnergyConsumptionRange[0] && parseFloat(item.avgEnergyConsumption) <= selectedEnergyConsumptionRange[1]) &&
            (parseFloat(item.totalTrainingTime) >= selectedTrainingTimeRange[0] && parseFloat(item.totalTrainingTime) <= selectedTrainingTimeRange[1])
        );
    });

    const handleLogout = () => {
        navigate('/login');
    };

    const renderFilterGroup = (label, options, selectedValue, onChange) => (
        <>
            <label className="filter-label">{label}</label>
            <select value={selectedValue} onChange={(e) => onChange(e.target.value)} className="picker">
                {options.map((option, index) => (
                    <option key={index} value={option}>{option === '' ? 'Tous' : option}</option>
                ))}
            </select>
        </>
    );

    return (
        <div className="dashboard-container">
            {/* Bouton de toggle Sidebar */}
            <button className="toggle-button" onClick={() => setSidebarVisible(!sidebarVisible)}>
                {sidebarVisible ? <FaArrowLeft /> : <FaBars />}
            </button>

            {/* Sidebar */}
            {sidebarVisible && (
                <div className="sidebar">
                    <div className="sidebar-content">
                        <div className="profile">
                            <img src="https://www.photoprof.fr/images_dp/photographes/profil_vide.jpg" alt="Profile" className="profile-image" />
                            <h3 className="username">John Doe</h3>
                            <p className="email">john.doe@example.com</p>
                        </div>

                        <button className="logout-button" onClick={handleLogout}>Déconnexion</button>

                        {/* Filtres */}
                        {renderFilterGroup('Tâche', ['', 'Génération de texte', 'Classification', 'Détection'], selectedTask, setSelectedTask)}
                        {renderFilterGroup('Type de Modèle', ['', 'GPT-4', 'BERT', 'Llama'], selectedType, setSelectedType)}

                        {/* Sliders pour les filtres */}
                        <div className="slider-group">
                            <label>Tranche d'Émission CO2 (kg)</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={selectedEmissionRange[0]}
                                onChange={(e) => setSelectedEmissionRange([parseFloat(e.target.value), selectedEmissionRange[1]])}
                            />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={selectedEmissionRange[1]}
                                onChange={(e) => setSelectedEmissionRange([selectedEmissionRange[0], parseFloat(e.target.value)])}
                            />
                            <span>{selectedEmissionRange[0]} - {selectedEmissionRange[1]} kg</span>
                        </div>

                        <div className="slider-group">
                            <label>Consommation Énergétique Moyenne (kWh)</label>
                            <input
                                type="range"
                                min="0"
                                max="500"
                                step="10"
                                value={selectedEnergyConsumptionRange[0]}
                                onChange={(e) => setSelectedEnergyConsumptionRange([parseFloat(e.target.value), selectedEnergyConsumptionRange[1]])}
                            />
                            <input
                                type="range"
                                min="0"
                                max="500"
                                step="10"
                                value={selectedEnergyConsumptionRange[1]}
                                onChange={(e) => setSelectedEnergyConsumptionRange([selectedEnergyConsumptionRange[0], parseFloat(e.target.value)])}
                            />
                            <span>{selectedEnergyConsumptionRange[0]} - {selectedEnergyConsumptionRange[1]} kWh</span>
                        </div>

                        <div className="slider-group">
                            <label>Temps Total d'Entraînement (jours)</label>
                            <input
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                value={selectedTrainingTimeRange[0]}
                                onChange={(e) => setSelectedTrainingTimeRange([parseFloat(e.target.value), selectedTrainingTimeRange[1]])}
                            />
                            <input
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                value={selectedTrainingTimeRange[1]}
                                onChange={(e) => setSelectedTrainingTimeRange([selectedTrainingTimeRange[0], parseFloat(e.target.value)])}
                            />
                            <span>{selectedTrainingTimeRange[0]} - {selectedTrainingTimeRange[1]} jours</span>
                        </div>
                    </div> 
                </div>
            )}

            {/* Main Content */}
            <div className={`main-content ${sidebarVisible ? 'full' : 'collapsed'}`}>
                <h1>Gestion des modèles IA</h1>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nom du Modèle</th>
                                <th>Taille</th>
                                <th>Type</th>
                                <th>Tâche</th>
                                <th>Précision</th>
                                <th>Perte Finale</th>
                                <th>Nombre de Couches</th>
                                <th>Paramètres</th>
                                <th>Flops</th>
                                <th>FPS</th>
                                <th>CO2</th>
                                <th>Consommation</th>
                                <th>mAP50</th>
                                <th>mAP095</th>
                                <th>Temps Entraînement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(item => (
                                <tr key={item.id}>
                                    <td>{item.modelName}</td>
                                    <td>{item.size}</td>
                                    <td>{item.type}</td>
                                    <td>{item.task}</td>
                                    <td>{item.accuracy}</td>
                                    <td>{item.finalLoss}</td>
                                    <td>{item.numLayers}</td>
                                    <td>{item.numParameters}</td>
                                    <td>{item.flops}</td>
                                    <td>{item.fps}</td>
                                    <td>{item.co2Emissions}</td>
                                    <td>{item.avgEnergyConsumption}</td>
                                    <td>{item.mAP50}</td>
                                    <td>{item.mAP095}</td>
                                    <td>{item.totalTrainingTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
