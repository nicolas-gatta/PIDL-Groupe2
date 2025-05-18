-- =====================================================
-- Insert Data: resource
-- =====================================================
INSERT INTO `pidl`.`resource` (`resource_id`, `resource_name`, `cpu_type`, `memory_gpu` , `memory_gb` , `cpu_frequency_ghz` , `max_power_watts`, `resource_description`) 
VALUES 
(1, 'GPU Workstation A', 'Intel Xeon', 16, 64, 3.60, 450, 'High-performance training workstation'),
(2, 'Edge Device X', 'ARM Cortex', 4, 8, 1.80, 45, 'Low-power evaluation device'),
(3, 'Cloud Server Z', 'AMD EPYC', 32, 256, 2.90, 700, 'Cloud-based optimization server');

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
INSERT INTO `pidl`.`task` (`task_id`, `task_name` ,`task_description`) 
VALUES 
(1, 'Image Classification', 'Assign labels to images'),
(2, 'Object Detection', 'Detect and localize objects'),
(3, 'Text Generation', 'Generate human-like text');

-- =====================================================
-- Insert Data: optimization
-- =====================================================
INSERT INTO `pidl`.`optimization` (`optimization_id`, `optimization_name`, `optimization_date`, `optimization_description`, `resource_fk`)
VALUES 
(1, 'Quantization Run 1', '2024-01-10 14:30:00', 'INT8 conversion', 1),
(2, 'Pruning Test', '2024-01-12 11:00:00', 'Pruning 30% of parameters', 1),
(3, 'Distillation BERT', '2024-02-05 15:45:00', 'Knowledge distillation', 1);

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
(6, 'YOLO-s-fp32', 'CNN', 11.13, 168, 's', 28.46, 240.0, 25000, '2024-01-06 10:00:00', 'Small model fp32', 1, 3),
(7, 'YOLO-s-fp16', 'CNN', 11.13, 168, 's', 28.46, 240.0, 250000, '2024-01-07 10:00:00', 'Small model fp16', 1, 4),
(8, 'YOLO-s-int8', 'CNN', 11.13, 168, 's', 28.46, 240.0, 8000, '2024-01-08 10:00:00', 'Small model int8', 1, 5);

-- =====================================================
-- Insert Data: evaluation
-- =====================================================
INSERT INTO `pidl`.`evaluation` (`evaluation_id`, `accuracy`, `final_loss`, `latency_ms`, `execution_time_ms`, `energy_consumption_mwh`, `emissions_gco2eq`, `fps_gpu`, `map_50`, `map_50_95`, `evaluation_date`, `resource_fk`, `model_fk`) 
VALUES 
(1, 0.7572, 0.320, 45.67, 1340.5, 0.1500, 0.0207, 693.48, 0.7572, 0.5640, '2024-03-01 12:00:00', 2, 1),
(2, 0.7565, 0.300, 40.50, 1200.0, 0.1346, 0.0186, 866.53, 0.7565, 0.5604, '2024-03-01 13:00:00', 2, 2),
(3, 0.7565, 0.280, 38.40, 1100.0, 0.1001, 0.0138, 1339.92, 0.7565, 0.5606, '2024-03-01 14:00:00', 2, 3),
(4, 0.6511, 0.290, 35.20, 1050.0, 0.0808, 0.0112, 1638.33, 0.6511, 0.4697, '2024-03-01 15:00:00', 2, 4),
(5, 0.8185, 0.270, 55.00, 1300.0, 0.1899, 0.0262, 606.82, 0.8185, 0.6296, '2024-03-02 10:00:00', 2, 5),
(6, 0.8175, 0.250, 52.00, 1250.0, 0.2101, 0.0290, 506.25, 0.8175, 0.6235, '2024-03-02 11:00:00', 2, 6),
(7, 0.8176, 0.240, 48.00, 1200.0, 0.1209, 0.0167, 859.57, 0.8176, 0.6238, '2024-03-02 12:00:00', 2, 7),
(8, 0.7714, 0.230, 43.00, 1150.0, 0.0968, 0.0134, 1158.16, 0.7714, 0.5813, '2024-03-02 13:00:00', 2, 8),
(9, 0.7572, 0.320, 45.67, 1340.5, 0.1500, 0.0207, 693.48, 0.7572, 0.5640, '2024-03-01 12:00:00', 2, 1),
(10, 0.7565, 0.300, 40.50, 1200.0, 0.1346, 0.0186, 866.53, 0.7565, 0.5604, '2024-05-01 13:00:00', 3, 2),
(11, 0.7565, 0.280, 38.40, 1100.0, 0.1001, 0.0138, 1339.92, 0.7565, 0.5606, '2024-05-01 14:00:00', 3, 3),
(12, 0.6511, 0.290, 35.20, 1050.0, 0.0808, 0.0112, 1638.33, 0.6511, 0.4697, '2024-05-01 15:00:00', 3, 4),
(13, 0.8185, 0.270, 55.00, 1300.0, 0.1899, 0.0262, 606.82, 0.8185, 0.6296, '2024-05-02 10:00:00', 3, 5),
(14, 0.8175, 0.250, 52.00, 1250.0, 0.2101, 0.0290, 506.25, 0.8175, 0.6235, '2024-05-02 11:00:00', 3, 6),
(15, 0.8176, 0.240, 48.00, 1200.0, 0.1209, 0.0167, 859.57, 0.8176, 0.6238, '2024-05-02 12:00:00', 3, 7),
(16, 0.7714, 0.230, 43.00, 1150.0, 0.0968, 0.0134, 1158.16, 0.7714, 0.5813, '2024-05-02 13:00:00', 3, 8);

-- =====================================================
-- Insert Data: quantization
-- =====================================================
INSERT INTO `pidl`.`quantization` ( `quantization_id`, `quantization_type`, `quantization_description`, `optimization_fk`, `precision_fk`) 
VALUES
(1, 'Post-training', 'Reduced precision for edge deployment', 1, 5);

-- =====================================================
-- Insert Data: pruning
-- =====================================================
INSERT INTO `pidl`.`pruning` ( `pruning_id`,`pruning_strategy`, `pruning_rate`, `pruning_description`, `optimization_fk`)
VALUES
(1, 'Magnitude-based', 0.30, 'Pruned lowest magnitude weights', 2);

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
(1, 1, 1), (2, 1, 2), (3, 2, 3);

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
(8, 8, 3);
