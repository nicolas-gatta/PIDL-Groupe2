import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import chroma from 'chroma-js';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaArrowLeft, FaEye, FaTrash} from 'react-icons/fa';
import ModelDetailModal from './components/ModelDetailModal';
import CompareModal from './components/CompareModal';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [allArchitectures, setallArchitectures] = useState([]);
  const [sortConfig, setSortConfig] = useState([]);
  const [optTypes, setOptTypes] = useState([]);


  // Filtres simples
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedOptimizationTypes, setSelectedOptimizationTypes] = useState([]);
  
  const [selectedCreator, setSelectedCreator] = useState('');
  const [selectedID, setSelectedID] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filtres avancés
  const [selectedEmissionRange, setSelectedEmissionRange] = useState([0, 1]);
  const [selectedEnergyConsumptionRange, setSelectedEnergyConsumptionRange] = useState([0, 500]);
  const [selectedTrainingTimeRange, setSelectedTrainingTimeRange] = useState([0, 1000000]);
  const [selectedParametersRange, setSelectedParametersRange] = useState([0, 10000]);
  
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal de détail
  const [selectedModel, setSelectedModel] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editMode,      setEditMode]      = useState(false);

  // comparaison 
  const [compareList, setCompareList] = useState([]);  // ids cochés (max 10)
  const [showCompare, setShowCompare] = useState(false);

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
  };


  //  Redirection si pas connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  //  Chargement des données utilisateur
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

  const handleSort = (key) => {
    setSortConfig(prev => {
      const existingIndex = prev.findIndex(s => s.key === key);

      if (existingIndex === -1) {
        return [...prev, { key, direction: 'asc' }];
      }

      const existing = prev[existingIndex];
      let newDirection;

      if (existing.direction === 'asc'){
        newDirection = 'desc';
      }

      else if (existing.direction === 'desc') {
        return prev.filter(s => s.key !== key);
      }

      const newSortConfig = [...prev];
      newSortConfig[existingIndex] = { key, direction: newDirection };
      return newSortConfig;
    });
  };

  const getArrow = (key) => {
    const sortItem = sortConfig.find(s => s.key === key);
    if (!sortItem ||sortItem.key !== key) return "▲▼";
    if (sortItem.direction === 'asc') return '▲';
    if (sortItem.direction === 'desc') return '▼';
    return null;
  };

  //  Fetch des données filtrées (avec pagination)
  const fetchFilteredData = useCallback(async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();

    if (selectedTypes && selectedTypes.length > 0) {
      queryParams.append('architecture', selectedTypes.join(','));
    }

    if (selectedTasks && selectedTasks.length > 0) {
      queryParams.append('task', selectedTasks.join(','));
    }
    if (selectedOptimizationTypes && selectedOptimizationTypes.length > 0) {
      queryParams.append('optimization_type', selectedOptimizationTypes.join(','));
    }

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

    

    if (sortConfig && sortConfig.length > 0) {
      const orderingValue = sortConfig.map(({ key, direction }) => (direction === 'desc' ? `-${key}` : key)).join(',');
      queryParams.append('ordering', orderingValue);
    }

    const url = `http://127.0.0.1:8000/models/get_simplify_data_models/?${queryParams.toString()}`;

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
    selectedTasks, selectedTypes, selectedCreator, selectedID,
    selectedEmissionRange, selectedEnergyConsumptionRange, selectedTrainingTimeRange,
    selectedOptimizationTypes, currentPage, pageSize, sortConfig
  ]);

  useEffect(() => {
    fetchFilteredData();
  }, [fetchFilteredData]);

  const fetchAllTasks = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:8000/models/get_all_tasks/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch tasks');

      const result = await response.json();
      setAllTasks(result.tasks || []);  // Adjust based on actual API response shape
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);


  const fetchAllArchitectures = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:8000/models/get_all_architecture/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch architectures');

      const result = await response.json();
      setallArchitectures(result.architectures || []);  // Adjust based on actual API response shape
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchAllArchitectures();
  }, [fetchAllArchitectures]);


  const fetchAllOptimizationTypes = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/models/get_all_optimization_types/',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to fetch optimization types');

      const result = await response.json();
      // l’API renvoie  {"optimization_types": [...] }
      setOptTypes(result.optimization_types || []);
      //console.log("optimization_types",result)
    } catch (err) {
      console.error('Error fetching optimization types:', err.message);
    }
  }, []);

  // on charge une seule fois au montage
  useEffect(() => {
    fetchAllOptimizationTypes();
  }, [fetchAllOptimizationTypes]);

  //  Options dynamiques pour les filtres dropdown
  const allIDs = Array.from(new Set(data.map(m => m.id)));

  //  Filtrage par recherche simple sur le nom
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  Colonnes du tableau
  const tableHeaders = [
    { key: 'id', label: 'ID du Modèle' },
    { key: 'name', label: 'Nom du Modèle' },
    { key: 'architecture', label: 'Architecture' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'creator', label: 'Créateur' },
    { key: 'model_size_label', label: 'Taille' },
    { key: 'precision', label: 'Format' },
    { key: 'layers', label: 'Couches' },
    { key: 'parameters_m', label: 'Paramètres (M)' },
    { key: 'flops_b', label: 'FLOPs (B)' },
    { key: 'model_size', label: 'Taille (Mo)' },
    { key: 'creation_date', label: 'Date création' },
    //{ Key: 'model_description', label: 'description'}
  ];

  //  Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  //  Composant pour un filtre dropdown
  const renderFilterGroup = (label, options, colors, onChange) => {
    const formattedOptions = options.map((opt, i) => ({
      value: opt,
      label: opt,
      color: colors?.[i] || 'black'
    }));

    return (
      <div className="filter-group">
        <label className="filter-label">{label}</label>
        <Select
          isMulti
          options={formattedOptions}
          onChange={newSelected =>
            onChange(newSelected.map(opt => opt.value))
          }
          styles={colourStyles}
          classNamePrefix="react-select"
        />
      </div>
    );
  };

  //  Mise à jour d’un slider “double range”
  const handleRangeChange = (setter, index, value, currentRange) => {
    let newRange = [...currentRange];
    newRange[index] = value;
    if (index === 0 && value > currentRange[1]) newRange[1] = value;
    if (index === 1 && value < currentRange[0]) newRange[0] = value;
    setter(newRange);
  };

  // suppression de modèle
  const handleDelete = async (model_id) => {
  if (!window.confirm('Confirmez-vous la suppression ?')) return;

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/models/delete_model/${model_id}/`, 
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      }
    );
    //console.log("resdelete",res)
    let payload = {};
    try { payload = await res.json(); } catch {}

    if (res.status === 200) {
      alert('Modèle supprimé avec succès.');
      fetchFilteredData();  // rafraîchir la liste
    } else if (res.status === 403) {
      alert(payload.error || payload.message || 'Accès interdit (403).');
    }else if (res.status === 406) {
      alert('Vous n\'êtes pas le propriétaire de ce modèle.');
    } else if (res.status === 404) {
      alert('Modèle introuvable.');
    } else {
      alert('Erreur lors de la suppression.');
    }
  } catch (err) {
    alert('Erreur réseau : ' + err.message);
  }
};

// Ajoute / retire un id ; limite à 10
const toggleCompare = (id) => {
  setCompareList(list =>
    list.includes(id)
      ? list.filter(x => x !== id)
      : list.length < 10 ? [...list, id] : list
  );
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

            {renderFilterGroup('Tâche', allTasks.map(t => t.name), allTasks.map(t => t.color), setSelectedTasks)}
            {renderFilterGroup('Type de Modèle', allArchitectures, null, setSelectedTypes)}
            {renderFilterGroup('Type d’optimisation',optTypes, null, setSelectedOptimizationTypes)}

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
            <div>
              {/* ---------- bouton Comparer ---------- */}
              <button
                className="new-model-button"
                disabled={compareList.length < 2}
                onClick={() => setShowCompare(true)}
                style={{ marginRight: '0.5rem', opacity: compareList.length < 2 ? 0.5 : 1 }}
              >
                Comparer ({compareList.length})
              </button>
              <button
                className="new-model-button"
                onClick={() => navigate('/ajout')}
              >
                Enregistrer un nouveau profil de modèle
              </button>
            </div>

          </div>

          {loading && <p style={{ textAlign: 'center', margin: '1rem 0' }}>Chargement...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>✔</th>

                  {tableHeaders.map(h => (                
                    <th key={h.key} onClick={() =>{
                      if (h.key === "id" || h.key === "model_size" || h.key === "creation_date"){
                        handleSort(h.key);
                      }
                    }}
                    className={["id", "model_size", "creation_date"].includes(h.key) ? "clickable-header" : ""}>
                    {h.label} {(h.key === "id" || h.key === "model_size" || h.key === "creation_date") ? <span>{getArrow(h.key)}</span> : null}
                    </th>
                  ))}
                  <th style={{ width: '110px' }}>Actions</th>

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
                      <td style={{ textAlign:'center' }}>
                        <input
                          type="checkbox"
                          checked={compareList.includes(model.id)}
                          onChange={() => toggleCompare(model.id)}
                        />
                      </td>
                      {/*───────────── Colonne Actions ───────────── */}
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
                                  setEditMode(false);
                                }}
                              >
                                {model.name}
                              </button>
                              
                            </td>
                          );
                        }
                        if (h.key === "tasks") {
                          return (
                            <td key={h.key} style = {{width:'10%' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                                {model.tasks.map((task, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      backgroundColor: task.color,
                                      color: '#fff',
                                      padding: '0.5rem 1rem',
                                      borderRadius: '6px',
                                      fontSize: '0.7rem',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {task.name}
                                  </div>
                                ))}
                              </div>
                            </td>
                          );
                        }
                        return <td key={h.key}>{model[h.key] ?? '-'}</td>;
                      })}
                      <td className="action-cell" style={{ textAlign: 'center' }}>
                        {/* Détails */}
                        <button
                          title="Détails"
                          onClick={() => {
                            setSelectedModel(model);
                            setEditMode(false);         
                            setShowDetail(true);
                          }}
                          className="icon-btn"
                        >
                          <FaEye />
                        </button>

                        {/* Éditer / Mettre à jour */}
                        <button
                          title="Éditer"
                          onClick={() => {
                            setSelectedModel(model);
                            setEditMode(true);
                            setShowDetail(true);
                          }}
                          className="icon-btn"
                          style={{ marginLeft: '0.5rem', color: '#007bff' }}
                        >
                          ✏️
                        </button>

                        {/* Supprimer */}
                        <button
                          title="Supprimer"
                          onClick={() => handleDelete(model.id)}
                          className="icon-btn"
                          style={{ marginLeft: '0.5rem', color: '#d9534f' }}
                        >
                          <FaTrash />
                        </button>
                      </td>
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
            <button
              onClick={() => fetchFilteredData()}
            >
              Rafraîchir
            </button>
          </div>

          {showDetail && selectedModel && (
            <ModelDetailModal
              model={selectedModel}
              readOnly={!editMode}
              onClose={() => {
                setShowDetail(false);
                setSelectedModel(null);
                setEditMode(false);}}
              onSave={() => {fetchFilteredData();}}
            />
          )}
          {/* ---------- modale de comparaison ---------- */}
          {showCompare && compareList.length >= 2 && (
            <CompareModal
              ids={compareList}
              onClose={() => setShowCompare(false)}
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
