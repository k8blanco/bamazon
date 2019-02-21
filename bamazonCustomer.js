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
    //call function to initialize bamazon product table
    initBamazon();
});

//bamazon starts up, displays current products, depts, and prices
function initBamazon() {
    let query = ("SELECT * FROM products")
    connection.query(query, function(err, res) {
        if (err) throw err;
        //create product table using cli-table
        let table = new Table({
            //set table design
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
              
            head: ["ID".green, "Product".green, "Dept".green, "Price".green, "Qty".green, "Product Sales".green], //remove product sales once supervisor works
        });

        //push data to table
        for (var i = 0; i < res.length; i++) {
            if (res[i].product_sales != null) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price,
                    res[i].stock_quantity, res[i].product_sales]
                );
                } else {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price,
                    res[i].stock_quantity]
                );
            }
        };
        
        //display table
        console.log(table.toString());
        askCust();
    });
}

//prompts user to choose what they would like to buy
function askCust() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "What catches your eye? Enter the ID # of the product you would like to purchase.",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            name: "qty",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ])
        .then(function(bamazon) {
            //set input as variables, pass variables as params
                //!!experiment with using let vs const here once working!!
            var productChoice = bamazon.id;
            var qtyWanted = bamazon.qty;

            buyItem(productChoice, qtyWanted);

        })
}


function buyItem(itemID, qtyNeeded) {
    //once customer has placed order, check if "store" has enough of that product
    let query = ('SELECT * FROM products WHERE item_id = ?');
    connection.query(query, [itemID], function(err, res) {
        if (err) throw err;

        //make product name plural (or not) as needed
        let endingString = "";
        if (qtyNeeded > 1) {
            endingString = "s.";
        } else {
            endingString = ".";
        };
    
        //if store has sufficient quantity, fulfill the customer's order
        if (qtyNeeded <= res[0].stock_quantity) {
            //calculate total so far
            let purchasePrice = res[0].price * qtyNeeded;

            //display total so far
            console.log("\nGreat! You want " + qtyNeeded + " " + res[0].product_name + endingString + "\nYour total cost is $" + purchasePrice);
           
        
            //update db after purchase
            let query = ("UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE item_id = ?");
            connection.query(query, [qtyNeeded, purchasePrice, itemID], function(err, res){
            }); 
            
        } else {
            console.log("Out of Stock".red);
        };

        //make recursive/ask if they want to buy something else
        buyMore();
    }); 
};



function buyMore() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to purchase something else?",
        },
    ]).then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
            initBamazon();
        } else {
            console.log("\nThank you for shopping Bamazon!  Please come back soon.".green);
            connection.end();
        }
    });
};





