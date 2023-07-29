create TABLE report_diary (
    id			        INT UNSIGNED	NOT NULL	AUTO_INCREMENT PRIMARY KEY,
    report_user_id		INT UNSIGNED 	NOT NULL	,
    diary_id            INT UNSIGNED	NOT NULL    ,
    content             VARCHAR(300)    NOT NULL    ,
    created_at	        TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    modified_at	        TIMESTAMP		NULL		DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    removed_at	        TIMESTAMP		NULL		DEFAULT NULL,

    INDEX id_index (id) USING BTREE
);