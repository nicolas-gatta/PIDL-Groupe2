-- =====================================================
-- Insert Data: resource
-- =====================================================
INSERT INTO `pidl`.`resource` (`resource_id`, `resource_name`, `cpu_type` , `memory_gb` , `gpu_type`, `memory_gpu`, `cpu_frequency_ghz` , `max_power_watts`, `resource_description`) 
VALUES 
(1, 'GPU Workstation A', 'Intel Xeon', 64, "MSI GeForce RTX 5060 Ti 16G GAMING OC", 16, 3.60, 450, 'High-performance training workstation'),
(2, 'Edge Device X', 'ARM Cortex', 8, "MSI GeForce GTX 1650 GAMING X 4GB", 4, 1.80, 45, 'Low-power evaluation device'),
(3, 'Cloud Server Z', 'AMD EPYC', 256, "GIGABYTE AORUS GeForce RTX 5090 MASTER 32G", 32, 2.90, 700, 'Cloud-based optimization server'),
(4, 'Benchmark GPU A100', 'Intel Xeon', 128, 'NVIDIA A100', 40, 3.50, 400, 'High-end server for benchmarking MobileNet and ResNet'),
(5, 'NVIDIA T4', 'Intel Xeon', 32, 'Tesla T4', 16, 2.3, 250, 'Cloud inference setup'),
(6, 'NVIDIA RTX 3080', 'Intel i9', 64, 'RTX 3080', 10, 3.6, 320, 'High-end training setup');

-- =====================================================
-- Insert Data: role
-- =====================================================
INSERT INTO `pidl`.`role` (`role_id`, `role_name`, `role_description`) 
VALUES 
(1, 'Admin', 'System administrator'),
(2, 'Student', 'User with limited rights'),
(3, 'Researcher', 'User involved in model optimization');

-- =====================================================
-- Insert Data: precision
-- =====================================================
INSERT INTO `pidl`.`precision` (`precision_id`, `precision_name` ,`precision_description`) 
VALUES 
(1, 'unknown', 'Precision is not specified or cannot be determined.'),
(2, 'base_model', 'Original model precision as released by the provider, may vary.'),
(3, 'fp32', '32-bit floating point precision'),
(4, 'fp16', '16-bit floating point precision'),
(5, 'int8', '8-bit integer precision');

-- =====================================================
-- Insert Data: task
-- =====================================================
INSERT INTO `pidl`.`task` (`task_id`, `task_name`, `task_description`, `task_color`) 
VALUES 
(1, 'Image Classification', 'Assign labels to images', '#FF5733'),
(2, 'Object Detection', 'Detect and localize objects', '#33A1FF'),
(3, 'Text Generation', 'Generate human-like text', '#9B59B6'),
(4, 'Image Segmentation', 'Divide an input into meaningful parts, such as outlining objects pixel by pixel', '#2ECC71'),
(5, 'Text Classification', 'Assign labels to text', '#F39C12');


-- =====================================================
-- Insert Data: optimization
-- =====================================================
INSERT INTO `pidl`.`optimization` (`optimization_id`, `optimization_name`, `optimization_date`, `optimization_description`, `resource_fk`)
VALUES 
(1, 'Quantization', '2024-01-10 14:30:00', 'INT8 conversion', 1),
(2, 'Pruning', '2024-01-12 11:00:00', 'Pruning 30% of parameters', 1),
(3, 'Distillation', '2024-02-05 15:45:00', 'Knowledge distillation', 1),
(4, 'Quantization', '2025-05-01 10:00:00', 'INT8 Quantization of MobileNet', 4),
(5, 'Quantization', '2025-05-01 11:00:00', 'INT8 Quantization of ResNet18', 4);

