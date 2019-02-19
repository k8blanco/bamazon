//JS for Bamazon Node/MySQL Manager App

//packages needed
const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table");
const colors = require("colors");

//create connection to mysql database
const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "",
  
    // Your password
    password: "", //DO NOT GIT PUSH WITH THIS
    database: "bamazon"
    //create a dotenv package to hide password
    //create new user for these??
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    //call function to initialize bamazon product table
    initMgrMenu();
});

//initialize manager menu
function initMgrMenu() {
    //inquirer prompt list - "view products for sale, view low inventory, add to inventory, add new product"
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ])
    .then(function(menu) {
        //determine which code block needs to be called
        switch (menu.action) {

            //----------------View Products-----------------
            case "View Products for Sale":
                viewProducts();
                break;

            //----------------Low Inventory-----------------
            case "View Low Inventory":
                lowInventory();
                break;

            //----------------Add to Inventory--------------
            case "Add to Inventory":
                addInventory();
                break;

            //----------------Add New Product---------------
            case "Add New Product":
                newProduct();
                break;

        };

    });
};

// function displayTable() {
//     let query = ("SELECT * FROM products")
//     connection.query(query, function(err, res) {
//         if (err) throw err;
//         //create product table using cli-table
//         let table = new Table({
//             //set table design
//             chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
//                 , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
//                 , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
//                 , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
              
//             head: ["ID".green, "Product".green, "Dept".green, "Price".green, "Qty".green],
//         });

//         //push data to table
//         for (var i = 0; i < res.length; i++) {
//             table.push(
//                 [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price,
//                     res[i].stock_quantity]
//             );
//         };
        
//         //display table
//         console.log(table.toString());
//     });
// };

//if a manager selects view products for sale, the app should list every available item: ids, names, prices, quantities
function viewProducts() {
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
        //make recursive
        doMore();
    });
        
};

//if a manager selects view low inventory, then it should list all items with an inventory count lower than five
function lowInventory() {
    let query = ("SELECT * FROM products WHERE stock_quantity < 5") //try making this into a ? and getting 5 to fill in
    connection.query(query, function(err,res) {
        if (err) throw err;
        //create low inventory table using cli-table
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
        addInventory();
    });            
};

//if a manager selects add to inventory, should display a prompt that will let the manager add more of any item currently in the store
function addInventory() {

    inquirer.prompt([
        {
            name: "itemID",
            type: "input",
            message: "To add inventory, enter the Item ID.",
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
            message: "What quantity would you like to add?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(addItem) {
        let item = addItem.itemID;
        let qtyAdded = addItem.qty;

            //update database
            let query = ("UPDATE bamazon.products SET stock_quantity = stock_quantity + ? WHERE item_id = ?");
            connection.query(query, [qtyAdded, item], function(err,res) {
                if (err) throw err;
                console.log("\nInventory Added to Item #" + item + ".");
                console.log("----------------------------------------------".magenta);
                addMore();
            });
    });

    

};

//if a manager selects add new product, it should allow the manager to add completely new product to store
function newProduct(){
    //do i create a new table to join?  or just add new data????

    //inquirer prompt to ask what they want to add
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the item you would like to add?",
            },
            {
                type: "input",
                name: "department",
                message: "What department is this item in?",
            },
            {
                type: "input",
                name: "price",
                message: "How much is this item?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                }
            },
            {
                type: "input",
                name: "qty",
                message: "How many of these items should be added to inventory?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(add) {
            let itemName = add.name;
            let itemDept = add.department;
            let itemPrice = add.price;
            let itemQty = add.qty;
            addNew(itemName, itemDept, itemPrice, itemQty);
        });
    };    

function addNew(itemName, itemDept, itemPrice, itemQty) {

    let query = ("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + itemName + "','" + itemDept + "'," + itemPrice + ',' + itemQty + ")")
    connection.query(query, function(err, res) {
        if(err) throw err;
        console.log("\n" + itemName + " added to Inventory" + ".");
        console.log("----------------------------------------------".magenta);

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
            anotherProduct();
        });          
    });
     
};

function doMore() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to do something else?",
        },
    ]).then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
            initMgrMenu();
        } else {
            console.log("\nGreat!  Keep up the good work.".green);
            connection.end();
        }
    });
};

function addMore() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do now?",
            choices: ["Add More Inventory", "Something Else", "Leave"]
        }
    ])
    .then(function(menu) {
        //determine which code block needs to be called
        switch (menu.action) {

            //----------------View Products-----------------
            case "Add More Inventory":
                addInventory();
                break;

            case "Something Else":
                initMgrMenu();
                break;

            case "Leave":
                console.log("\nGreat!  Keep up the good work.".green);
                connection.end();
                break;
        };
    });
};

function anotherProduct() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do now?",
            choices: ["Add Another Product", "Something Else", "Leave"]
        }
    ])
    .then(function(menu) {
        //determine which code block needs to be called
        switch (menu.action) {

            //----------------View Products-----------------
            case "Add Another Product":
                newProduct();
                break;

            case "Something Else":
                initMgrMenu();
                break;

            case "Leave":
                console.log("\nGreat!  Keep up the good work.".green);
                connection.end();
                break;
        };
    });
};