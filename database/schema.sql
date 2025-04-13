CREATE TABLE Resource(
   resource_id INT AUTO_INCREMENT,
   resource_name VARCHAR(50),
   cpu_type VARCHAR(50),
   memory_gpu INT,
   memory_gb INT,
   cpu_frequency_ghz DECIMAL(4,2),
   max_power_watts INT,
   description VARCHAR(100),
   PRIMARY KEY(resource_id)
);

CREATE TABLE Optimization(
   optimization_id INT AUTO_INCREMENT,
   name VARCHAR(100),
   optimization_date DATETIME,
   description VARCHAR(100),
   resource_id INT NOT NULL,
   PRIMARY KEY(optimization_id),
   FOREIGN KEY(resource_id) REFERENCES Resource(resource_id)
);

CREATE TABLE Role(
   role_id INT AUTO_INCREMENT,
   role_name VARCHAR(50),
   description VARCHAR(150),
   PRIMARY KEY(role_id)
);

CREATE TABLE Task(
   task_id INT AUTO_INCREMENT,
   task_name VARCHAR(50),
   description VARCHAR(100),
   PRIMARY KEY(task_id)
);

CREATE TABLE _User(
   user_id INT AUTO_INCREMENT,
   first_name VARCHAR(50),
   last_name VARCHAR(50),
   email VARCHAR(100),
   password VARCHAR(100),
   role_id INT NOT NULL,
   PRIMARY KEY(user_id),
   FOREIGN KEY(role_id) REFERENCES Role(role_id)
);

CREATE TABLE Model(
   model_id INT AUTO_INCREMENT,
   model_name VARCHAR(100),
   architecture VARCHAR(100),
   parameter_count DECIMAL(6,2),          -- ex: 3.01, 11.13, 25.85
   layer_count INT,
   model_size_label VARCHAR(1),           -- ex: 'n', 's', 'm'
   flops_billion DECIMAL(6,2),            -- FLOPS in billions
   model_size DECIMAL(6,2),               -- same name, kept if needed elsewhere
   creation_date DATETIME,
   description VARCHAR(100),
   user_id INT NOT NULL,
   PRIMARY KEY(model_id),
   FOREIGN KEY(user_id) REFERENCES _User(user_id)
);

CREATE TABLE Evaluation(
   evaluation_id INT AUTO_INCREMENT,
   accaracy DECIMAL(5,4),                 -- ex: 0.8185
   final_loss DECIMAL(4,3),
   latency_ms DECIMAL(6,2),
   execution_time_ms DECIMAL(6,2),
   energy_consumption_mwh DECIMAL(6,4),   -- ex: 0.1346
   emissions_gco2eq DECIMAL(8,5),         -- ex: 0.0262
   fps_gpu DECIMAL(8,2),                  -- ex: 910.80
   map_50 DECIMAL(5,4),                   -- ex: 0.847
   map_50_95 DECIMAL(5,4),                -- ex: 0.6655
   evaluation_date DATETIME,
   resource_id INT NOT NULL,
   model_id INT NOT NULL,
   PRIMARY KEY(evaluation_id),
   FOREIGN KEY(resource_id) REFERENCES Resource(resource_id),
   FOREIGN KEY(model_id) REFERENCES Model(model_id)
);


CREATE TABLE Quantization(
   quantization_id INT AUTO_INCREMENT,
   quantization_type VARCHAR(50),
   target_precision VARCHAR(10),
   description VARCHAR(100),
   optimization_id INT NOT NULL,
   PRIMARY KEY(quantization_id),
   UNIQUE(optimization_id),
   FOREIGN KEY(optimization_id) REFERENCES Optimization(optimization_id)
);

CREATE TABLE Pruning(
   pruning_id INT AUTO_INCREMENT,
   pruning_strategie VARCHAR(50),
   pruning_rate DECIMAL(3,2),
   description VARCHAR(100),
   optimization_id INT NOT NULL,
   PRIMARY KEY(pruning_id),
   UNIQUE(optimization_id),
   FOREIGN KEY(optimization_id) REFERENCES Optimization(optimization_id)
);

CREATE TABLE KnowledgeDistillation(
   knowledgeDistillation_id INT AUTO_INCREMENT,
   softmax_temperature DECIMAL(3,1),
   loss_function VARCHAR(50),
   description VARCHAR(100),
   model_id INT NOT NULL,
   model_id_1 INT NOT NULL,
   optimization_id INT NOT NULL,
   PRIMARY KEY(knowledgeDistillation_id),
   UNIQUE(optimization_id),
   FOREIGN KEY(model_id) REFERENCES Model(model_id),
   FOREIGN KEY(model_id_1) REFERENCES Model(model_id),
   FOREIGN KEY(optimization_id) REFERENCES Optimization(optimization_id)
);

CREATE TABLE Model_Optimization(
   model_id INT,
   optimization_id INT,
   PRIMARY KEY(model_id, optimization_id),
   FOREIGN KEY(model_id) REFERENCES Model(model_id),
   FOREIGN KEY(optimization_id) REFERENCES Optimization(optimization_id)
);

CREATE TABLE Model_Task(
   model_id INT,
   task_id INT,
   PRIMARY KEY(model_id, task_id),
   FOREIGN KEY(model_id) REFERENCES Model(model_id),
   FOREIGN KEY(task_id) REFERENCES Task(task_id)
);
