use employees_db;

INSERT INTO
    departments (department_name)
VALUES
    ('Marketing'),
    ('Sales'),
    ('Human Resources'),
    ('Finance'),
    ('Engineering'),
    ('General');

INSERT INTO
    roles (title, salary, department_id)
VALUES
    ('President', 120000, 6),
    ('Marketing Manager', 7000.00, 1),
    ('Sales Manager', 8000.00, 2),
    ('Salesperson', 4000.00, 2),
    ('HR Specialist', 4000.00, 3),
    ('HR Manager', 6500.00, 3),
    ('Chief Financial Officer', 30000.00, 4),
    ('Accountant', 5000.00, 4),
    ('Senior Software Engineer', 13000.00, 5),
    ('Software Engineer', 9000.00, 5),
    ('Sanitation Worker', 2500.00, 6),
    ('Junior Software Engineer', 7000.00, 5);

INSERT INTO
    employees (
        first_name,
        last_name,
        salary,
        role_id,
        manager_id
    )
VALUES
    ('John', 'Doe', 4000, 1, NULL),
    ('Jane', 'Smith', 2500, 2, 1),
    ('Mike', 'Johnson', 3500, 2, 1),
    ('Sarah', 'Williams', 3800, 3, NULL),
    ('Emily', 'Davis', 4500, 1, NULL),
    ('Michael', 'Brown', 3200, 2, 1),
    ('Jessica', 'Wilson', 3800, 2, 1),
    ('David', 'Anderson', 4100, 3, NULL),
    ('Alex', 'Lee', 2700, 3, 2),
    ('Olivia', 'Harris', 3900, 1, NULL),
    ('Matthew', 'Clark', 3200, 2, 1),
    ('Sophia', 'Young', 3700, 2, 1),
    ('Daniel', 'Lewis', 4200, 3, NULL);