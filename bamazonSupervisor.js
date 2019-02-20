//JS for Bamazon Node/MySQL Customer App

require("dotenv").config();

const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table");
const colors = require("colors");


//create connection to mysql database
const connection = mysql.createConnection({
    //Your host
    host: process.env.DB_HOST,
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: process.env.DB_USER,
  
    // Your password
    password: process.env.DB_PASS, 

    database: process.env.DB

});

connection.connect(function(err) {
    if (err) throw err;
    initSpvMenu();
 
});

//initialize manager menu
function initSpvMenu() {
    //inquirer prompt list - "view products for sale, view low inventory, add to inventory, add new product"
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ])
    .then(function(menu) {
        //determine which code block needs to be called
        switch (menu.action) {

            //----------------View Products-----------------
            case "View Product Sales by Department":
                viewSales();
                console.log("viewing sales");
                break;

            //----------------Low Inventory-----------------
            case "Create New Department":
                createDept();
                break;

        };

    });
};

function viewSales() {
    
    //total products data
    let query = ("SELECT department_name, SUM(product_sales) AS product_sales FROM products GROUP BY department_name");
    connection.query(query, function(err,res) {
        if (err) throw err;
        console.log("totalling data");

    //join table data from products and departments tables
    let query = ("SELECT products.department_name, products.product_sales FROM products INNER JOIN departments ON products.department_name=departments.department_name");
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("joining data");

    //get all data from departments table
    let query = ("SELECT * FROM departments")
        connection.query(query, function(err, res) {
            if (err) throw err;
        console.log("selecting all from departments");

        var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
        });

        for (var i = 0; i < res.length; i++) {
                table.push(
                    [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales]
                );
            };

        //display table
        console.log(table.toString());

    });
});
});
};
//     SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
// FROM Orders
// INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;


    //--------------------table to join dept name and show prodpuct sales---------------------------
    // let query = ("SELECT department_name, SUM(product_sales) AS product_sales FROM products GROUP BY department_name");
    // connection.query(query, function(err,res) {
    //     if (err) throw err;

    //     let tableB = new Table({
    //         chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
    //             , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
    //             , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
    //             , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },

    //             head: ["Product Sales".green],
    //     });
    
    //     //push data to table
    //     for (var i = 0; i < res.length; i++) {
    //         tableB.push(
    //             [res[i].department_name, res[i].product_sales]
    //         );
    //     };

    // //display table
    // console.log(tableA.toString());
    
    // });  //make recursive
        // doMore();

        //total product sales for each department
        //display the totals associated with each dept in this table 
  

function createDept() {

}


function doMore() {

}