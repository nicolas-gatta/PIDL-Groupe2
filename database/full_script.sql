
DROP DATABASE IF EXISTS `pidl`;
CREATE DATABASE `pidl`;
        
-- File: c:\Users\Utilisateur\Desktop\Projet\PIDL-Groupe2\database\schema.sql

-- =====================================================
-- Table: resource
-- Description: Represents the hardware or infrastructure used for model training and evaluation.
-- =====================================================
CREATE TABLE `pidl`.`resource`(
   `resource_id` INT PRIMARY KEY AUTO_INCREMENT,
   `resource_name` VARCHAR(50),
   `cpu_type` VARCHAR(50),
   `memory_gb` INT,
   `gpu_type` VARCHAR(50),
   `memory_gpu` INT,
   `cpu_frequency_ghz` FLOAT,
   `max_power_watts` INT,
   `resource_description` VARCHAR(100)
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: role
-- Description: Defines different roles for users in the system (e.g., Admin, Researcher).
-- =====================================================
CREATE TABLE `pidl`.`role`(
   `role_id` INT PRIMARY KEY AUTO_INCREMENT,
   `role_name` VARCHAR(50) UNIQUE,
   `role_description` VARCHAR(150)
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: task
-- Description: Lists tasks that models can perform (e.g., Image Classification, Object Detection).
-- =====================================================
CREATE TABLE `pidl`.`task`(
   `task_id` INT PRIMARY KEY AUTO_INCREMENT,
   `task_name` VARCHAR(50) UNIQUE,
   `task_description` VARCHAR(100),
   `task_color` VARCHAR(50)
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: precision
-- Description: Represents the precision level of models (e.g., FP32, FP16, INT8).
-- =====================================================
CREATE TABLE `pidl`.`precision`(
   `precision_id` INT PRIMARY KEY AUTO_INCREMENT,
   `precision_name` VARCHAR(50) UNIQUE,
   `precision_description` VARCHAR(150)
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: optimization
-- Description: Stores information about optimization techniques applied to models.
-- =====================================================
CREATE TABLE `pidl`.`optimization`(
   `optimization_id` INT PRIMARY KEY AUTO_INCREMENT,
   `optimization_name` VARCHAR(100),
   `optimization_date` DATETIME,
   `optimization_description` VARCHAR(100),
   `resource_fk` INT NOT NULL,
   CONSTRAINT `FK_optimization_resource` FOREIGN KEY(`resource_fk`) REFERENCES `pidl`.`resource`(`resource_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: user
-- Description: Stores user information with extended attributes for authentication and roles.
-- =====================================================
CREATE TABLE `pidl`.`user` (
   `user_id` INT PRIMARY KEY AUTO_INCREMENT,
   `first_name` VARCHAR(50),
   `last_name` VARCHAR(50),
   `email` VARCHAR(100) NOT NULL UNIQUE,     -- Required for Django
   `password` VARCHAR(256) NOT NULL,         -- Required for Django
   `is_active` TINYINT DEFAULT 1,         -- Required for Django
   `is_staff` TINYINT DEFAULT 0,          -- Required for Django
   `is_superuser` TINYINT DEFAULT 0,      -- Required for Django
   `last_login` DATETIME DEFAULT NULL,       -- Required for Django
   `role_fk` INT NOT NULL,
   CONSTRAINT `FK_user_role` FOREIGN KEY (`role_fk`) REFERENCES `pidl`.`role` (`role_id`) ON DELETE CASCADE
) DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: model
-- Description: Contains details about machine learning models.
-- =====================================================
CREATE TABLE `pidl`.`model`(
   `model_id` INT PRIMARY KEY AUTO_INCREMENT,
   `model_name` VARCHAR(100) UNIQUE,
   `architecture` VARCHAR(100),
   `parameter_count` FLOAT,          -- ex: 3.01, 11.13, 25.85
   `layer_count` INT,
   `model_size_label` VARCHAR(1),           -- ex: 'n', 's', 'm'
   `flops_billion` FLOAT,            -- FLOPS in billions
   `model_size` FLOAT,               -- same name, kept if needed elsewhere
   `training_time` INT,
   `creation_date` DATETIME,
   `model_description` VARCHAR(100),
   `precision_fk` INT NOT NULL,
   `user_fk` INT NOT NULL,
   CONSTRAINT `FK_model_user` FOREIGN KEY(`user_fk`) REFERENCES `pidl`.`user`(`user_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_model_precision` FOREIGN KEY(`precision_fk`) REFERENCES `pidl`.`precision`(`precision_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: evaluation
-- Description: Records the evaluation results of models on specific resources.
-- =====================================================
CREATE TABLE `pidl`.`evaluation`(
   `evaluation_id` INT PRIMARY KEY AUTO_INCREMENT,
   `accuracy` FLOAT,                 -- ex: 0.8185
   `final_loss` FLOAT,
   `latency_ms` FLOAT,
   `execution_time_ms` FLOAT,
   `energy_consumption_mwh` FLOAT,   -- ex: 0.1346
   `emissions_gco2eq` FLOAT,         -- ex: 0.0262
   `average_emissions_per_inference` FLOAT,
   `average_energy_per_inference` FLOAT,
   `fps_gpu` FLOAT,                  -- ex: 910.80
   `fps_cpu` FLOAT,
   `std_cpu` FLOAT,
   `std_gpu` FLOAT,
   `num_macs` FLOAT,
   `map_50` FLOAT,                   -- ex: 0.847
   `map_50_95` FLOAT,                -- ex: 0.6655
   `evaluation_date` DATETIME NOT NULL,
   `resource_fk` INT NOT NULL,
   `model_fk` INT NOT NULL,
   CONSTRAINT `FK_evaluation_resource` FOREIGN KEY(`resource_fk`) REFERENCES `pidl`.`resource`(`resource_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_model_resource` FOREIGN KEY(`model_fk`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: quantization
-- Description: Stores information about model quantization techniques.
-- =====================================================
CREATE TABLE `pidl`.`quantization`(
   `quantization_id` INT PRIMARY KEY AUTO_INCREMENT,
   `quantization_type` VARCHAR(50),             -- e.g., static, dynamic, qat
   `quantization_description` VARCHAR(100),
   `quantization_model_size_reduction` FLOAT,
   `quantization_memory_reduction` FLOAT,
   `precision_fk` INT NOT NULL,            -- e.g., int8, fp16
   `optimization_fk` INT NOT NULL UNIQUE,
   CONSTRAINT `FK_quantization_precision` FOREIGN KEY(`precision_fk`) REFERENCES `pidl`.`precision`(`precision_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_quantization_optimization` FOREIGN KEY(`optimization_fk`) REFERENCES `pidl`.`optimization`(`optimization_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: pruning
-- Description: Holds information about model pruning strategies.
-- =====================================================
CREATE TABLE `pidl`.`pruning`(
   `pruning_id` INT PRIMARY KEY AUTO_INCREMENT,
   `pruning_strategy` VARCHAR(50),    -- e.g., magnitude, structured, random
   `pruning_scope` VARCHAR(50),       -- e.g., global, local
   `pruning_rate` FLOAT,              
   `pruning_compression_ratio` FLOAT,   
   `pruning_memory_reduction` FLOAT,        
   `pruning_description` VARCHAR(100),
   `optimization_fk` INT NOT NULL UNIQUE,
   CONSTRAINT `FK_pruning_optimization` FOREIGN KEY(`optimization_fk`) REFERENCES `pidl`.`optimization`(`optimization_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: knowledge_distillation
-- Description: Represents knowledge distillation configurations applied to models.
-- =====================================================
CREATE TABLE `pidl`.`knowledge_distillation`(
   `knowledged_distillation_id` INT PRIMARY KEY AUTO_INCREMENT,
   `softmax_temperature` FLOAT,
   `loss_function` VARCHAR(50),
   `knowledge_distillation_description` VARCHAR(100),
   `student` INT NOT NULL,
   `teacher` INT NOT NULL,
   `optimization_fk` INT NOT NULL UNIQUE,
   CONSTRAINT `FK_knowledge_teacher_model` FOREIGN KEY(`teacher`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_knowledge_student_model` FOREIGN KEY(`student`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_knowledge_optimization` FOREIGN KEY(`optimization_fk`) REFERENCES `pidl`.`optimization`(`optimization_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: model_optimization
-- Description: Represents the many-to-many relationship between models and optimizations.
-- =====================================================
CREATE TABLE `pidl`.`model_optimization`(
   `model_optimization_id` INT PRIMARY KEY AUTO_INCREMENT,
   `model_fk` INT NOT NULL,
   `optimization_fk` INT NOT NULL,
   CONSTRAINT `FK_model_optimization_model` FOREIGN KEY(`model_fk`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_model_optimization_optimization` FOREIGN KEY(`optimization_fk`) REFERENCES `pidl`.`optimization`(`optimization_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- Table: model_task
-- Description: Represents the many-to-many relationship between models and tasks.
-- =====================================================
CREATE TABLE `pidl`.`model_task`(
   `model_task_id` INT PRIMARY KEY AUTO_INCREMENT,
   `model_fk` INT NOT NULL,
   `task_fk` INT NOT NULL,
   CONSTRAINT `FK_model_task_model` FOREIGN KEY(`model_fk`) REFERENCES `pidl`.`model`(`model_id`) ON DELETE CASCADE,
   CONSTRAINT `FK_model_task_task` FOREIGN KEY(`task_fk`) REFERENCES `pidl`.`task`(`task_id`) ON DELETE CASCADE
)DEFAULT CHARSET = utf8mb4;


-- File: c:\Users\Utilisateur\Desktop\Projet\PIDL-Groupe2\database\views.sql

-- =====================================================
-- View: resource
-- Description: Defines different ressource use for evaluation or/and optimization
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_resource` AS
    SELECT
        `resource_id` AS `id`,
        `resource_name` AS `name`,
        `cpu_type` AS `cpu`,
        `gpu_type` AS `gpu`,
        `memory_gpu` AS `gpu_memory`,
        `memory_gb` AS `computer_ram`,
        `cpu_frequency_ghz` AS `cpu_frenquency`,
        `max_power_watts` AS `max_watts`,
        `resource_description` AS `description`
    FROM `pidl`.`resource`;

-- =====================================================
-- View: role
-- Description: Defines different roles for users in the system (e.g., Admin, Researcher).
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_role` AS
    SELECT
        `role_id` AS `id`,
        `role_name` AS `name`,
        `role_description` AS `description`
    FROM `pidl`.`role`;

-- =====================================================
-- View: precision
-- Description: Represents the precision level of models (e.g., FP32, FP16, INT8).
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_precision` AS
    SELECT
        `precision_id` AS `id`,
        `precision_name` AS `name`,
        `precision_description` AS `description`
    FROM `pidl`.`precision`;

-- =====================================================
-- View: task
-- Description: Lists tasks that models can perform (e.g., Image Classification, Object Detection).
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_task` AS
    SELECT
        `task_id` AS `id`,
        `task_name` AS `name`,
        `task_description` AS `description`,
        `task_color` AS `color`
    FROM `pidl`.`task`;

-- =====================================================
-- View: optimization
-- Description: Stores information about optimization techniques applied to models.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_optimization` AS
    SELECT
        `optimization_id` AS `id`,
        `optimization_name` AS `name`,
        `optimization_date` AS `date`,
        `optimization_description` AS `description`, 
        vre.`cpu` AS `cpu`,
        vre.`gpu` AS `gpu`,
        vre.`gpu_memory` AS `gpu_memory`,
        vre.`computer_ram` AS `computer_ram`,
        vre.`cpu_frenquency` AS `cpu_frenquency`,
        vre.`max_watts` AS `max_watts`
    FROM `pidl`.`optimization` as o
    JOIN `pidl`.`v_resource` AS vre ON vre.`id` = o.`resource_fk`;

-- =====================================================
-- View: user
-- Description: Stores user information with extended attributes for authentication and roles.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_user` AS
    SELECT
        `user_id` AS `id`,
        `first_name` AS `first_name`,
        `last_name` AS `last_name`,
        `email` AS `email`,
        `last_login` AS `last_login`,
        vr.`name` AS `role`
    FROM `pidl`.`user` AS u
    JOIN `pidl`.`v_role` AS vr ON vr.`id` = u.`role_fk`;

-- =====================================================
-- View: model
-- Description: Contains details about machine learning models.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_model` AS
    SELECT 
		m.`model_id` AS `id`,
        m.`model_name` AS `name`,
        m.`architecture` AS `architecture`,
        m.`parameter_count` AS `parameters_m`,
        m.`layer_count` AS `layers`,
        m.`model_size_label` AS `model_size_label`,
        m.`flops_billion` AS `flops_b`,
        m.`model_size` AS `model_size`,
        m.`training_time` AS `training_time`,
        m.`creation_date` AS `creation_date`,
        m.`model_description` AS `description`,
        vp.`name` AS `precision`,
        m.`user_fk` AS `user_id`,
        (SELECT CONCAT( vu.`first_name`, ' ', vu.`last_name`)) AS `creator`
        
    FROM `pidl`.`model` AS m
    JOIN `pidl`.`v_precision` AS vp ON  vp.`id` = m.`precision_fk`
    JOIN `pidl`.`v_user` AS vu ON vu.`id` = m.`user_fk`;

-- =====================================================
-- View: evaluation
-- Description: Records the evaluation results of models on specific resources.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_evaluation` AS
    SELECT
        `evaluation_id` AS `id`,
        `accuracy` AS `accuracy`,
        `final_loss` AS `final_loss`,
        `latency_ms` AS `latency_ms`,
        `execution_time_ms` AS `execution_time_ms`,
        `energy_consumption_mwh` AS `total_energy_consumption_mwh`,
        `emissions_gco2eq` AS `total_emissions_gco2eq`,
        `average_emissions_per_inference` AS `avg_emissions_per_inference`,
        `average_energy_per_inference` AS `avg_energy_per_inference`,
        `fps_gpu` AS `fps_gpu`,
        `fps_cpu` AS `fps_cpu`,
        `std_cpu` AS `std_cpu`,
        `std_gpu` AS `std_gpu`,
        `num_macs` AS `num_macs`,
        `map_50` AS `map_50`,
        `map_50_95` AS `map_50_95`,
        `evaluation_date` AS `date`,
        vm.`id` AS `model_id`,
        vm.`name` AS `model_name`,
        vre.`cpu` AS `cpu`,
        vre.`gpu` AS `gpu`,
        vre.`gpu_memory` AS `gpu_memory`,
        vre.`computer_ram` AS `computer_ram`,
        vre.`cpu_frenquency` AS `cpu_frenquency`,
        vre.`max_watts` AS `max_watts`

    FROM `pidl`.`evaluation` AS e
    JOIN `pidl`.`v_resource` AS vre ON vre.`id` = e.`resource_fk`
    JOIN `pidl`.`v_model` AS vm ON vm.`id` = e.`model_fk`;

-- =====================================================
-- View: quantization
-- Description: Stores information about model quantization techniques.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_quantization` AS
    SELECT
        `quantization_id` AS `id`,
        `quantization_type` AS `type`,
        `quantization_description` AS `description`,
        `quantization_model_size_reduction` AS `model_size_reduction`,
        `quantization_memory_reduction` AS `memory_reduction`,
        vp.`name` AS `target_precision`,
        q.`optimization_fk` AS `optimization_id`,
        vo.`cpu` AS `cpu`,
        vo.`gpu` AS `gpu`,
        vo.`gpu_memory` AS `gpu_memory`,
        vo.`computer_ram` AS `computer_ram`,
        vo.`cpu_frenquency` AS `cpu_frenquency`,
        vo.`max_watts` AS `max_watts`,
        vo.`date` AS `optimization_date`

    FROM `pidl`.`quantization` AS q 
    JOIN `pidl`.`v_precision` AS vp ON vp.`id` = q.`precision_fk`
    JOIN `pidl`.`v_optimization` AS vo ON vo.`id` = q.`optimization_fk`;

-- =====================================================
-- View: pruning
-- Description: Holds information about model pruning strategies.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_pruning` AS
    SELECT
        `pruning_id` AS `id`,
        `pruning_strategy` AS `strategy`,
        `pruning_scope` AS `scope`,
        `pruning_rate` AS `rate`,
        `pruning_compression_ratio` AS `compression_ratio`,
        `pruning_memory_reduction` AS `memory_reduction`,
        `pruning_description` AS `description`,
        p.`optimization_fk` AS `optimization_id`,
        vo.`cpu` AS `cpu`,
        vo.`gpu` AS `gpu`,
        vo.`gpu_memory` AS `gpu_memory`,
        vo.`computer_ram` AS `computer_ram`,
        vo.`cpu_frenquency` AS `cpu_frenquency`,
        vo.`max_watts` AS `max_watts`,
        vo.`date` AS `optimization_date`

    FROM `pidl`.`pruning` AS p
    JOIN `pidl`.`v_optimization` AS vo ON vo.`id` = p.`optimization_fk`;

-- =====================================================
-- View: knowledge_distillation
-- Description: Represents knowledge distillation configurations applied to models.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_knowledge_distillation` AS
    SELECT
        `knowledged_distillation_id` AS `id`,
        `softmax_temperature` AS `softmax_temperature`,
        `loss_function` AS `loss_function`,
        `knowledge_distillation_description` AS `description`,
        m_teacher.`id` AS `teacher_id`,
        m_teacher.`name` AS `teacher_name`,
        m_student.`id` AS `student_id`,
        m_student.`name` AS `student_name`,
        kd.`optimization_fk` AS `optimization_id`,
        vo.`cpu` AS `cpu`,
        vo.`gpu` AS `gpu`,
        vo.`gpu_memory` AS `gpu_memory`,
        vo.`computer_ram` AS `computer_ram`,
        vo.`cpu_frenquency` AS `cpu_frenquency`,
        vo.`max_watts` AS `max_watts`,
        vo.`date` AS `optimization_date`

    FROM `pidl`.`knowledge_distillation` as kd
    JOIN `pidl`.`v_model` AS m_teacher ON m_teacher.`id` = kd.`teacher`
    JOIN `pidl`.`v_model` AS m_student ON m_student.`id`= kd.`student`
    JOIN `pidl`.`v_optimization` AS vo ON vo.`id` = kd.`optimization_fk`;

-- =====================================================
-- View: model_optimization
-- Description: Represents the many-to-many relationship between models and optimizations.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_model_optimization` AS
    SELECT
        `model_optimization_id` AS `id`,
        vm.`id` AS `model_id`,
        vm.`name` AS `model_name`,
        vo.`id` AS `optimization_id`,
        vo.`name` AS `optimization_name`

    FROM `pidl`.`model_optimization` as mo
    JOIN `pidl`.`v_model` AS vm ON vm.`id` = mo.`model_fk`
    JOIN `pidl`.`v_optimization` AS vo ON vo.`id` = mo.`optimization_fk`;

-- =====================================================
-- View: model_task
-- Description: Represents the many-to-many relationship between models and tasks.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_model_task` AS
    SELECT
        `model_task_id` AS `id`,
        vm.`id` AS `model_id`,
        vm.`name` AS `model_name`,
        vt.`id` AS `task_id`,
        vt.`name` AS `task_name`

    FROM `pidl`.`model_task` as mt
    JOIN `pidl`.`v_task` AS vt ON vt.`id` = mt.`task_fk`
    JOIN `pidl`.`v_model` AS vm ON vm.`id` = mt.`model_fk`;

-- ADVANCED VIEWS --
-- =====================================================
-- View: simplify_data_model
-- Description: Represents the simplify informations of a model for the table view of the frontend.
-- =====================================================
CREATE OR REPLACE VIEW `pidl`.`v_simplify_data_model` AS
    SELECT 
		vm.`id` AS `id`,
        vm.`name` AS `name`,
        vm.`architecture` AS `architecture`,
        vm.`parameters_m` AS `parameters_m`,
        vm.`layers` AS `layers`,
        vm.`model_size_label` AS `model_size_label`,
        vm.`flops_b` AS `flops_b`,
        vm.`model_size` AS `model_size`,
        vm.`training_time` AS `training_time`,
        vm.`creation_date` AS `creation_date`,
        vm.`precision` AS `precision`,
        vm.`user_id` AS `user_id`, 
        vm.`creator` AS `creator`,
        ve.`fps_gpu` AS `fps_gpu`,
        ve.`fps_cpu` AS `fps_cpu`,
        ve.`std_cpu` AS `std_cpu`,
        ve.`std_gpu` AS `std_gpu`,
        ve.`num_macs` AS `num_macs`,
        ve.`total_energy_consumption_mwh` AS `total_energy_consumption_mwh`,
        ve.`total_emissions_gco2eq` AS `total_emissions_gco2eq`,
        ve.`avg_emissions_per_inference` AS `avg_emissions_per_inference`,
        ve.`avg_energy_per_inference` AS `avg_energy_per_inference`,
        ve.`map_50` AS `map_50`,
        ve.`map_50_95` AS `map_50_95`

    FROM `pidl`.`v_model` AS vm
    JOIN `pidl`.`v_evaluation` AS ve ON ve.`id` = (SELECT `id` FROM `pidl`.`v_evaluation`
                                                    WHERE `model_id` = vm.`id`
                                                    ORDER BY `date` DESC
                                                    LIMIT 1);


-- File: c:\Users\Utilisateur\Desktop\Projet\PIDL-Groupe2\database\stored_procedures.sql
DELIMITER //

DELIMITER ;

-- File: c:\Users\Utilisateur\Desktop\Projet\PIDL-Groupe2\database\seed.sql
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




