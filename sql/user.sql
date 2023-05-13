create TABLE user (
    id			    INT UNSIGNED	NOT NULL	AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(30)     NOT NULL    DEFAULT "" UNIQUE,
    alert           TINYINT(1)      NOT NULL    DEFAULT 0,
    push_token      VARCHAR(255)    NULL        ,
    created_at	    TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    modified_at	    TIMESTAMP		NULL		DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    removed_at	    TIMESTAMP		NULL		DEFAULT NULL,

    INDEX id_index (id) USING BTREE
);