-- =====================================================
-- Insert Data: user
-- =====================================================
INSERT INTO `pidl`.`user` (`user_id`, `first_name`, `last_name`, `email`, `password`, `is_staff`, `is_superuser`, `role_fk`) 
VALUES 
(1, 'Alice', 'Dupont', 'alice@example.com', 'pbkdf2_sha256$1000000$MzYEEkMKsAWZJyIAl0yBWB$A5qh/vlkgAtcZODDcUNBnFnsdk1c4A3dtUeZjtU9y6k=', FALSE, FALSE, 3),
(2, 'Bob', 'Ngoma', 'bob@example.com', 'pbkdf2_sha256$1000000$HTFiQSs4yghxR8I6drRm23$KnnqQVuQITW2VNo83yJ9ootouU7qLEYvD4xTM9faSUg=', FALSE, FALSE, 2),
(3, 'John', 'Doe', 'john@example.com', 'pbkdf2_sha256$1000000$BvL87S5JKAXw5U7MlRZVpe$0sq/zXHD71iQLxaF7RZIe0XYqPL/eBoDcgjy0TC6mdc=', TRUE, TRUE, 1);

-- =====================================================
-- Insert Data: model
-- =====================================================
INSERT INTO `pidl`.`model` (`model_id`, `model_name`, `architecture`, `parameter_count`, `layer_count`, `model_size_label`, `flops_billion`, `model_size`, `training_time`,`creation_date`,`model_description`,`user_fk`, `precision_fk`)
VALUES 
(1, 'YOLO-n-base', 'CNN', 3.01, 168, 'n', 8.10, 97.5, 8500, '2024-01-01 10:00:00', 'Tiny model base', 1, 2),
(2, 'YOLO-n-fp32', 'CNN', 3.01, 168, 'n', 8.10, 97.5, 9999, '2024-01-02 10:00:00', 'Tiny model fp32', 1, 3),
(3, 'YOLO-n-fp16', 'CNN', 3.01, 168, 'n', 8.10, 97.5, 8000, '2024-01-03 10:00:00', 'Tiny model fp16', 1, 4),
(4, 'YOLO-n-int8', 'CNN', 3.01, 168, 'n', 8.10, 97.5, 75000, '2024-01-04 10:00:00', 'Tiny model int8', 1, 5),
(5, 'YOLO-s-base', 'CNN', 11.13, 168, 's', 28.46, 240.0, 6000, '2024-01-05 10:00:00', 'Small model base', 1, 2),
(6, 'YOLO-s-fp32', 'CNN', 11.13, 168, 's', 28.46, 240.0, 25000, '2024-01-06 10:00:00', 'Small model fp32', 3, 3),
(7, 'YOLO-s-fp16', 'CNN', 11.13, 168, 's', 28.46, 240.0, 250000, '2024-01-07 10:00:00', 'Small model fp16', 3, 4),
(8, 'YOLO-s-int8', 'CNN', 11.13, 168, 's', 28.46, 240.0, 8000, '2024-01-08 10:00:00', 'Small model int8', 2, 5),
(9, 'MobileNetV2-base', 'CNN', 3.5, 88, 's', 307.45, 112.16, 5000, '2025-04-28 09:00:00', 'Base MobileNetV2 model', 2, 3),
(10, 'ResNet18-base', 'CNN', 11.69, 100, 'm', 1816.56, 374.06, 7000, '2025-04-28 09:30:00', 'Base ResNet18 model', 3, 3),
(11, 'MobileNetV2-quant-int8', 'RNN', 0.73, 88, 's', 64.26, 23.44, 5100, '2025-04-28 10:00:00', 'Quantized MobileNetV2 INT8', 3, 5),
(12, 'ResNet18-quant-int8', 'RNN', 3.18, 100, 'm', 494.33, 101.79, 7200, '2025-04-28 10:30:00', 'Quantized ResNet18 INT8', 3, 5);


