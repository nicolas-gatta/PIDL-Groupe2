import React, { useEffect, useState } from 'react';
import './ModelDetailModal.css';

export default function ModelDetailModal({ model: initialModel, onClose, readOnly = true, onSave }) {
  const [data, setData]   = useState(null);
  const [loading, setLoad] = useState(true);
  const [error,   setErr]  = useState('');
  const [form, setForm]   = useState(null);           // copie pour l’édition


  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(
      `http://127.0.0.1:8000/models/get_full_data_models/?id=${initialModel.id}`,
      { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } }
    )
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(j => {
        const model = j.models?.[0] ?? null;
        setData(model);         // affichage
        console.log("DataModel",model)
        if (!readOnly) setForm({
          ...model,
          evaluations : model.evaluations  ? [...model.evaluations]  : [],
          optimizations : model.optimizations ? [...model.optimizations] : [],
          teachers : model.teachers ? [...model.teachers] : [],
          students : model.students ? [...model.students] : [],
        });
      })
      .catch(() => setErr('Erreur de chargement.'))
      .finally(() => setLoad(false));
      
  }, [initialModel, readOnly]);

  if (loading) return <Backdrop onClose={onClose}><p>Chargement…</p></Backdrop>;
  if (error)   return <Backdrop onClose={onClose}><ErrorBox msg={error} onClose={onClose} /></Backdrop>;
  if (!data)   return null;

 
  const {
    name, architecture, creator, model_size_label, precision,
    layers, parameters_m, flops_b, model_size, training_time,
    creation_date, description,
    evaluations = [], optimizations = [],
    teachers = [], students = [],
  } = data;

  /* def ressources */
  const resLabel = e => [
    e.cpu && `${e.cpu}${e.cpu_frequency ? ` ${e.cpu_frequency} GHz` : ''}`,
    e.gpu && `${e.gpu} ${e.gpu_memory} GB`,
    e.computer_ram && `${e.computer_ram} GB RAM`,
  ].filter(Boolean).join(' | ') || '—';

  /* def optimisations */
const Opt = ({ opt }) => {
  const d = opt.details || {};
  const rows = {
    Pruning: [
      ['Stratégie', d.strategy],
      ['Taux', d.rate],
      ['Portée', d.scope],
      ['Ratio de compression', d.compression_ratio],
      ['Réduction mémoire', d.memory_reduction],
    ],
    Quantization: [
      ['Type', d.type],
      ['Cible de précision', d.target_precision],
      ['Réduction de taille', d.model_size_reduction],
      ['Réduction mémoire', d.memory_reduction],
    ],
    KnowledgeDistillation: [
      ['Température Softmax', d.softmax_temperature],
      ['Fonction de perte', d.loss_function],
      d.teacher?.name && ['Enseignant', `${d.teacher.name} (${d.teacher.architecture})`],
      d.student?.name && ['Étudiant', `${d.student.name} (${d.student.architecture})`],
    ],
  }[opt.type] || [];

  // Champs communs à toutes les optimisations
  const common = [
    ['CPU', d.cpu],
    ['GPU', d.gpu],
    ['Mémoire GPU (Go)', d.gpu_memory],
    ['RAM (Go)', d.computer_ram],
    ['Fréquence CPU (GHz)', d.cpu_frenquency],
    ['Consommation max (W)', d.max_watts],
    ['Date d’optimisation', d.optimization_date],
  ];

    return (
      <div key={opt.optimization_id} className="opt-block">
      <h4>{opt.type} : {opt.name}</h4>
      <ul>
        {[...rows, ...common]
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => (
            <li key={k}><b>{k} :</b> {v}</li>
          ))}
      </ul>
    </div>
    );
  };

  /* Helpers pour générer un champ ou un simple texte */
  const Field = ({ label, name, type = 'text' }) => (
    <li>
      <b>{label} :</b>{' '}
      {readOnly ? data[name] ?? '—' : (
        <input
          type={type}
          value={form[name] ?? ''}
          onChange={e => setForm({ ...form, [name]: e.target.value })}
          style={{ width: '60%' }}
        />
      )}
    </li>
  );

  const updateEvalField = (index, key, value) => {
  const newEvals = [...form.evaluations];
  newEvals[index][key] = value;
  setForm({ ...form, evaluations: newEvals });
};

const updateOptField = (index, key, value) => {
  const newOpts = [...form.optimizations];
  newOpts[index][key] = value;
  setForm({ ...form, optimizations: newOpts });
};


