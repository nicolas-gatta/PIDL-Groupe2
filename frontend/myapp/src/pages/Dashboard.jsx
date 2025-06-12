import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaArrowLeft } from 'react-icons/fa';
import ModelDetailModal from './components/ModelDetailModal';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Filtres simples
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCreator, setSelectedCreator] = useState('');
  const [selectedID, setSelectedID] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filtres avancés
  const [selectedEmissionRange, setSelectedEmissionRange] = useState([0, 1]);
  const [selectedEnergyConsumptionRange, setSelectedEnergyConsumptionRange] = useState([0, 500]);
  const [selectedTrainingTimeRange, setSelectedTrainingTimeRange] = useState([0, 1000000]);
  const [selectedParametersRange, setSelectedParametersRange] = useState([0, 10000]);

  // Booléens
  const [asTeacher, setAsTeacher] = useState(false);
  const [asStudent, setAsStudent] = useState(false);
  const [hasOptimization, setHasOptimization] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal de détail
  const [selectedModel, setSelectedModel] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // → Redirection si pas connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // → Chargement des données utilisateur
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser({});
      }
    }
  }, []);

  // → Fetch des données filtrées (avec pagination)
  const fetchFilteredData = useCallback(async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();

    if (selectedTask) queryParams.append('task', selectedTask);
    if (selectedType) queryParams.append('architecture', selectedType);
    if (selectedCreator) queryParams.append('creator', selectedCreator);
    if (selectedID) queryParams.append('id', selectedID);

    // N’ajoute les params avancés que si différents des valeurs par défaut
    if (selectedEmissionRange[0] > 0 || selectedEmissionRange[1] < 1) {
      queryParams.append('emissions_min', selectedEmissionRange[0]);
      queryParams.append('emissions_max', selectedEmissionRange[1]);
    }
    if (selectedEnergyConsumptionRange[0] > 0 || selectedEnergyConsumptionRange[1] < 500) {
      queryParams.append('energy_min', selectedEnergyConsumptionRange[0]);
      queryParams.append('energy_max', selectedEnergyConsumptionRange[1]);
    }
    if (selectedTrainingTimeRange[0] > 0 || selectedTrainingTimeRange[1] < 1000000) {
      queryParams.append('max_training_time', selectedTrainingTimeRange[1]);
    }

    // Pagination
    queryParams.append('page', currentPage);
    queryParams.append('page_size', pageSize);

    if (asTeacher) queryParams.append('as_teacher', 'true');
    if (asStudent) queryParams.append('as_student', 'true');
    if (hasOptimization) queryParams.append('has_optimization', 'true');

    const url = `http://127.0.0.1:8000/models/get_filtered_simplify_data_models/?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        }
      });
      if (!response.ok) throw new Error('Erreur lors du chargement des données filtrées');
      const result = await response.json();
      setData(result.models.results || []);
      setTotalPages(Math.ceil(result.models.count / pageSize));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    selectedTask, selectedType, selectedCreator, selectedID,
    selectedEmissionRange, selectedEnergyConsumptionRange, selectedTrainingTimeRange,
    asTeacher, asStudent, hasOptimization, currentPage, pageSize
  ]);

  useEffect(() => {
    fetchFilteredData();
  }, [fetchFilteredData]);

  // → Options dynamiques pour les filtres dropdown
  const allTasks = Array.from(new Set(data.flatMap(m => m.tasks?.map(t => t.name) || [])));
  const allArchitectures = Array.from(new Set(data.map(m => m.architecture)));
  const allIDs = Array.from(new Set(data.map(m => m.id)));

  // → Filtrage par recherche simple sur le nom
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // → Colonnes du tableau
  const tableHeaders = [
    { key: 'id', label: 'ID du Modèle' },
    { key: 'name', label: 'Nom du Modèle' },
    { key: 'architecture', label: 'Architecture' },
    { key: 'creator', label: 'Créateur' },
    { key: 'model_size_label', label: 'Taille' },
    { key: 'precision', label: 'Format' },
    { key: 'layers', label: 'Couches' },
    { key: 'parameters_m', label: 'Paramètres (M)' },
    { key: 'flops_b', label: 'FLOPs (B)' },
    { key: 'model_size', label: 'Taille (Mo)' },
    { key: 'training_time', label: 'Temps entraînement (s)' },
    { key: 'creation_date', label: 'Date création' },
    { key: 'fps_gpu', label: 'FPS GPU' },
    { key: 'fps_cpu', label: 'FPS CPU' },
    { key: 'std_gpu', label: 'STD GPU' },
    { key: 'std_cpu', label: 'STD CPU' },
    { key: 'num_macs', label: 'NUM MACS' },
    { key: 'average_emissions_per_inference', label: 'Émissions moyennes / inférence (gCO₂eq)' },
    { key: 'average_energy_per_inference', label: 'Énergie moyenne / inférence (mWh)' },
    { key: 'total_emissions_gco2eq', label: 'CO₂ (g)' },
    { key: 'total_energy_mwh', label: 'Énergie (mWh)' },
    { key: 'map_50', label: 'mAP@50' },
    { key: 'map_50_95', label: 'mAP@50:95' },
  ];

  // → Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // → Composant pour un filtre dropdown
  const renderFilterGroup = (label, options, selectedValue, onChange) => (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <select
        value={selectedValue}
        onChange={e => onChange(e.target.value)}
        className="picker"
      >
        <option value=''>Tous</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  // → Mise à jour d’un slider “double range”
  const handleRangeChange = (setter, index, value, currentRange) => {
    let newRange = [...currentRange];
    newRange[index] = value;
    if (index === 0 && value > currentRange[1]) newRange[1] = value;
    if (index === 1 && value < currentRange[0]) newRange[0] = value;
    setter(newRange);
  };

  return (
    <div>
      <header className="brand-header">
        <h1 className="brand-title">DeepCompare</h1>
      </header>

      <div className="dashboard-container">
        <button
          className="toggle-button"
          onClick={() => setSidebarVisible(v => !v)}
          aria-label="Toggle sidebar"
        >
          {sidebarVisible ? <FaArrowLeft /> : <FaBars />}
        </button>

        <aside className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
          <div className="sidebar-content">
            <div className="profile">
              <img
                src="https://www.photoprof.fr/images_dp/photographes/profil_vide.jpg"
                alt="Profile"
                className="profile-image"
              />
              <h3 className="username">{user.first_name} {user.last_name}</h3>
              <p className="email">{user.email}</p>
            </div>

            <button className="logout-button" onClick={handleLogout}>Déconnexion</button>

            {renderFilterGroup('Tâche', allTasks, selectedTask, setSelectedTask)}
            {renderFilterGroup('Type de Modèle', allArchitectures, selectedType, setSelectedType)}

            <div className="filter-group">
              <label className="filter-label" htmlFor="creator-filter">Créateur</label>
              <input
                id="creator-filter"
                type="text"
                placeholder="Rechercher un créateur..."
                value={selectedCreator}
                onChange={e => setSelectedCreator(e.target.value)}
                className="picker"
                style={{ padding: '6px', width: '100%' }}
              />
            </div>

            <button
              className="advanced-filter-toggle"
              onClick={() => setShowAdvancedFilters(true)}
            >
              Filtres Avancés
            </button>
          </div>
        </aside>

        <main className={`main-content ${sidebarVisible ? 'shifted' : ''}`}>
          <div className="toolbar">
            <input
              type="text"
              placeholder="Recherche..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button
              className="new-model-button"
              onClick={() => navigate('/ajout')}
            >
              Enregistrer un nouveau profil de modèle
            </button>
          </div>

          {loading && <p style={{ textAlign: 'center', margin: '1rem 0' }}>Chargement...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {tableHeaders.map(h => <th key={h.key}>{h.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={tableHeaders.length} style={{ textAlign: 'center' }}>
                      Aucun résultat
                    </td>
                  </tr>
                ) : (
                  filteredData.map(model => (
                    <tr key={model.id}>
                      {tableHeaders.map(h => {
                        if (h.key === 'name') {
                          // La cellule “Nom du modèle” devient un bouton cliquable
                          return (
                            <td key={h.key}>
                              <button
                                className="model-name-button"
                                onClick={() => {
                                  setSelectedModel(model);
                                  setShowDetail(true);
                                }}
                              >
                                {model.name}
                              </button>
                            </td>
                          );
                        }
                        return <td key={h.key}>{model[h.key] ?? '-'}</td>;
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span>Page {currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
            <span>Afficher :</span>
            <select
              onChange={e => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              value={pageSize}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>lignes</span>
          </div>

          {showDetail && selectedModel && (
            <ModelDetailModal
              model={selectedModel}
              onClose={() => setShowDetail(false)}
            />
          )}
        </main>

        {/* Modal Filtres Avancés */}
        {showAdvancedFilters && (
          <div className="modal-backdrop" onClick={() => setShowAdvancedFilters(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">Filtres Avancés</h3>

              {/* Émissions CO₂ */}
              <div className="range-filter">
                <label>Émissions CO₂ (g)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    min={0}
                    max={selectedEmissionRange[1]}
                    value={selectedEmissionRange[0]}
                    onChange={e =>
                      handleRangeChange(
                        setSelectedEmissionRange,
                        0,
                        Number(e.target.value),
                        selectedEmissionRange
                      )
                    }
                    className="range-number-input"
                  />
                  <input
                    type="number"
                    min={selectedEmissionRange[0]}
                    max={1000}
                    value={selectedEmissionRange[1]}
                    onChange={e =>
                      handleRangeChange(
                        setSelectedEmissionRange,
                        1,
                        Number(e.target.value),
                        selectedEmissionRange
                      )
                    }
                    className="range-number-input"
                  />
                </div>
              </div>

              {/* Consommation Énergie */}
              <div className="range-filter">
                <label>Consommation Énergie (mWh)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    min={0}
                    max={selectedEnergyConsumptionRange[1]}
                    value={selectedEnergyConsumptionRange[0]}
                    onChange={e =>
                      handleRangeChange(
                        setSelectedEnergyConsumptionRange,
                        0,
                        Number(e.target.value),
                        selectedEnergyConsumptionRange
                      )
                    }
                    className="range-number-input"
                  />
                  <input
                    type="number"
                    min={selectedEnergyConsumptionRange[0]}
                    max={5000}
                    value={selectedEnergyConsumptionRange[1]}
                    onChange={e =>
                      handleRangeChange(
                        setSelectedEnergyConsumptionRange,
                        1,
                        Number(e.target.value),
                        selectedEnergyConsumptionRange
                      )
                    }
                    className="range-number-input"
                  />
                </div>
              </div>

              {/* Temps Entraînement */}
              <div className="range-filter">
                <label>Temps Entraînement (s)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    min={0}
                    max={selectedTrainingTimeRange[1]}
                    value={selectedTrainingTimeRange[0]}
                    onChange={e =>
                      handleRangeChange(
                        setSelectedTrainingTimeRange,
                        0,
                        Number(e.target.value),
                        selectedTrainingTimeRange
                      )
                    }
                    className="range-number-input"
                  />
                  <input
                    type="number"
                    min={selectedTrainingTimeRange[0]}
                    max={10000000}
                    value={selectedTrainingTimeRange[1]}
                    onChange={e =>
                      handleRangeChange(
                        setSelectedTrainingTimeRange,
                        1,
                        Number(e.target.value),
                        selectedTrainingTimeRange
                      )
                    }
                    className="range-number-input"
                  />
                </div>
              </div>

              {/* Paramètres */}
              <div className="range-filter">
                <label>Paramètres (M)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    min={0}
                    max={selectedParametersRange[1]}
                    value={selectedParametersRange[0]}
                    onChange={e =>
                      handleRangeChange(
                        setSelectedParametersRange,
                        0,
                        Number(e.target.value),
                        selectedParametersRange
                      )
                    }
                    className="range-number-input"
                  />
                  <input
                    type="number"
                    min={selectedParametersRange[0]}
                    max={50000}
                    value={selectedParametersRange[1]}
                    onChange={e =>
                      handleRangeChange(
                        setSelectedParametersRange,
                        1,
                        Number(e.target.value),
                        selectedParametersRange
                      )
                    }
                    className="range-number-input"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={asTeacher}
                    onChange={() => setAsTeacher(v => !v)}
                  /> En tant que Professeur
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={asStudent}
                    onChange={() => setAsStudent(v => !v)}
                  /> En tant qu'Étudiant
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={hasOptimization}
                    onChange={() => setHasOptimization(v => !v)}
                  /> Avec Optimisation
                </label>
              </div>

              <button className="close-modal" onClick={() => setShowAdvancedFilters(false)}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
