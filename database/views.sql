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
        p.`precision_name` AS `precision`,
        m.`layer_count` AS `layers`,
        m.`parameter_count` AS `parameters_m`,
        m.`flops_billion` AS `flops_b`,
        e.`fps_gpu` AS `fps_gpu`,
        e.`emissions_gco2eq` AS `avg_emissions_gco2eq`,
        e.`energy_consumption_mwh` AS `avg_energy_mwh`,
        e.`map_50` AS `map_50`,
        e.`map_50_95` AS `map_50_95`

    FROM `pidl`.`model` AS m
    JOIN `pidl`.`evaluation` AS e ON m.`model_id` = e.`model_fk`
    JOIN `pidl`.`precision` AS p ON m.`precision_fk` = p.`precision_id`;

