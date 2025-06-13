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