-- =====================================================
-- Insert Data: evaluation
-- =====================================================
INSERT INTO `pidl`.`evaluation` (
    `evaluation_id`, `accuracy`, `final_loss`, `latency_ms`, `execution_time_ms`,
    `energy_consumption_mwh`, `emissions_gco2eq`,
    `average_emissions_per_inference`, `average_energy_per_inference`,
    `fps_gpu`, `fps_cpu`, `std_cpu`, `std_gpu`, `num_macs`,
    `map_50`, `map_50_95`, `evaluation_date`, `resource_fk`, `model_fk`
)
VALUES
(1, 0.7572, 0.320, 45.67, 1340.5, 0.1500, 0.0207, 0.0010, 0.0020, 693.48, 120.0, 0.51, 0.41, 11, 0.7572, 0.5640, '2024-03-01 12:00:00', 2, 1),
(2, 0.7565, 0.300, 40.50, 1200.0, 0.1346, 0.0186, 0.0020, 0.0040, 866.53, 122.0, 0.52, 0.42, 12, 0.7565, 0.5604, '2024-03-01 13:00:00', 2, 2),
(3, 0.7565, 0.280, 38.40, 1100.0, 0.1001, 0.0138, 0.0030, 0.0060, 1339.92, 124.0, 0.53, 0.43, 13, 0.7565, 0.5606, '2024-03-01 14:00:00', 2, 3),
(4, 0.6511, 0.290, 35.20, 1050.0, 0.0808, 0.0112, 0.0040, 0.0080, 1638.33, 126.0, 0.54, 0.44, 14, 0.6511, 0.4697, '2024-03-01 15:00:00', 2, 4),
(5, 0.8185, 0.270, 55.00, 1300.0, 0.1899, 0.0262, 0.0050, 0.0100, 606.82, 128.0, 0.55, 0.45, 15, 0.8185, 0.6296, '2024-03-02 10:00:00', 2, 5),
(6, 0.8175, 0.250, 52.00, 1250.0, 0.2101, 0.0290, 0.0060, 0.0120, 506.25, 130.0, 0.56, 0.46, 16, 0.8175, 0.6235, '2024-03-02 11:00:00', 2, 6),
(7, 0.8176, 0.240, 48.00, 1200.0, 0.1209, 0.0167, 0.0070, 0.0140, 859.57, 132.0, 0.57, 0.47, 17, 0.8176, 0.6238, '2024-03-02 12:00:00', 2, 7),
(8, 0.7714, 0.230, 43.00, 1150.0, 0.0968, 0.0134, 0.0080, 0.0160, 1158.16, 134.0, 0.58, 0.48, 18, 0.7714, 0.5813, '2024-03-02 13:00:00', 2, 8),
(9, 0.7650, 0.295, 42.00, 1180.0, 0.1400, 0.0180, 0.0090, 0.0180, 700.00, 136.0, 0.59, 0.49, 19, 0.7650, 0.5700, '2024-03-03 12:00:00', 2, 1),
(10, 0.7680, 0.285, 41.00, 1170.0, 0.1350, 0.0175, 0.0100, 0.0200, 710.00, 138.0, 0.60, 0.50, 20, 0.7680, 0.5720, '2024-03-03 12:00:00', 2, 2),
(11, 0.7690, 0.275, 39.00, 1160.0, 0.1250, 0.0165, 0.0110, 0.0220, 720.00, 140.0, 0.61, 0.51, 21, 0.7690, 0.5730, '2024-03-03 12:00:00', 2, 3),
(12, 0.7700, 0.265, 37.00, 1140.0, 0.1150, 0.0155, 0.0120, 0.0240, 730.00, 142.0, 0.62, 0.52, 22, 0.7700, 0.5740, '2024-03-03 12:00:00', 2, 4),
(13, 0.7800, 0.255, 36.00, 1130.0, 0.1100, 0.0150, 0.0130, 0.0260, 740.00, 144.0, 0.63, 0.53, 23, 0.7800, 0.5800, '2024-03-03 12:00:00', 2, 5),
(14, 0.7820, 0.245, 34.00, 1120.0, 0.1050, 0.0140, 0.0140, 0.0280, 750.00, 146.0, 0.64, 0.54, 24, 0.7820, 0.5820, '2024-03-03 12:00:00', 2, 6),
(15, 0.7830, 0.235, 33.00, 1110.0, 0.1000, 0.0130, 0.0150, 0.0300, 760.00, 148.0, 0.65, 0.55, 25, 0.7830, 0.5830, '2024-03-03 12:00:00', 2, 7),
(16, 0.7840, 0.225, 32.00, 1100.0, 0.0950, 0.0125, 0.0160, 0.0320, 770.00, 150.0, 0.66, 0.56, 26, 0.7840, 0.5840, '2024-03-03 12:00:00', 2, 8),
(17, 0.78, 0.25, 40.1, 1100, 0.0121, 0.00000167, 5.57e-09, 4.04e-08, 941.82, 118.12, 0.1464, 0.0697, 307.45, 0.78, 0.62, '2025-05-02 09:00:00', 4, 9),
(18, 0.80, 0.23, 35.5, 1000, 0.0084, 0.00000116, 3.88e-09, 2.80e-08, 1906.37, 164.40, 0.2241, 0.0800, 1816.56, 0.80, 0.65, '2025-05-02 09:15:00', 4, 10),
(19, 0.77, 0.24, 32.0, 950, 0.0040, 0.00000056, 1.86e-09, 1.35e-08, 1704.87, 213.82, 0.1116, 0.0532, 64.26, 0.77, 0.60, '2025-05-02 09:30:00', 4, 11),
(20, 0.79, 0.22, 28.2, 900, 0.0030, 0.00000041, 1.38e-09, 9.98e-09, 3410.82, 294.15, 0.1752, 0.0625, 494.33, 0.79, 0.63, '2025-05-02 09:45:00', 4, 12);


