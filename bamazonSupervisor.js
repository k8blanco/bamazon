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
                break;

            //----------------Low Inventory-----------------
            case "Create New Department":
                createDept();
                break;

        };

    });
};

// total profit = product_sales - over_head_costs


function viewSales() {
            let query = ("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM departments INNER JOIN products ON departments.department_name=products.department_name GROUP BY departments.department_id ORDER BY departments.department_id");
            connection.query(query, function(err, res) {
                if (err) throw err;
            
            var table = new Table({
                chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                        , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                        , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                        , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
            
                        head: ["Dept ID".green, "Dept".green, "Overhead Costs".green, "Sales Total".green, "Total Profit".green],
            });
            
            
            for (var i = 0; i < res.length; i++) {
                var totalProfit = (res[i].over_head_costs - res[i].product_sales).toFixed(2);
                table.push(

                    [res[i].department_id, res[i].department_name, res[i].over_head_costs, 
                    res[i].product_sales, totalProfit]

                );
            };

        //display table
        console.log(table.toString());
        doMore();
        
    });
};


function createDept() {

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department you would like to add??",
        },
        {
            type: "input",
            name: "costs",
            message: "What do you anticipate the overhead costs to be?",
        },
    ])
    .then(function(add) {
        let deptName = add.name;
        let deptCosts = add.costs;
        addDept(deptName, deptCosts);
    });
};    

function addDept(deptName, deptCosts) {

    let query = ("INSERT INTO departments (department_name, over_head_costs) VALUES ('" + deptName + "'," + deptCosts + ")");  
                                                    
    connection.query(query, function(err, res) {
        if(err) throw err;
        console.log("\n" + deptName + " added to Departments" + ".");
        console.log("----------------------------------------------".magenta);

        anotherDept();
        });         
     
};

function anotherDept() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do now?",
            choices: ["Add Another Department", "Something Else", "Leave"]
        }
    ])
    .then(function(menu) {
        //determine which code block needs to be called
        switch (menu.action) {

            //----------------View Products-----------------
            case "Add Another Product":
                createDept();
                break;

            case "Something Else":
                initSpvMenu();
                break;

            case "Leave":
                console.log("\nGreat!  Thanks for being awesome, supervisor!".green);
                connection.end();
                break;
        };
    });
}


function doMore() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to do something else?",
        },
    ]).then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
            initSpvMenu();
        } else {
            console.log("\nGreat!  Keep up the good work.".green);
            connection.end();
        }
    });

}