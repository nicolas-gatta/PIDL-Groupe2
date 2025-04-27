DROP DATABASE IF EXISTS `pidl`;
CREATE DATABASE `pidl`;

CREATE TABLE `pidl`.`resource`(
   `resource_id` INT PRIMARY KEY AUTO_INCREMENT,
   `resource_name` VARCHAR(50),
   `cpu_type` VARCHAR(50),
   `memory_gpu` INT,
   `memory_gb` INT,
   `cpu_frequency_ghz` DECIMAL(4,2),
   `max_power_watts` INT,
   `description` VARCHAR(100)
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`role`(
   `role_id` INT PRIMARY KEY AUTO_INCREMENT,
   `role_name` VARCHAR(50),
   `description` VARCHAR(150)
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`task`(
   `task_id` INT PRIMARY KEY AUTO_INCREMENT,
   `task_name` VARCHAR(50),
   `description` VARCHAR(100)
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`optimization`(
   `optimization_id` INT PRIMARY KEY AUTO_INCREMENT,
   `name` VARCHAR(100),
   `optimization_date` DATETIME,
   `description` VARCHAR(100),
   `resource_fk` INT NOT NULL,
   CONSTRAINT `FK_optimization_resource` FOREIGN KEY(`resource_fk`) REFERENCES `pidl`.`resource`(`resource_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`user` (
   `user_id` INT PRIMARY KEY AUTO_INCREMENT,
   `first_name` VARCHAR(50),
   `last_name` VARCHAR(50),
   `email` VARCHAR(100) NOT NULL UNIQUE,     -- Required for Django
   `password` VARCHAR(256) NOT NULL,         -- Required for Django
   `is_active` BOOLEAN DEFAULT TRUE,         -- Required for Django
   `is_staff` BOOLEAN DEFAULT FALSE,         -- Required for Django
   `is_superuser` BOOLEAN DEFAULT FALSE,     -- Required for Django
   `last_login` DATETIME DEFAULT NULL,       -- Required for Django
   `role_fk` INT NOT NULL,
   CONSTRAINT `FK_user_role` FOREIGN KEY (`role_fk`) REFERENCES `pidl`.`role` (`role_id`) ON DELETE CASCADE
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`model`(
   `model_id` INT PRIMARY KEY AUTO_INCREMENT,
   `model_name` VARCHAR(100),
   `architecture` VARCHAR(100),
   `parameter_count` DECIMAL(6,2),          -- ex: 3.01, 11.13, 25.85
   `layer_count` INT,
   `model_size_label` VARCHAR(1),           -- ex: 'n', 's', 'm'
   `flops_billion` DECIMAL(6,2),            -- FLOPS in billions
   `model_size` DECIMAL(6,2),               -- same name, kept if needed elsewhere
   `creation_date` DATETIME,
   `description` VARCHAR(100),
   `user_fk` INT NOT NULL,
   CONSTRAINT `FK_model_user` FOREIGN KEY(`user_fk`) REFERENCES `pidl`.`user`(`user_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`evaluation`(
   `evaluation_id` INT PRIMARY KEY AUTO_INCREMENT,
   `accaracy` DECIMAL(5,4),                 -- ex: 0.8185
   `final_loss` DECIMAL(4,3),
   `latency_ms` DECIMAL(6,2),
   `execution_time_ms` DECIMAL(6,2),
   `energy_consumption_mwh` DECIMAL(6,4),   -- ex: 0.1346
   `emissions_gco2eq` DECIMAL(8,5),         -- ex: 0.0262
   `fps_gpu` DECIMAL(8,2),                  -- ex: 910.80
   `map_50` DECIMAL(5,4),                   -- ex: 0.847
   `map_50_95` DECIMAL(5,4),                -- ex: 0.6655
   `evaluation_date` DATETIME,
   `resource_fk` INT NOT NULL,
   `model_fk` INT NOT NULL,
   CONSTRAINT `FK_evaluation_resource` FOREIGN KEY(`resource_fk`) REFERENCES `pidl`.`resource`(`resource_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_model_resource` FOREIGN KEY(`model_fk`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`quantization`(
   `quantization_id` INT PRIMARY KEY AUTO_INCREMENT,
   `quantization_type` VARCHAR(50),
   `target_precision` VARCHAR(10),
   `description` VARCHAR(100),
   `optimization_fk` INT NOT NULL UNIQUE,
   CONSTRAINT `FK_quantization_optimization` FOREIGN KEY(`optimization_fk`) REFERENCES `pidl`.`optimization`(`optimization_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`pruning`(
   `pruning_id` INT PRIMARY KEY AUTO_INCREMENT,
   `pruning_strategie` VARCHAR(50),
   `pruning_rate` DECIMAL(3,2),
   `description` VARCHAR(100),
   `optimization_fk` INT NOT NULL UNIQUE,
   CONSTRAINT `FK_pruning_optimization` FOREIGN KEY(`optimization_fk`) REFERENCES `pidl`.`optimization`(`optimization_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`knowledge_distillation`(
   `knowledged_distillation_id` INT PRIMARY KEY AUTO_INCREMENT,
   `softmax_temperature` DECIMAL(3,1),
   `loss_function` VARCHAR(50),
   `description` VARCHAR(100),
   `student` INT NOT NULL,
   `teacher` INT NOT NULL,
   `optimization_fk` INT NOT NULL UNIQUE,
   CONSTRAINT `FK_knowledge_teacher_model` FOREIGN KEY(`teacher`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_knowledge_student_model` FOREIGN KEY(`student`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_knowledge_optimization` FOREIGN KEY(`optimization_fk`) REFERENCES `pidl`.`optimization`(`optimization_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`model_optimization`(
   `model_optimization_id` INT PRIMARY KEY AUTO_INCREMENT,
   `model_fk` INT NOT NULL,
   `optimization_fk` INT NOT NULL,
   CONSTRAINT `FK_model_optimization_model` FOREIGN KEY(`model_fk`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_model_optimization_optimization` FOREIGN KEY(`optimization_fk`) REFERENCES `pidl`.`optimization`(`optimization_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`model_task`(
   `model_task_id` INT PRIMARY KEY AUTO_INCREMENT,
   `model_fk` INT NOT NULL,
   `task_fk` INT NOT NULL,
   CONSTRAINT `FK_model_task_model` FOREIGN KEY(`model_fk`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_model_task_task` FOREIGN KEY(`task_fk`) REFERENCES `pidl`.`task`(`task_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;


-- 1. Vue principale : Détails des performances des modèles IA

CREATE OR REPLACE VIEW `pidl`.`v_model_performance_detailed` AS
    SELECT 
        m.`model_id`,
        m.`model_name`,
        m.`layer_count`,
        m.`parameter_count`,
        m.`model_size`,
        e.`evaluation_id`,
        e.`accaracy`,
        e.`final_loss`,
        e.`latency_ms`,
        e.`execution_time_ms`,
        e.`energy_consumption_mwh`,
        e.`evaluation_date`,
        r.`resource_name`
    FROM `pidl`.`model` AS m
    JOIN `pidl`.`evaluation` AS e ON m.`model_id` = e.`model_fk`
    JOIN `pidl`.`resource` r ON e.`resource_fk` = r.`resource_id`;


-- 2. Vue : Distillation Professeur → Élève

CREATE OR REPLACE VIEW `pidl`.`v_distillation_pairs` AS
    SELECT 
        kd.`knowledged_distillation_id`,
        m_teacher.`model_name` AS teacher_model,
        m_student.`model_name` AS student_model,
        kd.`softmax_temperature`,
        kd.`loss_function`
    FROM `pidl`.`knowledge_distillation` AS kd
    JOIN `pidl`.`model` AS m_teacher ON kd.`teacher` = m_teacher.`model_id`
    JOIN `pidl`.`model` AS m_student ON kd.`student` = m_student.`model_id`;

-- 3. Vue : performances énergétiques et précisions de modèles (cf enoncé du projet)
CREATE OR REPLACE VIEW `pidl`.`v_model_energy_performance` AS
    SELECT 
        m.`model_id` AS `id`,
        m.`model_name` AS `model_name`,
        m.`architecture` AS `architecture`,
        m.`model_size_label` AS `model_size`,
        
        CASE
            WHEN m.`model_name` LIKE '%base%' THEN 'base_model'
            WHEN m.`model_name` LIKE '%fp32%' THEN 'fp32'
            WHEN m.`model_name` LIKE '%fp16%' THEN 'fp16'
            WHEN m.`model_name` LIKE '%int8%' THEN 'int8'
            ELSE 'unknown'
        END AS `precision`,

        m.`layer_count` AS `layers`,
        m.`parameter_count` AS `parameters_m`,
        m.`flops_billion` AS `flops_b`,
        e.`fps_gpu` AS `fps_gpu`,
        e.`emissions_gco2eq` AS `avg_emissions_gco2eq`,
        e.`energy_consumption_mwh` AS `avg_energy_mwh`,
        e.`map_50` AS `map_50`,
        e.`map_50_95` AS `map_50_95`

    FROM `pidl`.`model` AS m
    JOIN `pidl`.`evaluation` AS e ON m.`model_id` = e.`model_fk`;

-- ------------------------Insertion ----------------------------------------------------------

-- Roles
INSERT INTO `pidl`.`role` (`role_id`, `role_name`, `description`) 
VALUES 
(1, 'Admin', 'System administrator'),
(2, 'Student', 'User with limited rights'),
(3, 'Researcher', 'User involved in model optimization');

-- Resources
INSERT INTO `pidl`.`resource` (`resource_id`, `resource_name`, `cpu_type`, `memory_gpu` , `memory_gb` , `cpu_frequency_ghz` , `max_power_watts`, `description`) 
VALUES 
(1, 'GPU Workstation A', 'Intel Xeon', 16, 64, 3.60, 450, 'High-performance training workstation'),
(2, 'Edge Device X', 'ARM Cortex', 4, 8, 1.80, 45, 'Low-power evaluation device'),
(3, 'Cloud Server Z', 'AMD EPYC', 32, 256, 2.90, 700, 'Cloud-based optimization server');

-- Tasks
INSERT INTO `pidl`.`task` (`task_id`, `task_name` ,`description`) 
VALUES 
(1, 'Image Classification', 'Assign labels to images'),
(2, 'Object Detection', 'Detect and localize objects'),
(3, 'Text Generation', 'Generate human-like text');

-- Users
INSERT INTO `pidl`.`user` (`user_id`, `first_name`, `last_name`, `email`, `password`, `is_staff`, `is_superuser`, `role_fk`) 
VALUES 
(1, 'Alice', 'Dupont', 'alice@example.com', 'pbkdf2_sha256$1000000$BbK603KBBjhBsvhIZeminE$GQrbXO6yG/fB+UvY80+7pu/EriYcgGItzFCnZeFQBTo=', FALSE, FALSE, 3),
(2, 'Bob', 'Ngoma', 'bob@example.com', 'pbkdf2_sha256$1000000$BbK603KBBjhBsvhIZeminE$GQrbXO6yG/fB+UvY80+7pu/EriYcgGItzFCnZeFQBTo=', FALSE, FALSE, 2),
(3, 'John', 'Doe', 'john@example.com', 'pbkdf2_sha256$1000000$BbK603KBBjhBsvhIZeminE$GQrbXO6yG/fB+UvY80+7pu/EriYcgGItzFCnZeFQBTo=', TRUE, TRUE, 1);

-- Models (8 models based on 3 sizes and 4 precisions)
INSERT INTO `pidl`.`model` (`model_id`, `model_name`, `architecture`, `parameter_count`, `layer_count`, `model_size_label`, `flops_billion`, `model_size`, `creation_date`,`description`,`user_fk`)
VALUES 
(1, 'YOLO-n-base', 'CNN', 3.01, 168, 'n', 8.10, 97.5, '2024-01-01 10:00:00', 'Tiny model base', 1),
(2, 'YOLO-n-fp32', 'CNN', 3.01, 168, 'n', 8.10, 97.5, '2024-01-02 10:00:00', 'Tiny model fp32', 1),
(3, 'YOLO-n-fp16', 'CNN', 3.01, 168, 'n', 8.10, 97.5, '2024-01-03 10:00:00', 'Tiny model fp16', 1),
(4, 'YOLO-n-int8', 'CNN', 3.01, 168, 'n', 8.10, 97.5, '2024-01-04 10:00:00', 'Tiny model int8', 1),
(5, 'YOLO-s-base', 'CNN', 11.13, 168, 's', 28.46, 240.0, '2024-01-05 10:00:00', 'Small model base', 1),
(6, 'YOLO-s-fp32', 'CNN', 11.13, 168, 's', 28.46, 240.0, '2024-01-06 10:00:00', 'Small model fp32', 1),
(7, 'YOLO-s-fp16', 'CNN', 11.13, 168, 's', 28.46, 240.0, '2024-01-07 10:00:00', 'Small model fp16', 1),
(8, 'YOLO-s-int8', 'CNN', 11.13, 168, 's', 28.46, 240.0, '2024-01-08 10:00:00', 'Small model int8', 1);

-- Evaluations
INSERT INTO `pidl`.`evaluation` (`evaluation_id`, `accaracy`, `final_loss`, `latency_ms`, `execution_time_ms`, `energy_consumption_mwh`, `emissions_gco2eq`, `fps_gpu`, `map_50`, `map_50_95`, `evaluation_date`, `resource_fk`, `model_fk`) 
VALUES 
(1, 0.7572, 0.320, 45.67, 1340.5, 0.1500, 0.0207, 693.48, 0.7572, 0.5640, '2024-03-01 12:00:00', 2, 1),
(2, 0.7565, 0.300, 40.50, 1200.0, 0.1346, 0.0186, 866.53, 0.7565, 0.5604, '2024-03-01 13:00:00', 2, 2),
(3, 0.7565, 0.280, 38.40, 1100.0, 0.1001, 0.0138, 1339.92, 0.7565, 0.5606, '2024-03-01 14:00:00', 2, 3),
(4, 0.6511, 0.290, 35.20, 1050.0, 0.0808, 0.0112, 1638.33, 0.6511, 0.4697, '2024-03-01 15:00:00', 2, 4),
(5, 0.8185, 0.270, 55.00, 1300.0, 0.1899, 0.0262, 606.82, 0.8185, 0.6296, '2024-03-02 10:00:00', 2, 5),
(6, 0.8175, 0.250, 52.00, 1250.0, 0.2101, 0.0290, 506.25, 0.8175, 0.6235, '2024-03-02 11:00:00', 2, 6),
(7, 0.8176, 0.240, 48.00, 1200.0, 0.1209, 0.0167, 859.57, 0.8176, 0.6238, '2024-03-02 12:00:00', 2, 7),
(8, 0.7714, 0.230, 43.00, 1150.0, 0.0968, 0.0134, 1158.16, 0.7714, 0.5813, '2024-03-02 13:00:00', 2, 8);

-- Optimizations 
INSERT INTO `pidl`.`optimization` (`optimization_id`, `name`, `optimization_date`, `description`, `resource_fk`)
VALUES 
(1, 'Quantization Run 1', '2024-01-10 14:30:00', 'INT8 conversion', 1),
(2, 'Pruning Test', '2024-01-12 11:00:00', 'Pruning 30% of parameters', 1),
(3, 'Distillation BERT', '2024-02-05 15:45:00', 'Knowledge distillation', 1);

-- Quantization
INSERT INTO `pidl`.`quantization` ( `quantization_id`, `quantization_type`, `target_precision`, `description`, `optimization_fk`) 
VALUES
(1, 'Post-training', 'INT8', 'Reduced precision for edge deployment', 1);

-- Pruning
INSERT INTO `pidl`.`pruning` ( `pruning_id`,`pruning_strategie`, `pruning_rate`, `description`, `optimization_fk`)
VALUES
(1, 'Magnitude-based', 0.30, 'Pruned lowest magnitude weights', 2);

-- Knowledge Distillation
INSERT INTO `pidl`.`knowledge_distillation`( `knowledged_distillation_id`,`softmax_temperature`, `loss_function`, `description`, `student`, `teacher`, `optimization_fk`) 
VALUES
(1, 2.0, 'CrossEntropy', 'Distillation of BERT to a smaller student model', 2, 1, 3);
 
INSERT INTO `pidl`.`model_optimization` (`model_optimization_id`, `model_fk`, `optimization_fk`) 
VALUES 
(1, 1, 1), (2, 1, 2), (3, 2, 3);

-- Model_Task
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

