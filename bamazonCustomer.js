//JS for Bamazon Node/MySQL App



//once customer has placed order, check if "store" has enough of that product
    //if not, display insufficient quantity and prevent the sale from going through
        //ask if they would like to lower the quantity of the product
        //ask if they would like to buy something else?
//if store has sufficient quantity, fulfill the customer's order
//once the update has gone through, show the customer the total $ of their purchase


const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table");
const colors = require("colors");


//user enters bamazonCustomer.js in node command line

//create connection to mysql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "****", //DO NOT GIT PUSH WITH THIS
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    //call function to initialize bamazon product table
    initBamazon();
});

//bamazon starts up, displays current products, depts, and prices
function initBamazon() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        //create product table using cli-table
        let table = new Table({
            //set table design
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
              
            head: ["ID".green, "Product".green, "Dept".green, "Price".green, "Qty".green],
        });

        //push data to table
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price,
                    res[i].stock_quantity]
            );
        };
        
        //display table
        console.log(table.toString());
    })

};

//prompts user to choose what they would like to buy
    //asks the user of the id of the item they would like to buy
    //then asks how many of the product they would like to buy
function askCust() {
    inquirer.prompt([
        {
            name: "action",
            type: "input",
            message: "Enter the ID of the product you would like to purchase",
        },
        {
            name: "qty",
            type: "input",
            message: "How many would you like to purchase?"
        }
    ])

        .then(function(variablehere) {

        })
}


// function runBamazon() {
//     inquirer
//       .prompt({
//         name: "action",
//         type: "input",
//         message: "Enter the ID of the product you want to purchase",
//       })
//       .then(function(answer) {
//         switch (answer.action) {

//         case "Find songs by artist":
//           artistSearch();
//           break;

