-- ------------------------Insertion ----------------------------------------------------------

-- Roles
INSERT INTO Role VALUES (1, 'Admin', 'System administrator');
INSERT INTO Role VALUES (2, 'Student', 'User with limited rights');
INSERT INTO Role VALUES (3, 'Researcher', 'User involved in model optimization');

-- Resources
INSERT INTO Resource VALUES (1, 'GPU Workstation A', 'Intel Xeon', 16, 64, 3.60, 450, 'High-performance training workstation');
INSERT INTO Resource VALUES (2, 'Edge Device X', 'ARM Cortex', 4, 8, 1.80, 45, 'Low-power evaluation device');
INSERT INTO Resource VALUES (3, 'Cloud Server Z', 'AMD EPYC', 32, 256, 2.90, 700, 'Cloud-based optimization server');

-- Tasks
INSERT INTO Task VALUES (1, 'Image Classification', 'Assign labels to images');
INSERT INTO Task VALUES (2, 'Object Detection', 'Detect and localize objects');
INSERT INTO Task VALUES (3, 'Text Generation', 'Generate human-like text');

-- Users
INSERT INTO _User VALUES (1, 'Alice', 'Dupont', 'alice@example.com', 'pwd123', 3);
INSERT INTO _User VALUES (2, 'Bob', 'Ngoma', 'bob@example.com', 'pwd456', 2);

-- Models (8 models based on 3 sizes and 4 precisions)
INSERT INTO Model VALUES 
(1, 'YOLO-n-base', 'CNN', 3.01, 168, 'n', 8.10, 97.5, '2024-01-01 10:00:00', 'Tiny model base', 1),
(2, 'YOLO-n-fp32', 'CNN', 3.01, 168, 'n', 8.10, 97.5, '2024-01-02 10:00:00', 'Tiny model fp32', 1),
(3, 'YOLO-n-fp16', 'CNN', 3.01, 168, 'n', 8.10, 97.5, '2024-01-03 10:00:00', 'Tiny model fp16', 1),
(4, 'YOLO-n-int8', 'CNN', 3.01, 168, 'n', 8.10, 97.5, '2024-01-04 10:00:00', 'Tiny model int8', 1),
(5, 'YOLO-s-base', 'CNN', 11.13, 168, 's', 28.46, 240.0, '2024-01-05 10:00:00', 'Small model base', 1),
(6, 'YOLO-s-fp32', 'CNN', 11.13, 168, 's', 28.46, 240.0, '2024-01-06 10:00:00', 'Small model fp32', 1),
(7, 'YOLO-s-fp16', 'CNN', 11.13, 168, 's', 28.46, 240.0, '2024-01-07 10:00:00', 'Small model fp16', 1),
(8, 'YOLO-s-int8', 'CNN', 11.13, 168, 's', 28.46, 240.0, '2024-01-08 10:00:00', 'Small model int8', 1);

-- Evaluations
INSERT INTO Evaluation VALUES 
(1, 0.7572, 0.320, 45.67, 1340.5, 0.1500, 0.0207, 693.48, 0.7572, 0.5640, '2024-03-01 12:00:00', 2, 1),
(2, 0.7565, 0.300, 40.50, 1200.0, 0.1346, 0.0186, 866.53, 0.7565, 0.5604, '2024-03-01 13:00:00', 2, 2),
(3, 0.7565, 0.280, 38.40, 1100.0, 0.1001, 0.0138, 1339.92, 0.7565, 0.5606, '2024-03-01 14:00:00', 2, 3),
(4, 0.6511, 0.290, 35.20, 1050.0, 0.0808, 0.0112, 1638.33, 0.6511, 0.4697, '2024-03-01 15:00:00', 2, 4),
(5, 0.8185, 0.270, 55.00, 1300.0, 0.1899, 0.0262, 606.82, 0.8185, 0.6296, '2024-03-02 10:00:00', 2, 5),
(6, 0.8175, 0.250, 52.00, 1250.0, 0.2101, 0.0290, 506.25, 0.8175, 0.6235, '2024-03-02 11:00:00', 2, 6),
(7, 0.8176, 0.240, 48.00, 1200.0, 0.1209, 0.0167, 859.57, 0.8176, 0.6238, '2024-03-02 12:00:00', 2, 7),
(8, 0.7714, 0.230, 43.00, 1150.0, 0.0968, 0.0134, 1158.16, 0.7714, 0.5813, '2024-03-02 13:00:00', 2, 8);

-- Optimizations 
INSERT INTO Optimization VALUES 
(1, 'Quantization Run 1', '2024-01-10 14:30:00', 'INT8 conversion', 1),
(2, 'Pruning Test', '2024-01-12 11:00:00', 'Pruning 30% of parameters', 1),
(3, 'Distillation BERT', '2024-02-05 15:45:00', 'Knowledge distillation', 1);



-- Quantization
INSERT INTO Quantization VALUES (1, 'Post-training', 'INT8', 'Reduced precision for edge deployment', 1);

-- Pruning
INSERT INTO Pruning VALUES (1, 'Magnitude-based', 0.30, 'Pruned lowest magnitude weights', 2);

-- Knowledge Distillation
INSERT INTO knowledgeDistillation VALUES (3, 2.0, 'CrossEntropy', 'Distillation of BERT to a smaller student model', 2, 1, 3);

INSERT INTO Model_Optimization VALUES 
(1, 1), (1, 2), (2, 3);