const EditOpt = ({ opt, idx }) => {
  const d = opt.details || {};
  const handleDetailChange = (key, value) => {
    const updated = [...form.optimizations];
    updated[idx].details = { ...updated[idx].details, [key]: value };
    setForm({ ...form, optimizations: updated });
  };

  const fieldsByType = {
    Pruning: [
      ['Stratégie', 'strategy'],
      ['Taux', 'rate'],
      ['Portée', 'scope'],
      ['Ratio de compression', 'compression_ratio'],
      ['Réduction mémoire', 'memory_reduction'],
    ],
    Quantization: [
      ['Type', 'type'],
      ['Cible de précision', 'target_precision'],
      ['Réduction de taille', 'model_size_reduction'],
      ['Réduction mémoire', 'memory_reduction'],
    ],
    KnowledgeDistillation: [
      ['Température Softmax', 'softmax_temperature'],
      ['Fonction de perte', 'loss_function'],
      /*['Enseignant (ID)', 'teacher.id'],*/
    ],
  }[opt.type] || [];

  const commonFields = [
    ['CPU', 'cpu'],
    ['GPU', 'gpu'],
    ['Mémoire GPU (Go)', 'gpu_memory'],
    ['RAM (Go)', 'computer_ram'],
    ['Fréquence CPU (GHz)', 'cpu_frenquency'],
    ['Consommation max (W)', 'max_watts'],
    ['Date', 'optimization_date'],
  ];

  const renderInput = ([label, key]) => (
    <li key={key}>
      <b>{label} :</b>{' '}
      <input
        value={d?.[key] ?? ''}
        onChange={e => handleDetailChange(key, e.target.value)}
        style={{ width: '60%' }}
      />
    </li>
  );

  return (
    <div className="opt-block">
      <h4>{opt.type}</h4>
      <p>
        <b>Nom :</b>{' '}
        <input
          value={opt.name}
          onChange={e => {
            const updated = [...form.optimizations];
            updated[idx].name = e.target.value;
            setForm({ ...form, optimizations: updated });
          }}
          style={{ width: '60%' }}
        />
      </p>
      <ul>
        {fieldsByType.map(renderInput)}
        {commonFields.map(renderInput)}
      </ul>
    </div>
  );
};


