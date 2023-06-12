DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE positions (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(12, 2) NOT NULL,
    department_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE
    SET
        NULL
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    salary DECIMAL(12, 2) NOT NULL,
    position_id INT,
    manager_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE
    SET
        NULL,
        FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE
    SET
        NULL
);