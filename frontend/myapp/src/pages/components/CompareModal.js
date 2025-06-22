import { useEffect, useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, Tooltip, Legend
} from 'recharts';
import './CompareModal.css';

export default function CompareModal({ ids, onClose }) {
  const [params, setParams] = useState(['accuracy', 'latency_ms', 'final_loss']);
  const [data, setData]     = useState([]);
  const [loading, setLoad]  = useState(false);

  useEffect(() => {
    if (!params.length) return;
    const token = localStorage.getItem('token');
    setLoad(true);
    fetch(
      `http://127.0.0.1:8000/models/compare/?params=${params.join(',')}&ids=${ids.join(',')}`,
      { headers: { Authorization: `Token ${token}` } }
    )
      .then(r => r.json())
      .then(j => {
        const formatted = j.params.map(param => {
          const entry = { metric: param };
          j.models.forEach(model => {
            entry[model.model] = model.values[param] ?? 0;
            entry[`${model.model}_real`] = model.real[param] ?? 0;
          });
          return entry;
        });
        setData(formatted);
      })
      .finally(() => setLoad(false));
  }, [params, ids]);

  const customTooltip = ({ payload, label }) => {
    if (!payload || !payload.length) return null;
    return (
      <div style={{ background: '#fff', padding: '8px', border: '1px solid #ccc' }}>
        <strong>{label}</strong>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {payload.map((p, idx) => {
            const realVal = p.payload[`${p.name}_real`];
            return (
              <li key={idx} style={{ color: p.color }}>
                {p.name}: {realVal}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="detail-modal-backdrop" onClick={onClose}>
      <div className="compare-modal" onClick={e => e.stopPropagation()}>
        <button className="detail-close-button" onClick={onClose}>×</button>
        <h2>Comparaison (Radar)</h2>

        <select
          multiple
          value={params}
          onChange={e => {
            const selected = Array.from(e.target.selectedOptions, o => o.value).slice(0, 5);
            setParams(selected);
          }}
        >
          {[
            'accuracy','final_loss','latency_ms','execution_time_ms',
            'total_energy_consumption_mwh','total_emissions_gco2eq',
            'avg_emissions_per_inference','avg_energy_per_inference',
            'fps_gpu','fps_cpu','std_cpu','std_gpu','map_50','map_50_95',
          ].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {loading && <p>Chargement...</p>}

        {!loading && data.length > 0 && (
          <RadarChart width={560} height={420} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            {Object.keys(data[0])
              .filter(k => k !== "metric" && !k.endsWith('_real'))
              .map((key, i) => (
                <Radar
                  key={key}
                  name={key}
                  dataKey={key}
                  stroke={`hsl(${i * 36},70%,40%)`}
                  fill={`hsl(${i * 36},70%,60%)`}
                  fillOpacity={0.5}
                />
            ))}
            <Tooltip content={customTooltip} />
            <Legend />
          </RadarChart>
        )}

        {!loading && data.length === 0 && (
          <p>Sélectionnez jusqu’à 5 paramètres à comparer.</p>
        )}
      </div>
    </div>
  );
}
