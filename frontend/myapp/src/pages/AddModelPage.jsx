import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddModelPage.css';

export default function AddModelPage() {
    const exampleJson = {
          "model_name": "Vision Transformer 1",
          "architecture": "Transformer",
          "parameter_count": 300000000,
          "layer_count": 24,
          "model_size_label": "l",
          "flops_billion": 55.4,
          "model_size": 1200,
          "model_description": "A transformer model optimized for large-scale image classification and object detection.",
          "precision_name": "fp32",
          "tasks": ["Object Detection", "Image Classification"],
          "evaluations": {
            "resources_name": ["NVIDIA A100", "NVIDIA V100"],
            "resources_cpu": ["Intel Xeon 2.4GHz", "AMD EPYC 3.0GHz"],
            "resources_cpu_frequency": [2.4, 3.0],
            "resources_gpu": ["A100", "V100"],
            "resources_gpu_memory": [40, 32],
            "resources_computer_memory": [128, 64],
            "resources_max_watt": [300, 250],
            "resources_description": [
              "High-performance GPU for AI workloads",
              "Optimized for deep learning applications"
            ],
            "accuracies": [0.89, 0.87],
            "final_losses": [0.12, 0.15],
            "latencies_ms": [30, 35],
            "executions_time_ms": [2000, 2500],
            "total_energy_consumption_mwh": [150, 170],
            "total_emissions_gco2eq": [20, 25],
            "avg_emissions_per_inference": [0.1, 0.2],
            "avg_energy_per_inference": [0.015,0.025],
            "fps_gpus": [60, 50],
            "fps_cpus": [30, 40],
            "std_gpus": [5, 10],
            "std_cpus": [2, 4],
            "num_macs": [218292101.44, 258546980.20],
            "map_50s": [0.75, 0.70],
            "map_50_95s": [0.65, 0.60],
            "dates": ["2024-05-10", "2024-05-15"]
          }
    };

    // Initialise jsonInput avec la chaîne JSON formatée de exampleJson
    const [jsonInput, setJsonInput] = useState(JSON.stringify(exampleJson, null, 2));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

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

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        const token = localStorage.getItem('token');

        let parsedJson;
        try {
            parsedJson = JSON.parse(jsonInput);
            console.log("JSON envoyé :", parsedJson);
        } catch {
            setError('JSON invalide, merci de vérifier la syntaxe.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/models/create_model/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(parsedJson)
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(data.message || 'Modèle ajouté avec succès !');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Erreur lors de l’ajout du modèle.');
            }
        } catch (err) {
            console.error(err);
            setError("Erreur réseau. Vérifiez que le serveur est actif.");
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
                    className={`json-textarea ${jsonInput === JSON.stringify(exampleJson, null, 2) ? 'example' : 'not-example'
                        }`}
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


/*
############## ajout model pruning:
{
  "model_name": "mobilenet_v4",
  "architecture": "RNN",
  "parameter_count": 3.5,
  "layer_count": 88,
  "model_size_label": "S",
  "flops_billion": 0.3,
  "model_size": 112.15,
  "model_description": "MobileNetV3 for classification",
  "precision_name": "FP32",
  "tasks": ["Image Classification"],

  "evaluations": {
    "resources_name": ["NVIDIA Jetson Nano"],
    "resources_cpu": ["ARM Cortex-A57"],
    "resources_cpu_frequency": [1.43],
    "resources_gpu": ["Maxwell 128-core"],
    "resources_gpu_memory": [4],
    "resources_computer_memory": [4],
    "resources_max_watt": [10],
    "resources_description": ["Low power embedded device"],

    "accuracies": [0.8921],
    "final_losses": [0.258],
    "latencies_ms": [12.5],
    "executions_time_ms": [300.0],
    "energies_consumption_mwh": [0.0154],
    "emissions_gco2eqs": [0.00083],
    "avg_emissions_per_inference": [0.0000012],
    "avg_energy_per_inference": [0.0000018],
    "fps_gpus": [941.82],
    "fps_cpus": [118.12],
    "std_cpus": [0.15],
    "std_gpus": [0.07],
    "num_macs": [307.4],
    "map_50s": [0.0],
    "map_50_95s": [0.0],
    "dates": ["2025-05-25T10:00:00Z"]
  },

  "optimizations": {
    "resources_name": ["NVIDIA Jetson Nano"],
    "resources_cpu": ["ARM Cortex-A57"],
    "resources_cpu_frequency": [1.43],
    "resources_gpu": ["Maxwell 128-core"],
    "resources_gpu_memory": [4],
    "resources_computer_memory": [4],
    "resources_max_watt": [10],
    "resources_description": ["Low power embedded device"],

    "names": ["MobileNet Pruning v1"],
    "dates": ["2025-05-25T11:00:00Z"],
    "descriptions": ["Magnitude pruning for mobilenet"],
    "types": ["Pruning"],

    "prunings_strategy": ["magnitude"],
    "prunings_scope": ["global"],
    "prunings_compression_ratio": [0.26],
    "prunings_memory_reduction": [0.2],
    "prunings_rate": [2.5],
    "prunings_description": ["25% pruning globally"]
  }
}

## ajout model quantification:
{
  "model_name": "efficientnet_q8",
  "architecture": "CNN",
  "parameter_count": 5.1,
  "layer_count": 122,
  "model_size_label": "M",
  "flops_billion": 0.45,
  "model_size": 89.7,
  "model_description": "EfficientNet quantized model",
  "precision_name": "INT8",
  "tasks": ["Image Classification"],

  "evaluations": {
    "resources_name": ["Jetson Xavier NX"],
    "resources_cpu": ["ARM Carmel"],
    "resources_cpu_frequency": [1.4],
    "resources_gpu": ["Volta 384-core"],
    "resources_gpu_memory": [8],
    "resources_computer_memory": [8],
    "resources_max_watt": [15],
    "resources_description": ["Embedded AI device"],

    "accuracies": [0.875],
    "final_losses": [0.194],
    "latencies_ms": [9.8],
    "executions_time_ms": [210.3],
    "energies_consumption_mwh": [0.0132],
    "emissions_gco2eqs": [0.00074],
    "avg_emissions_per_inference": [0.0000011],
    "avg_energy_per_inference": [0.0000015],
    "fps_gpus": [1020.5],
    "fps_cpus": [120.2],
    "std_cpus": [0.1],
    "std_gpus": [0.08],
    "num_macs": [310.7],
    "map_50s": [0.0],
    "map_50_95s": [0.0],
    "dates": ["2025-05-25T12:00:00Z"]
  },

  "optimizations": {
    "resources_name": ["Jetson Xavier NX"],
    "resources_cpu": ["ARM Carmel"],
    "resources_cpu_frequency": [1.4],
    "resources_gpu": ["Volta 384-core"],
    "resources_gpu_memory": [8],
    "resources_computer_memory": [8],
    "resources_max_watt": [15],
    "resources_description": ["Embedded AI device"],

    "names": ["EfficientNet Quantization v1"],
    "dates": ["2025-05-25T13:00:00Z"],
    "descriptions": ["INT8 post-training quantization"],
    "types": ["Quantization"],

    "quantizations_type": ["Post-training"],
    "quantizations_description": ["INT8 quantization for efficientnet"],
    "quantizations_precision_name": ["INT8"],
    "quantizations_model_size_reduction": [0.4],
    "quantizations_memory_reduction": [0.35]
  }
}

    

############## ajout model distillation:

{
  "model_name": "distilled_resnet_student_8",
  "architecture": "ResNet",
  "parameter_count": 4.2,
  "layer_count": 90,
  "model_size_label": "M",
  "flops_billion": 0.38,
  "model_size": 98.2,
  "model_description": "Student model via knowledge distillation",
  "precision_name": "FP16",
  "tasks": ["Object Detection"],

  "evaluations": {
    "resources_name": ["Google TPU Edge"],
    "resources_cpu": ["Custom Edge CPU"],
    "resources_cpu_frequency": [1.6],
    "resources_gpu": ["Edge TPU"],
    "resources_gpu_memory": [2],
    "resources_computer_memory": [4],
    "resources_max_watt": [5],
    "resources_description": ["TPU edge device"],

    "accuracies": [0.861],
    "final_losses": [0.211],
    "latencies_ms": [7.3],
    "executions_time_ms": [189.1],
    "energies_consumption_mwh": [0.0101],
    "emissions_gco2eqs": [0.00061],
    "avg_emissions_per_inference": [0.0000008],
    "avg_energy_per_inference": [0.0000012],
    "fps_gpus": [1130.3],
    "fps_cpus": [130.4],
    "std_cpus": [0.12],
    "std_gpus": [0.06],
    "num_macs": [280.2],
    "map_50s": [0.0],
    "map_50_95s": [0.0],
    "dates": ["2025-05-25T14:00:00Z"]
  },

  "optimizations": {
    "resources_name": ["Google TPU Edge"],
    "resources_cpu": ["Custom Edge CPU"],
    "resources_cpu_frequency": [1.6],
    "resources_gpu": ["Edge TPU"],
    "resources_gpu_memory": [2],
    "resources_computer_memory": [4],
    "resources_max_watt": [5],
    "resources_description": ["TPU edge device"],

    "names": ["Knowledge Distillation v1"],
    "dates": ["2025-05-25T15:00:00Z"],
    "descriptions": ["Distillation from ResNet teacher"],
    "types": ["Knowledge Distillation"],

    "knowledges_softmax": [2.0],
    "knowledges_loss_function": ["KL-Divergence"],
    "knowledges_descritpion": ["Student learns from ResNet teacher"],
    "knowledges_teacher": [1]
  }
}

*/