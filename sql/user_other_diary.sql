create TABLE user_other_diary (
    id			    INT UNSIGNED	NOT NULL	AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED	NOT NULL    ,
    diary_id        INT UNSIGNED	NOT NULL    ,
    is_like         TINYINT(1)      NOT NULL    DEFAULT 0,
    created_at	    TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    modified_at	    TIMESTAMP		NULL		DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    removed_at	    TIMESTAMP		NULL		DEFAULT NULL,

    INDEX id_index (id) USING BTREE
);