/*const updateTeacherField = (index, key, value) => {
  const newTeachers = [...form.teachers];
  newTeachers[index][key] = value;
  setForm({ ...form, teachers: newTeachers });
};

const updateStudentField = (index, key, value) => {
  const newStudents = [...form.students];
  newStudents[index][key] = value;
  setForm({ ...form, students: newStudents });
};*/


  return (
    <Backdrop onClose={onClose}>
      <div className="detail-modal-content" onClick={e => e.stopPropagation()}>
        <button className="detail-close-button" onClick={onClose}>×</button>
        <h2>{name}</h2>

        {/* Infos */}
        <Section title="Informations">
          <ul>
            <Field label="Architecture"    name="architecture" />
            <Field label="Créateur"        name="creator" />
            <Field label="Taille label"    name="model_size_label" />
            <Field label="Précision"       name="precision" />
            <Field label="Couches"         name="layers"    type="number" />
            <Field label="Paramètres (M)"  name="parameters_m" type="number" />
            <Field label="FLOPs (B)"       name="flops_b"   type="number" />
            <Field label="Taille (Mo)"     name="model_size" type="number" />
            {readOnly
              ? <li><b>Créé le :</b> {creation_date}</li>
              : null}
            <li>
              <b>Description :</b>{' '}
              {readOnly ? (description || '—') : (
                <textarea
                  value={form.description || ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} style={{ width: '100%' }}
                />
              )}
            </li>
          </ul>
        </Section>

        {/* Évals */}
        <Section title="Évaluations">
        {(readOnly ? evaluations : form.evaluations).length ? (
          (readOnly ? evaluations : form.evaluations).map((e, idx) => (
            <div key={idx} className="eval-block" style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
              <h4>Évaluation #{idx + 1}</h4>
              <ul className="detail-section">
                {[
                  ['cpu', 'CPU'],
                  ['cpu_frenquency', 'Fréquence CPU (GHz)'],
                  ['gpu', 'GPU'],
                  ['gpu_memory', 'Mémoire GPU (Go)'],
                  ['computer_ram', 'RAM (Go)'],
                  ['accuracy', 'Accuracy'],
                  ['final_loss', 'Loss'],
                  ['latency_ms', 'Latence (ms)'],
                  ['execution_time_ms', 'Temps d’exécution (ms)'],
                  ['fps_cpu', 'FPS CPU'],
                  ['fps_gpu', 'FPS GPU'],
                  ['avg_emissions_per_inference', 'Émissions moy./inf. (gCO₂eq)'],
                  ['avg_energy_per_inference', 'Énergie moy./inf. (mWh)'],
                  ['total_emissions_gco2eq', 'Émissions totales (gCO₂eq)'],
                  ['total_energy_consumption_mwh', 'Consommation totale (mWh)'],
                  ['map_50', 'mAP@50'],
                  ['map_50_95', 'mAP@50:95'],
                  ['num_macs', 'MACs (millions)'],
                  ['std_cpu', 'STD CPU'],
                  ['std_gpu', 'STD GPU'],
                  ['max_watts', 'Puissance max (W)'],
                  ['date', 'Date'],
                ]
                  .filter(([key]) => e[key] !== undefined)
                  .map(([key, label]) => (
                    <li key={key}>
                      <b>{label} :</b>{' '}
                      {readOnly ? (
                        e[key]
                      ) : (
                        <input
                          value={e[key]}
                          onChange={ev => updateEvalField(idx, key, ev.target.value)}
                          style={{ width: '60%' }}
                        />
                      )}
                    </li>
                  ))
                }
              </ul>
            </div>
          ))
        ) : (
          <p>— Aucune évaluation —</p>
        )}
      </Section>
        {/* Optimisations */}
        {(readOnly ? optimizations.length > 0 : form.optimizations.length > 0) && (
        <Section title="Optimisations">
          {readOnly ? (
            optimizations.length
              ? optimizations.map(opt => <Opt key={opt.optimization_id} opt={opt} />)
              : <p>— Aucune optimisation —</p>
          ) : (
            /* --- mode édition : on parcourt form.optimizations --- */
            form.optimizations.length ? (
              form.optimizations.map((opt, idx) => (
                  <EditOpt opt={opt} idx={idx} />
              ))
            ) : (
              <p>— Aucune optimisation —</p>
            )
          )}
        </Section>
        )}


        {/* Teacher / Student */}
        {!!(teachers.length || students.length) && (
          <Section title="Hiérarchie de distillation">
            {teachers.length > 0 && (
              <>
                <h4>Enseignants</h4>
                <ul>
                  {teachers.map(t => (
                    <li key={t.id}>{t.name} ({t.architecture})</li>
                  ))}
                </ul>
              </>
            )}
            {students.length > 0 && (
              <>
                <h4>Étudiants</h4>
                <ul>{students.map(s => <li key={s.id}>{s.name} ({s.architecture})</li>)}</ul>
              </>
            )}
          </Section>
        )}
        {/* Boutons bas de modale */}
          {!readOnly && (
          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <button
              className="detail-save-button"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  const res = await fetch(
                    `http://127.0.0.1:8000/models/update_model/?id=${initialModel.id}`,
                    {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                      },
                      body: JSON.stringify(form),
                    },
                  );
                  if (res.status === 200) {
                    alert('Modèle mis à jour avec succès.');
                    onSave?.();     // rafraîchir la liste dans Dashboard
                    onClose();      // fermer la modale
                  } else if (res.status === 406) {
                    alert('Vous n\'êtes pas le propriétaire de ce modèle.');
                  } else if (res.status === 404) {
                    alert('Modèle introuvable.');
                  } else if (res.status === 400) {
                    alert('Paramètres manquants ou incorrects.');
                  } else if (res.status === 403) {
                    alert('Connexion requise.');
                  } else {
                    alert('Erreur lors de la mise à jour.');
                  }
                } catch (e) {
                  alert('Erreur réseau : ' + e.message);
                }
              }}
            >
              Valider
            </button>
          </div>
        )}
      </div>
    </Backdrop>
  );
}

const Backdrop = ({ onClose, children }) => (
  <div className="detail-modal-backdrop" onClick={onClose}>{children}</div>
);
const Section = ({ title, children }) => (
  <div className="detail-section"><h3>{title}</h3>{children}</div>
);
const ErrorBox = ({ msg, onClose }) => (
  <>
    <button className="detail-close-button" onClick={onClose}>×</button>
    <p style={{ color: 'red' }}>{msg}</p>
  </>
);