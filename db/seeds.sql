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
    ('Rihanna', 'Fenty', 120000, 1, NULL),
    ('Jane', 'Smith', 80000, 2, 1),
    ('Mike', 'Johnson', 7000, 3, 1),
    ('Sarah', 'Williams', 3200, 4, 3),
    ('Emily', 'Davis', 10000, 5, NULL),
    ('Michael', 'Brown', 4000, 6, 5),
    ('David', 'Anderson', 4100, 8, NULL),
    ('Jessica', 'Wilson', 4200, 7, 8),
    ('Alex', 'Lee', 8000, 9, NULL),
    ('Olivia', 'Harris', 5000, 10, 9),
    ('Matthew', 'Clark', 23000, 11, NULL),
    ('Sophia', 'Young', 9500, 12, 11),
    ('Daniel', 'Lewis', 7000, 13, 11),
    ('Greg', 'Carpenter', 2800, 14, NULL),
    ('Mike', 'Tyson', 3550, 15, NULL),
    ('Conor', 'McGregor', 3200, 15, NULL),
    ('Manny', 'Pacquiao', 3500, 15, NULL);