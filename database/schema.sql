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
   `resource_id` INT NOT NULL,
   FOREIGN KEY(`resource_id`) REFERENCES `pidl`.`resource`(`resource_id`)
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`user`(
   `user_id` INT PRIMARY KEY AUTO_INCREMENT,
   `first_name` VARCHAR(50),
   `last_name` VARCHAR(50),
   `email` VARCHAR(100),
   `password` VARCHAR(100),
   `role_id` INT NOT NULL,
   FOREIGN KEY(`role_id`) REFERENCES `pidl`.`role`(`role_id`)
)DEFAULT CHARSET = utf8mb4;

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
   `user_id` INT NOT NULL,
   FOREIGN KEY(`user_id`) REFERENCES `pidl`.`user`(`user_id`)
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
   `resource_id` INT NOT NULL,
   `model_id` INT NOT NULL,
   FOREIGN KEY(`resource_id`) REFERENCES `pidl`.`resource`(`resource_id`),
   FOREIGN KEY(`model_id`) REFERENCES `pidl`.`model`(`model_id`)
)DEFAULT CHARSET = utf8mb4;


CREATE TABLE `pidl`.`quantization`(
   `quantization_id` INT PRIMARY KEY AUTO_INCREMENT,
   `quantization_type` VARCHAR(50),
   `target_precision` VARCHAR(10),
   `description` VARCHAR(100),
   `optimization_id` INT NOT NULL UNIQUE,
   FOREIGN KEY(`optimization_id`) REFERENCES `pidl`.`optimization`(`optimization_id`)
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`pruning`(
   `pruning_id` INT PRIMARY KEY AUTO_INCREMENT,
   `pruning_strategie` VARCHAR(50),
   `pruning_rate` DECIMAL(3,2),
   `description` VARCHAR(100),
   `optimization_id` INT NOT NULL UNIQUE,
   FOREIGN KEY(`optimization_id`) REFERENCES `pidl`.`optimization`(`optimization_id`)
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`knowledge_distillation`(
   `knowledged_distillation_id` INT PRIMARY KEY AUTO_INCREMENT,
   `softmax_temperature` DECIMAL(3,1),
   `loss_function` VARCHAR(50),
   `description` VARCHAR(100),
   `model_id` INT NOT NULL,
   `model_id_1` INT NOT NULL,
   `optimization_id` INT NOT NULL UNIQUE,
   FOREIGN KEY(`model_id`) REFERENCES `pidl`.`model`(`model_id`),
   FOREIGN KEY(`model_id_1`) REFERENCES `pidl`.`model`(`model_id`),
   FOREIGN KEY(`optimization_id`) REFERENCES `pidl`.`optimization`(`optimization_id`)
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`model_optimization`(
   `model_optimization_id` INT PRIMARY KEY AUTO_INCREMENT,
   `model_id` INT NOT NULL,
   `optimization_id` INT NOT NULL,
   FOREIGN KEY(`model_id`) REFERENCES `pidl`.`model`(`model_id`),
   FOREIGN KEY(`optimization_id`) REFERENCES `pidl`.`optimization`(`optimization_id`)
)DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pidl`.`model_task`(
   `model_task_id` INT PRIMARY KEY AUTO_INCREMENT,
   `model_id` INT NOT NULL,
   `task_id` INT NOT NULL,
   FOREIGN KEY(`model_id`) REFERENCES `pidl`.`model`(`model_id`),
   FOREIGN KEY(`task_id`) REFERENCES `pidl`.`task`(`task_id`)
)DEFAULT CHARSET = utf8mb4;
