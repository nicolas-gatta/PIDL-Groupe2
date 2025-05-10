// Dashboard.jsx - Vue principale pour la gestion des modèles IA
// Ce composant affiche une table filtrable et triable des modèles IA 
// récupérés depuis l'API backend, avec vérification d'authentification.
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisation du hook React Router pour la navigation
import { FaBars, FaArrowLeft } from 'react-icons/fa'; // Remplacement de Ionicons avec react-icons
import './Dashboard.css'; // Fichier CSS pour les styles

const Dashboard = () => {
    const navigate = useNavigate();
    // Visibilité de la barre latérale
    const [sidebarVisible, setSidebarVisible] = useState(true);
    // État utilisateur connecté
    const [user, setUser] = useState({});
    // Données de modèles à afficher et erreur potentielle
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    // États pour les filtres simples
    const [selectedTask, setSelectedTask] = useState('');
    const [selectedType, setSelectedType] = useState('');
    // Filtres avancés (affichés dans modal)
    const [selectedEmissionRange, setSelectedEmissionRange] = useState([0, 1]);
    const [selectedEnergyConsumptionRange, setSelectedEnergyConsumptionRange] = useState([0, 250]);
    const [selectedTrainingTimeRange, setSelectedTrainingTimeRange] = useState([0, 100000]); // En secondes
    const [selectedCreator, setSelectedCreator] = useState('');
    const [selectedLayersRange, setSelectedLayersRange] = useState([0, 500]);
    const [selectedParametersRange, setSelectedParametersRange] = useState([0, 10000]);
    const [selectedAccuracyRange, setSelectedAccuracyRange] = useState([0, 100]);
    const [selectedLossRange, setSelectedLossRange] = useState([0, 10]);
    const [selectedLatencyRange, setSelectedLatencyRange] = useState([0, 1000]);
    const [selectedMap50Range, setSelectedMap50Range] = useState([0, 1]);
    const [selectedMap5095Range, setSelectedMap5095Range] = useState([0, 1]);

    // États booléens supplémentaires
    const [asTeacher, setAsTeacher] = useState(false);
    const [asStudent, setAsStudent] = useState(false);
    const [hasOptimization, setHasOptimization] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Tri des colonnes
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Redirige vers /login si l'utilisateur n'est pas connecté
    useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        }
    }, [navigate]);


    // Récupération des données utilisateur depuis le localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
        }
    }, []);
    // Récupération des données de modèles depuis l'API
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://127.0.0.1:8000/models/get_full_data_models', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Échec de la récupération des données');
                }
                const result = await response.json();
                setData(result.models); // Les données sont dans la clé "models"
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    // Construction dynamique des options pour les filtres
    const allTasks = Array.from(new Set(data.flatMap(model => model.tasks?.map(t => t.task_name) || [])));
    const allArchitectures = Array.from(new Set(data.map(m => m.architecture)));

    // Configuration des colonnes de tableau
    const tableHeaders = [
        { key: 'model_name', label: 'Nom du Modèle' },
        { key: 'architecture', label: 'Architecture' },
        { key: 'model_size_label', label: 'Taille' },
        { key: 'precision', label: 'Précision' },
        { key: 'layers', label: 'Couches' },
        { key: 'parameters_m', label: 'Paramètres (M)' },
        { key: 'flops_b', label: 'FLOPs (B)' },
        { key: 'model_size', label: 'Taille (Mo)' },
        { key: 'training_time', label: 'Temps d’entraînement (s)' },
        { key: 'accuracy', label: 'Précision' },
        { key: 'final_loss', label: 'Perte' },
        { key: 'latency_ms', label: 'Latence (ms)' },
        { key: 'fps_gpu', label: 'FPS GPU' },
        { key: 'avg_emissions_gco2eq', label: 'CO2 (g)' },
        { key: 'avg_energy_mwh', label: 'Énergie (mWh)' },
        { key: 'map_50', label: 'mAP@50' },
        { key: 'map_50_95', label: 'mAP@50:95' },
        { key: 'cpu_type', label: 'Type CPU' },
        { key: 'memory_gpu', label: 'Mémoire GPU (Go)' },
        { key: 'memory_gb', label: 'RAM (Go)' },
        { key: 'cpu_frequency_ghz', label: 'Fréquence CPU (GHz)' },
        { key: 'max_power_watts', label: 'Puissance max (W)' },
        { key: 'creator', label: 'Créateur' }
    ];

    // Filtrage des données selon les critères sélectionnés
    const filteredData = data.filter(model => {
        return (
            (selectedTask ? model.tasks?.some(t => t.task_name === selectedTask) : true) &&
            (selectedType ? model.architecture === selectedType : true) &&
            (model.avg_emissions_gco2eq >= selectedEmissionRange[0] && model.avg_emissions_gco2eq <= selectedEmissionRange[1]) &&
            (model.avg_energy_mwh >= selectedEnergyConsumptionRange[0] && model.avg_energy_mwh <= selectedEnergyConsumptionRange[1]) &&
            (model.training_time >= selectedTrainingTimeRange[0] && model.training_time <= selectedTrainingTimeRange[1])&&
            (selectedCreator ? model.creator === selectedCreator : true) &&
            (asTeacher ? model.teacher.length > 0 : true) &&
            (asStudent ? model.student.length > 0 : true) &&
            (hasOptimization ? model.optimizations.length > 0 : true) &&
            (model.layers >= selectedLayersRange[0] && model.layers <= selectedLayersRange[1]) &&
            (model.parameters_m >= selectedParametersRange[0] && model.parameters_m <= selectedParametersRange[1]) &&
            (model.accuracy >= selectedAccuracyRange[0] &&
            model.accuracy <= selectedAccuracyRange[1]) &&
            (model.final_loss >= selectedLossRange[0] &&
            model.final_loss <= selectedLossRange[1]) &&
            (model.latency_ms >= selectedLatencyRange[0] &&
            model.latency_ms <= selectedLatencyRange[1]) &&
            (model.map_50 >= selectedMap50Range[0] &&
            model.map_50 <= selectedMap50Range[1]) &&
            (model.map_50_95 >= selectedMap5095Range[0] &&
            model.map_50_95 <= selectedMap5095Range[1])



        );
    });
    // Tri dynamique des données filtrées
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;   
    });

