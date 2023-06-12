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
    positions (title, salary, department_id)
VALUES
    ('President', 120000, 6),
    ('Vice President', 80000, 6),
    ('Marketing Manager', 7000.00, 1),
    ('Telemarketer', 3000.00, 1),
    ('Sales Manager', 9000.00, 2),
    ('Salesperson', 3900.00, 2),
    ('HR Specialist', 4200.00, 3),
    ('HR Manager', 6500.00, 3),
    ('Accounting Manager', 8000.00, 4),
    ('Accountant', 5000.00, 4),
    ('Senior Software Engineer', 23000.00, 5),
    ('Software Engineer', 9000.00, 5),
    ('Junior Software Engineer', 7000.00, 5),
    ('Sanitation Worker', 2800.00, 6),
    ('Security Guard', 3200.00, 6);

INSERT INTO
    employees (
        first_name,
        last_name,
        salary,
        position_id,
        manager_id
    )
VALUES
    ('Rihanna', 'Fenty', 1200000, 1, NULL),
    ('Jane', 'Smith', 800000, 2, 1),
    ('Mike', 'Johnson', 70000, 3, 1),
    ('Sarah', 'Williams', 32000, 4, 3),
    ('Emily', 'Davis', 100000, 5, NULL),
    ('Michael', 'Brown', 40000, 6, 5),
    ('David', 'Anderson', 41000, 8, NULL),
    ('Jessica', 'Wilson', 42000, 7, 8),
    ('Alex', 'Lee', 80000, 9, NULL),
    ('Olivia', 'Harris', 50000, 10, 9),
    ('Matthew', 'Clark', 230000, 11, NULL),
    ('Sophia', 'Young', 95000, 12, 11),
    ('Daniel', 'Lewis', 70000, 13, 11),
    ('Greg', 'Carpenter', 28000, 14, NULL),
    ('Mike', 'Tyson', 35500, 15, NULL),
    ('Conor', 'McGregor', 32000, 15, NULL),
    ('Manny', 'Pacquiao', 35000, 15, NULL);