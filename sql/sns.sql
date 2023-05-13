create TABLE sns     (
    id			    INT UNSIGNED	NOT NULL	AUTO_INCREMENT PRIMARY KEY,
    user_id		    INT UNSIGNED 	NOT NULL	,
    sns             VARCHAR(30)     NOT NULL    ,
    sns_id          VARCHAR(200)    NOT NULL    ,
    access_token    VARCHAR(255)    NOT NULL    ,
    created_at	    TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    modified_at	    TIMESTAMP		NULL		DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    removed_at	    TIMESTAMP		NULL		DEFAULT NULL,

    UNIQUE KEY sns_unique_sns_snsId (sns, sns_id),
    UNIQUE KEY sns_unique_sns_userId (sns, user_id),
    INDEX user_id_index (user_id) USING BTREE,
    INDEX sns_id_index (sns_id) USING BTREE
);