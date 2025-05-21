// Dashboard.jsx - Vue principale pour la gestion des modèles IA
// Ce composant affiche une table filtrable et triable des modèles IA 
// récupérés depuis l'API backend, avec vérification d'authentification.
import React, { useState, useEffect, useCallback} from 'react';
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
    const [selectedCreator, setSelectedCreator] = useState('');
    const [selectedID, setSelectedID] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Filtres avancés (affichés dans modal)
    const [selectedEmissionRange, setSelectedEmissionRange] = useState([0, 1]);
    const [selectedEnergyConsumptionRange, setSelectedEnergyConsumptionRange] = useState([0, 500]);
    const [selectedTrainingTimeRange, setSelectedTrainingTimeRange] = useState([0, 1000000]); // En secondes
   // //const [selectedCreator, setSelectedCreator] = useState('');
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

    // Tri des colonnes
    //const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Redirige vers /login si l'utilisateur n'est pas connecté
    useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        }
    }, [navigate]);


    // Récupération des données utilisateur depuis le localStorage
    useEffect(() => {
    // Récupérer l'utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    
    // Vérification que les données existent avant de les parser
    if (userData) {
        try {
            const parsedUserData = JSON.parse(userData);
            //console.log("Nom de l'utilisateur:", parsedUserData.first_name); // Accès au nom de l'utilisateur
            setUser(parsedUserData);  // Mettre à jour l'état utilisateur
        } catch (error) {
            //console.error("Erreur lors du parsing de l'utilisateur:", error);
        }
    } else {
        //console.log("Aucun utilisateur trouvé dans localStorage.");
    }
    }, []);
    // Récupération des données de modèles depuis l'API

    const fetchFilteredData = useCallback(async () => {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams();
        if (selectedTask) queryParams.append('task', selectedTask);
        if (selectedType) queryParams.append('architecture', selectedType);
        if (selectedCreator) queryParams.append('creator', selectedCreator);
        if (selectedID) queryParams.append('id', selectedID);
        //queryParams.append('layers_min', selectedLayersRange[0]);
        //queryParams.append('layers_max', selectedLayersRange[1]);
        //queryParams.append('parameters_min', selectedParametersRange[0]);
        //queryParams.append('parameters_max', selectedParametersRange[1]);
        queryParams.append('emissions_min', selectedEmissionRange[0]);
        queryParams.append('emissions_max', selectedEmissionRange[1]);
        queryParams.append('energy_min', selectedEnergyConsumptionRange[0]);
        queryParams.append('energy_max', selectedEnergyConsumptionRange[1]);
        //queryParams.append('training_time_min', selectedTrainingTimeRange[0]);
        queryParams.append('max_training_time', selectedTrainingTimeRange[1]);
        //queryParams.append('accuracy_min', selectedAccuracyRange[0]);
        //queryParams.append('accuracy_max', selectedAccuracyRange[1]);
        //queryParams.append('loss_min', selectedLossRange[0]);
        //queryParams.append('loss_max', selectedLossRange[1]);
        //queryParams.append('latency_min', selectedLatencyRange[0]);
        //queryParams.append('latency_max', selectedLatencyRange[1]);
        //queryParams.append('map50_min', selectedMap50Range[0]);
        //queryParams.append('map50_max', selectedMap50Range[1]);
        //queryParams.append('map5095_min', selectedMap5095Range[0]);
        //queryParams.append('map5095_max', selectedMap5095Range[1]);
        
        if (asTeacher) queryParams.append('as_teacher', 'true');
        if (asStudent) queryParams.append('as_student', 'true');
        if (hasOptimization) queryParams.append('has_optimization', 'true');
        

        const url = `http://127.0.0.1:8000/models/get_filtered_simplify_data_models/?${queryParams.toString()}`;
        //console.log("Generated URL:",url);
        //console.log("queryParams.toString():",queryParams.toString());

        try 
        {
            const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
            });

            if (!response.ok) throw new Error('Erreur lors du chargement des données filtrées');
            const result = await response.json();
            //console.log("Données complètes:", result);
            if (result) {
                setData(result.models);
            } else {
                //console.error('La réponse ne contient pas de modèles valides.', result);
            }
        } catch (err) {
            setError(err.message);
            //console.error("Erreur lors de la récupération des données:", err);
            }
        }, [
        selectedTask, selectedType, selectedCreator, selectedLayersRange,
        selectedParametersRange, selectedEmissionRange, selectedEnergyConsumptionRange,
        selectedTrainingTimeRange, asTeacher, asStudent, hasOptimization,
        selectedAccuracyRange, selectedLossRange, selectedLatencyRange,
        selectedMap50Range, selectedMap5095Range,selectedID
        ]
    );

    useEffect(() => {
        fetchFilteredData();
        }, [fetchFilteredData]
    );

    // Construction dynamique des options pour les filtres
    ////console.log(data)
    const allTasks = Array.from(new Set(data.flatMap(model => model.tasks?.map(t => t.name) || [])));
    const allArchitectures = Array.from(new Set(data.map(m => m.architecture)));
    const allID = Array.from(new Set(data.map(m => m.id)));
    //console.log("allID",allID)

    // Configuration des colonnes de tableau
    const tableHeaders = [
        { key: 'id', label: 'ID du Modèle ' },
        { key: 'name', label: 'Nom du Modèle' },
        { key: 'architecture', label: 'Architecture' },
        { key: 'creator', label: 'Créateur' },
        { key: 'model_size_label', label: 'Taille' },
        { key: 'precision', label: 'Format du Modèle' },
        { key: 'layers', label: 'Couches' },
        { key: 'parameters_m', label: 'Paramètres (M)' },
        { key: 'flops_b', label: 'FLOPs (B)' },
        { key: 'model_size', label: 'Taille (Mo)' },
        { key: 'training_time', label: 'Temps d’entraînement (s)' },
        { key: 'creation_date', label: 'Date de création'},
       // { key: 'id_evaluation', label: 'ID Evaluation ' },
       // { key: 'accuracy', label: 'Précision' },
       // { key: 'final_loss', label: 'Perte' },
       // { key: 'latency_ms', label: 'Latence (ms)' },
        { key: 'fps_gpu', label: 'FPS GPU' },
        { key: 'avg_emissions_gco2eq', label: 'CO2 (g)' },
        { key: 'avg_energy_mwh', label: 'Énergie (mWh)' },
        { key: 'map_50', label: 'mAP@50' },
        { key: 'map_50_95', label: 'mAP@50:95' },
        //{ key: 'cpu', label: 'Type CPU' },
        //{ key: 'gpu_memory', label: 'Mémoire GPU (Go)' },
        //{ key: 'computer_ram', label: 'RAM (Go)' },
        //{ key: 'cpu_frenquency', label: 'Fréquence CPU (GHz)' },
        //{ key: 'max_watts', label: 'Puissance max (W)' },
        
    ];
    
    // Tri dynamique des données filtrées
    /*
   const sortedData = data.length > 0 ? [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;   
    }) : [];

    // Fonction pour mettre à jour le tri
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    */

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
                        {renderFilterGroup('ID du Modèle', ['', ...allID], selectedID, setSelectedID)}
                        {renderFilterGroup('Créateur', ['', ...Array.from(new Set(data.map(m => m.creator)))], selectedCreator, setSelectedCreator)}
                        
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
                            <th key={header.key} /*onClick={() => handleSort(header.key)} style={{ cursor: 'pointer' }}*/>
                                {header.label} {/*sortConfig.key === header.key ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''*/}
                            </th>
                            ))}
                        </tr>
                        </thead>
                            <tbody>
                            {data.map((item) => (
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

        
                    <button onClick={() => {
                        setShowAdvancedFilters(false);
                        fetchFilteredData();
                     }}>
                        Appliquer les filtres
                    </button>
                 </div>
                </div>
                )}

            </div>
            
        </div>
    );
};

export default Dashboard;


{/*
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
                        
                        
                        <div className="slider-group">
                            <label>Précision (%)</label>
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
                        */}
