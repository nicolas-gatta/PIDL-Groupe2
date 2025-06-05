// src/components/ModelDetailModal.jsx
import React, { useState, useEffect } from 'react';
import './ModelDetailModal.css';

export default function ModelDetailModal({ model: initialModel, onClose }) {
  // initialModel contient uniquement l’objet “résumé” passé depuis Dashboard
  // Pour récupérer les champs d’optimisation, on fera un fetch vers l’endpoint full.
  const [fullModel, setFullModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Dès que le composant monte, on récupère le détail par son ID.
    const token = localStorage.getItem('token');
    const url = `http://127.0.0.1:8000/models/get_filtered_full_data_models/?id=${initialModel.id}`;

    setLoading(true);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Le back renvoie { "models": [ {...} ] }
        if (data.models && data.models.length > 0) {
          setFullModel(data.models[0]);
          setError('');
        } else {
          setError('Aucun détail trouvé pour ce modèle.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les détails du modèle');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialModel]);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="detail-modal-backdrop" onClick={onClose}>
        <div
          className="detail-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <p>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d’erreur
  if (error) {
    return (
      <div className="detail-modal-backdrop" onClick={onClose}>
        <div
          className="detail-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="detail-close-button" onClick={onClose}>
            ×
          </button>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  // Si fullModel est toujours null (cas improbable)
  if (!fullModel) {
    return null;
  }

  // On extrait les champs exposés par le back
  const {
    name,
    architecture,
    creator,
    model_size_label,
    precision,
    layers,
    parameters_m,
    flops_b,
    model_size,
    training_time,
    creation_date,
    description,
    tasks,
    evaluations,
    students,
    teachers,
    optimizations,
  } = fullModel;

  // On cherche, dans l’array optimizations, les objets selon leur type.
  const pruningObj = optimizations.find((opt) => opt.type === 'Pruning');
  const distillationObj = optimizations.find((opt) => opt.type === 'KnowledgeDistillation');
  const quantizationObj = optimizations.find((opt) => opt.type === 'Quantization');

  const pruningSection = pruningObj ? (
    <div className="opt-block">
      <h4>
        Pruning&nbsp;: {pruningObj.name} (ID&nbsp;: {pruningObj.optimization_id})
      </h4>
      <p>
        <strong>Date&nbsp;:</strong> {pruningObj.date} <br />
        <strong>Description&nbsp;:</strong> {pruningObj.description || '—'}
      </p>
      <ul>
        <li>
          <strong>Stratégie&nbsp;:</strong> {pruningObj.details.strategy}
        </li>
        <li>
          <strong>Portée&nbsp;:</strong> {pruningObj.details.scope}
        </li>
        <li>
          <strong>Taux de prune&nbsp;:</strong> {pruningObj.details.rate}
        </li>
        <li>
          <strong>Compression ratio&nbsp;:</strong> {pruningObj.details.compression_ratio}
        </li>
        <li>
          <strong>Réduction mémoire&nbsp;:</strong> {pruningObj.details.memory_reduction} Mo
        </li>
      </ul>
    </div>
  ) : (
    <div className="opt-block">
      <h4>Pruning&nbsp;: N/A</h4>
    </div>
  );

  const distillationSection = distillationObj ? (
    <div className="opt-block">
      <h4>
        Knowledge Distillation&nbsp;: {distillationObj.name} (ID&nbsp;: {distillationObj.optimization_id})
      </h4>
      <p>
        <strong>Date&nbsp;:</strong> {distillationObj.date} <br />
        <strong>Description&nbsp;:</strong> {distillationObj.description || '—'}
      </p>
      <ul>
        <li>
          <strong>Softmax temperature&nbsp;:</strong> {distillationObj.details.softmax_temperature}
        </li>
        <li>
          <strong>Loss function&nbsp;:</strong> {distillationObj.details.loss_function}
        </li>
        <li>
          <strong>Teacher (ID&nbsp;: {distillationObj.details.teacher_id})&nbsp;:</strong> {distillationObj.details.teacher_name}
        </li>
        <li>
          <strong>Student (ID&nbsp;: {distillationObj.details.student_id})&nbsp;:</strong> {distillationObj.details.student_name}
        </li>
      </ul>
    </div>
  ) : (
    <div className="opt-block">
      <h4>Knowledge Distillation&nbsp;: N/A</h4>
    </div>
  );

  const quantizationSection = quantizationObj ? (
    <div className="opt-block">
      <h4>
        Quantization&nbsp;: {quantizationObj.name} (ID&nbsp;: {quantizationObj.optimization_id})
      </h4>
      <p>
        <strong>Date&nbsp;:</strong> {quantizationObj.date} <br />
        <strong>Description&nbsp;:</strong> {quantizationObj.description || '—'}
      </p>
      <ul>
        <li>
          <strong>Type de quantization&nbsp;:</strong> {quantizationObj.details.type}
        </li>
        <li>
          <strong>Réduction taille modèle&nbsp;:</strong> {quantizationObj.details.model_size_reduction} Mo
        </li>
        <li>
          <strong>Réduction mémoire&nbsp;:</strong> {quantizationObj.details.memory_reduction} Mo
        </li>
        <li>
          <strong>Précision cible&nbsp;:</strong> {quantizationObj.details.target_precision}
        </li>
      </ul>
    </div>
  ) : (
    <div className="opt-block">
      <h4>Quantization&nbsp;: N/A</h4>
    </div>
  );

  return (
    <div className="detail-modal-backdrop" onClick={onClose}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="detail-title">{name}</h2>

        <div className="detail-section">
          <h3>Informations principales</h3>
          <ul>
            <li>
              <strong>Architecture&nbsp;:</strong> {architecture}
            </li>
            <li>
              <strong>Créateur&nbsp;:</strong> {creator}
            </li>
            <li>
              <strong>Taille label&nbsp;:</strong> {model_size_label}
            </li>
            <li>
              <strong>Format précision&nbsp;:</strong> {precision}
            </li>
            <li>
              <strong>Couches&nbsp;:</strong> {layers}
            </li>
            <li>
              <strong>Paramètres (M)&nbsp;:</strong> {parameters_m}
            </li>
            <li>
              <strong>FLOPs (B)&nbsp;:</strong> {flops_b}
            </li>
            <li>
              <strong>Taille en Mo&nbsp;:</strong> {model_size}
            </li>
            <li>
              <strong>Temps entraînement (h)&nbsp;:</strong> {training_time}
            </li>
            <li>
              <strong>Date création&nbsp;:</strong>{' '}
              {new Date(creation_date).toLocaleString()}
            </li>
            <li>
              <strong>Description&nbsp;:</strong> {description || '—'}
            </li>
          </ul>
        </div>

        <div className="detail-section">
          <h3>Tâches associées</h3>
          {tasks && tasks.length > 0 ? (
            <ul>
              {tasks.map((t) => (
                <li key={t.id}>
                  {t.name}
                  {t.description ? ` — ${t.description}` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>— Aucune tâche enregistrée —</p>
          )}
        </div>

        <div className="detail-section">
          <h3>Évaluations</h3>
          {evaluations && evaluations.length > 0 ? (
            <ul>
              {evaluations.map((e) => (
                <li key={e.id}>
                  <strong>Ressource&nbsp;:</strong> {e.name} <br />
                  <strong>Accuracy&nbsp;:</strong> {e.accuracy} <br />
                  <strong>Latence (ms)&nbsp;:</strong> {e.latency_ms} <br />
                  <strong>Final loss&nbsp;:</strong> {e.final_loss}
                </li>
              ))}
            </ul>
          ) : (
            <p>— Aucune évaluation —</p>
          )}
        </div>

        <div className="detail-section">
          <h3>Connaissances Teacher / Student</h3>
          <div className="subsection">
            <h4>Enseignants</h4>
            {teachers && teachers.length > 0 ? (
              <ul>
                {teachers.map((teach) => (
                  <li key={teach.id}>
                    {teach.name} ({teach.architecture})
                  </li>
                ))}
              </ul>
            ) : (
              <p>— Aucun “teacher” —</p>
            )}
          </div>
          <div className="subsection">
            <h4>Étudiants</h4>
            {students && students.length > 0 ? (
              <ul>
                {students.map((stud) => (
                  <li key={stud.id}>
                    {stud.name} ({stud.architecture})
                  </li>
                ))}
              </ul>
            ) : (
              <p>— Aucun “student” —</p>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h3>Méthodes d’optimisation</h3>
          {optimizations && optimizations.length > 0 ? (
            <>
              {pruningSection}
              {distillationSection}
              {quantizationSection}
            </>
          ) : (
            <p>— Aucune optimisation appliquée —</p>
          )}
        </div>
      </div>
    </div>
  );
}
