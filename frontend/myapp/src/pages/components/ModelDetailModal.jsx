import React, { useEffect, useState } from 'react';
import './ModelDetailModal.css';

export default function ModelDetailModal({ model: initialModel, onClose }) {
  const [data, setData]   = useState(null);
  const [loading, setLoad] = useState(true);
  const [error,   setErr]  = useState('');


  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(
      `http://127.0.0.1:8000/models/get_full_data_models/?id=${initialModel.id}`,
      { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } }
    )
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(j => setData(j.models?.[0] ?? null))
      .catch(() => setErr('Erreur de chargement.'))
      .finally(() => setLoad(false));
  }, [initialModel]);

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
        ['Taux',       d.rate],
      ],
      Quantization: [
        ['Type',  d.type],
        ['Cible', d.target_precision],
      ],
      KnowledgeDistillation: [
        ['Température', d.softmax_temperature],
        ['Loss',        d.loss_function],
        d.teacher_id && ['Teacher ID', d.teacher_id],
        d.student_id && ['Student ID', d.student_id],
      ].filter(Boolean),
    }[opt.type] || [];

    return (
      <div key={opt.optimization_id} className="opt-block">
        <h4>{opt.type} : {opt.name}</h4>
        <ul>{rows.map(([k, v]) => <li key={k}><b>{k} :</b> {v}</li>)}</ul>
      </div>
    );
  };

  return (
    <Backdrop onClose={onClose}>
      <div className="detail-modal-content" onClick={e => e.stopPropagation()}>
        <button className="detail-close-button" onClick={onClose}>×</button>
        <h2>{name}</h2>

        {/* Infos */}
        <Section title="Informations">
          <ul>
            <li><b>Architecture :</b> {architecture}</li>
            <li><b>Créateur :</b> {creator ?? '—'}</li>
            <li><b>Taille label :</b> {model_size_label}</li>
            <li><b>Précision :</b> {precision}</li>
            <li><b>Couches :</b> {layers}</li>
            <li><b>Paramètres (M) :</b> {parameters_m}</li>
            <li><b>FLOPs (B) :</b> {flops_b}</li>
            <li><b>Taille (Mo) :</b> {model_size}</li>
            <li><b>Train (s) :</b> {training_time}</li>
            <li><b>Créé le :</b> {new Date(creation_date).toLocaleString()}</li>
            {description && <li><b>Description :</b> {description}</li>}
          </ul>
        </Section>

        {/* Évals */}
        <Section title="Évaluations">
          {evaluations.length ? (
            <table className="eval-table">
              <thead>
                <tr>
                  <th>CPU</th><th>GPU</th><th>RAM</th>
                  <th>Accuracy</th><th>Latency (ms)</th><th>Loss</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map(e => (
                  <tr key={e.id}>
                    <td>{e.cpu ? `${e.cpu}${e.cpu_frequency ? ` ${e.cpu_frequency} GHz` : ''}` : '—'}</td>
                    <td>{e.gpu ? `${e.gpu} ${e.gpu_memory} GB` : '—'}</td>
                    <td>{e.computer_ram ? `${e.computer_ram} GB` : '—'}</td>
                    <td>{e.accuracy}</td>
                    <td>{e.latency_ms}</td>
                    <td>{e.final_loss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>— Aucune évaluation —</p>}
        </Section>

        {/* Optimisations */}
        <Section title="Optimisations">
          {optimizations.length ? optimizations.map(opt => <Opt key={opt.optimization_id} opt={opt} />)
                               : <p>— Aucune optimisation —</p>}
        </Section>

        {/* Teacher / Student */}
        {!!(teachers.length || students.length) && (
          <Section title="Hiérarchie de distillation">
            {teachers.length > 0 && (
              <>
                <h4>Enseignants</h4>
                <ul>{teachers.map(t => <li key={t.id}>{t.name} ({t.architecture})</li>)}</ul>
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