-- =====================================================
-- Insert Data: quantization
-- =====================================================
INSERT INTO `pidl`.`quantization` (
    `quantization_id`, `quantization_type`, `quantization_description`,
    `precision_fk`, `quantization_model_size_reduction`, `quantization_memory_reduction`, `optimization_fk`
)
VALUES
(1, 'Post-training', 'INT8 conversion optimized', 5, 0.45, 0.35, 1),
(2, 'dynamic', 'INT8 Quant MobileNetV2', 5, 0.79, 0.79, 4),
(3, 'dynamic', 'INT8 Quant ResNet18', 5, 0.728, 0.728, 5);

-- =====================================================
-- Insert Data: pruning
-- =====================================================
INSERT INTO `pidl`.`pruning` (
    `pruning_id`, `pruning_strategy`, `pruning_scope`, `pruning_rate`,
    `pruning_compression_ratio`, `pruning_memory_reduction`, `pruning_description`, `optimization_fk`
)
VALUES
(1, 'Magnitude-based', 'global', 0.30, 1.5, 0.4, '30% weights pruned based on magnitude', 2);

-- =====================================================
-- Insert Data: knowledge_distillation
-- =====================================================
INSERT INTO `pidl`.`knowledge_distillation`( `knowledged_distillation_id`,`softmax_temperature`, `loss_function`, `knowledge_distillation_description`, `student`, `teacher`, `optimization_fk`) 
VALUES
(1, 2.0, 'CrossEntropy', 'Distillation of BERT to a smaller student model', 2, 1, 3);
 
-- =====================================================
-- Insert Data: model_optimization
-- =====================================================
INSERT INTO `pidl`.`model_optimization` (`model_optimization_id`, `model_fk`, `optimization_fk`) 
VALUES 
(1, 1, 1), (2, 2, 2), (3, 3, 3);

-- =====================================================
-- Insert Data: model_task
-- =====================================================
INSERT INTO `pidl`.`model_task` (`model_task_id`, `model_fk`, `task_fk`) 
VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 2),
(6, 6, 2),
(7, 7, 3),
(8, 8, 3),
(9, 9, 1),
(10, 10, 1),
(11, 11, 1),
(12, 12, 1);


