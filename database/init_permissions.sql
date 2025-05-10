-- ============================
-- Django Auth Core Data
-- ============================
-- cmd:  mysql -u root -p pidl < ../database/init_permissions.sql

-- Créer les groupes
INSERT INTO `pidl`.`auth_group`(id, name) VALUES(1, 'Admin');
INSERT INTO `pidl`.`auth_group`(id, name) VALUES(2, 'Researcher');
INSERT INTO `pidl`.`auth_group`(id, name) VALUES(3, 'Student');

-- Admin: toutes les permissions(1 à 32 en exemple)
INSERT INTO `pidl`.`auth_group_permissions`(group_id, permission_id) VALUES
(1, 1),(1, 2),(1, 3),(1, 4),(1, 5),(1, 6),(1, 7),(1, 8),
(1, 9),(1, 10),(1, 11),(1, 12),(1, 13),(1, 14),(1, 15),(1, 16),
(1, 17),(1, 18),(1, 19),(1, 20),(1, 21),(1, 22),(1, 23),(1, 24),
(1, 25),(1, 26),(1, 27),(1, 28),(1, 29),(1, 30),(1, 31),(1, 32);

-- Researcher(ajout, modification, lecture uniquement) : permissions 'add_', 'change_', 'view_'
INSERT INTO `pidl`.`auth_group_permissions`(group_id, permission_id) VALUES
(2, 1),(2, 2),(2, 4),(2, 5),(2, 6),(2, 8),
(2, 9),(2, 10),(2, 12),(2, 13),(2, 14),(2, 16),
(2, 17),(2, 18),(2, 20),(2, 21),(2, 22),(2, 24),
(2, 25),(2, 26),(2, 28),(2, 29),(2, 30),(2, 32);

-- Student: uniquement les 'view_'
INSERT INTO `pidl`.`auth_group_permissions`(group_id, permission_id) VALUES
(3, 4),(3, 8),(3, 12),(3, 16),(3, 20),(3, 24),(3, 28),(3, 32);












