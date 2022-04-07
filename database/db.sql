CREATE DATABASE salon_app;

USE salon_app;

CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;




CREATE TABLE dates(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    service VARCHAR(3) NOT NULL,
    user_id INT(11) NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
    )