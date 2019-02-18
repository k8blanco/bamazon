DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bath Towels", "Home Goods", 8.99, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dish Towels", "Home Goods", 3.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bath Rug", "Home Goods", 12.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Decorative Pillows", "Home Goods", 14.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Rice", "Grocery", 2.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Apples", "Grocery", 0.59, 120);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Paper Plates (10ct)", "Grocery", 4.99, 15);

SELECT * FROM bamazon.products;