// Fonction pour mettre à jour le tri
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Redirection vers login et suppression des données
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    // Rendu d'un groupe de filtre
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
    // Composant retourné
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
                            <h3 className="username">{user.first_name} {user.last_name}</h3>
                            <p className="email">{user.email}</p>
                        </div>

                        <button className="logout-button" onClick={handleLogout}>Déconnexion</button>

                        {/* Filtres */}
                        {renderFilterGroup('Tâche', ['', ...allTasks], selectedTask, setSelectedTask)}
                        {renderFilterGroup('Type de Modèle', ['', ...allArchitectures], selectedType, setSelectedType)}
                        {renderFilterGroup('Créateur', ['', ...Array.from(new Set(data.map(m => m.creator)))], selectedCreator, setSelectedCreator)}


                        {/* Sliders pour les filtres */}
                        
                        <button className="advanced-filter-toggle" onClick={() => setShowAdvancedFilters(true)}>
                            Filtres Avancés
                        </button>

                    </div> 
                </div>
            )}

            {/* Main Content */}
            <div className={`main-content ${sidebarVisible ? 'full' : 'collapsed'}`}>
                <h1>Gestion des modèles IA</h1>

                <div className="table-container">
                    <div className="table-navigation">
                        
                    </div>

                    <table>
                        <thead>
                        <tr>
                            {tableHeaders.map((header) => (
                            <th key={header.key} onClick={() => handleSort(header.key)} style={{ cursor: 'pointer' }}>
                                {header.label} {sortConfig.key === header.key ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((item) => (
                                <tr key={item.id}>
                                {tableHeaders.map((col) => (
                                    <td key={col.key}>{item[col.key]}</td>
                                ))}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                {showAdvancedFilters && (
                <div className="modal-overlay">
                    <div className="modal-content">
                    <h3>Filtres Avancés</h3>

                    <div className="slider-group">
                        <label>Couches (layers)</label>
                        <input type="range" min="0" max="500" step="1"
                        value={selectedLayersRange[0]}
                        onChange={(e) => setSelectedLayersRange([parseInt(e.target.value), selectedLayersRange[1]])}
                        />
                        <input type="range" min="0" max="500" step="1"
                        value={selectedLayersRange[1]}
                        onChange={(e) => setSelectedLayersRange([selectedLayersRange[0], parseInt(e.target.value)])}
                        />
                        <span>{selectedLayersRange[0]} - {selectedLayersRange[1]}</span>
                    </div>

                    <div className="slider-group">
                        <label>Paramètres (M)</label>
                        <input type="range" min="0" max="10000" step="10"
                        value={selectedParametersRange[0]}
                        onChange={(e) => setSelectedParametersRange([parseFloat(e.target.value), selectedParametersRange[1]])}
                        />
                        <input type="range" min="0" max="10000" step="10"
                        value={selectedParametersRange[1]}
                        onChange={(e) => setSelectedParametersRange([selectedParametersRange[0], parseFloat(e.target.value)])}
                        />
                        <span>{selectedParametersRange[0]} - {selectedParametersRange[1]} M</span>
                    </div>

                    <div className="slider-group">
                            <label>Tranche d’émission CO2 (g)</label>
                            <input type="range" min="0" max="1" step="0.01"
                                value={selectedEmissionRange[0]}
                                onChange={(e) =>
                                setSelectedEmissionRange([parseFloat(e.target.value), selectedEmissionRange[1]])
                                }
                            />
                            <input type="range" min="0" max="1" step="0.01"
                                value={selectedEmissionRange[1]}
                                onChange={(e) =>
                                setSelectedEmissionRange([selectedEmissionRange[0], parseFloat(e.target.value)])
                                }
                            />
                            <span>{selectedEmissionRange[0]} - {selectedEmissionRange[1]} g</span>
                        </div>

                        <div className="slider-group">
                            <label>Consommation Énergétique (mWh)</label>
                            <input type="range" min="0" max="250" step="5"
                                value={selectedEnergyConsumptionRange[0]}
                                onChange={(e) =>
                                setSelectedEnergyConsumptionRange([parseFloat(e.target.value), selectedEnergyConsumptionRange[1]])
                                }
                            />
                            <input type="range" min="0" max="250" step="5"
                                value={selectedEnergyConsumptionRange[1]}
                                onChange={(e) =>
                                setSelectedEnergyConsumptionRange([selectedEnergyConsumptionRange[0], parseFloat(e.target.value)])
                                }
                            />
                            <span>{selectedEnergyConsumptionRange[0]} - {selectedEnergyConsumptionRange[1]} mWh</span>
                        </div>

                            <div className="slider-group">
                            <label>Temps d’Entraînement (s)</label>
                            <input type="range" min="0" max="100000" step="1000"
                                value={selectedTrainingTimeRange[0]}
                                onChange={(e) =>
                                setSelectedTrainingTimeRange([parseFloat(e.target.value), selectedTrainingTimeRange[1]])
                                }
                            />
                            <input type="range" min="0" max="100000" step="1000"
                                value={selectedTrainingTimeRange[1]}
                                onChange={(e) =>
                                setSelectedTrainingTimeRange([selectedTrainingTimeRange[0], parseFloat(e.target.value)])
                                }
                            />
                            <span>{selectedTrainingTimeRange[0]} - {selectedTrainingTimeRange[1]} s</span>
                        </div>
                        <div className="checkbox-group">
                            <label>
                                <input type="checkbox" checked={asTeacher} onChange={(e) => setAsTeacher(e.target.checked)} />
                                Modèle enseignant
                            </label>
                            <label>
                                <input type="checkbox" checked={asStudent} onChange={(e) => setAsStudent(e.target.checked)} />
                                Modèle étudiant
                            </label>
                            <label>
                                <input type="checkbox" checked={hasOptimization} onChange={(e) => setHasOptimization(e.target.checked)} />
                                Optimisé
                            </label>
                        </div>
                        {/* Accuracy */}
                        <div className="slider-group">
                            <label>Accuracy (%)</label>
                            <input type="range" min="0" max="100" step="1"
                            value={selectedAccuracyRange[0]}
                            onChange={(e) => setSelectedAccuracyRange([parseFloat(e.target.value), selectedAccuracyRange[1]])}
                            />
                            <input type="range" min="0" max="100" step="1"
                            value={selectedAccuracyRange[1]}
                            onChange={(e) => setSelectedAccuracyRange([selectedAccuracyRange[0], parseFloat(e.target.value)])}
                            />
                            <span>{selectedAccuracyRange[0]}% - {selectedAccuracyRange[1]}%</span>
                        </div>

                        {/* Final Loss */}
                        <div className="slider-group">
                            <label>Final Loss</label>
                            <input type="range" min="0" max="10" step="0.01"
                            value={selectedLossRange[0]}
                            onChange={(e) => setSelectedLossRange([parseFloat(e.target.value), selectedLossRange[1]])}
                            />
                            <input type="range" min="0" max="10" step="0.01"
                            value={selectedLossRange[1]}
                            onChange={(e) => setSelectedLossRange([selectedLossRange[0], parseFloat(e.target.value)])}
                            />
                            <span>{selectedLossRange[0]} - {selectedLossRange[1]}</span>
                        </div>

                        {/* Latency */}
                        <div className="slider-group">
                            <label>Latence (ms)</label>
                            <input type="range" min="0" max="1000" step="10"
                            value={selectedLatencyRange[0]}
                            onChange={(e) => setSelectedLatencyRange([parseFloat(e.target.value), selectedLatencyRange[1]])}
                            />
                            <input type="range" min="0" max="1000" step="10"
                            value={selectedLatencyRange[1]}
                            onChange={(e) => setSelectedLatencyRange([selectedLatencyRange[0], parseFloat(e.target.value)])}
                            />
                            <span>{selectedLatencyRange[0]} - {selectedLatencyRange[1]} ms</span>
                        </div>

                        {/* mAP@50 */}
                        <div className="slider-group">
                            <label>mAP@50</label>
                            <input type="range" min="0" max="1" step="0.01"
                            value={selectedMap50Range[0]}
                            onChange={(e) => setSelectedMap50Range([parseFloat(e.target.value), selectedMap50Range[1]])}
                            />
                            <input type="range" min="0" max="1" step="0.01"
                            value={selectedMap50Range[1]}
                            onChange={(e) => setSelectedMap50Range([selectedMap50Range[0], parseFloat(e.target.value)])}
                            />
                            <span>{selectedMap50Range[0]} - {selectedMap50Range[1]}</span>
                        </div>

                        {/* mAP@50:95 */}
                        <div className="slider-group">
                            <label>mAP@50:95</label>
                            <input type="range" min="0" max="1" step="0.01"
                            value={selectedMap5095Range[0]}
                            onChange={(e) => setSelectedMap5095Range([parseFloat(e.target.value), selectedMap5095Range[1]])}
                            />
                            <input type="range" min="0" max="1" step="0.01"
                            value={selectedMap5095Range[1]}
                            onChange={(e) => setSelectedMap5095Range([selectedMap5095Range[0], parseFloat(e.target.value)])}
                            />
                            <span>{selectedMap5095Range[0]} - {selectedMap5095Range[1]}</span>
                        </div>
                    <button onClick={() => setShowAdvancedFilters(false)}>Fermer</button>
                    </div>
                </div>
                )}

            </div>
            
        </div>
    );
};

export default Dashboard;

