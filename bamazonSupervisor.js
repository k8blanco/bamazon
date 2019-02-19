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
    //call function to initialize 
 
});