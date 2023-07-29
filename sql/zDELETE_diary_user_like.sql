-- create TABLE diary_user_like (
--     id			INT UNSIGNED	NOT NULL	AUTO_INCREMENT PRIMARY KEY,
--     user_id		INT UNSIGNED 	NOT NULL	,
--     diary_id	INT UNSIGNED 	NOT NULL	,
--     created_at	TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP,
--     modified_at	TIMESTAMP		NULL		DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
--     removed_at	TIMESTAMP		NULL		DEFAULT NULL,

--     INDEX id_index (id) USING BTREE
-- );

-- DROP TABLE diary_user_like