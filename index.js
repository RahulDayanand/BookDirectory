const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
const { addUser, addBook, searchBooks, addToReadingList, updateBook, getUserByReadingList, removeBookFromReadingList } = require("./service/modelService");
const { sequelize } = require("./config/database");

//MS1_Assessment_1.1: Adding Users

app.post("/api/users", addUser);

//MS1_Assessment_1.2: Adding Books

app.post("/api/books", addBook);

//MS1_Assessment_1.3: Searching for Books

app.get("/api/books/search", searchBooks);

//MS1_Assessment_1.4: Managing Reading List

app.post("/api/reading-list", addToReadingList);

//## **MS1_Assessment_1.5:Update Book Detail**

app.post("/api/books/:bookId", updateBook);

//MS1_Assessment_1.6:  Get the User's Reading List

app.get("/api/reading-list/:userId", getUserByReadingList);

//MS1_Assessment_1.7:  Remove a Book from the Reading List

app.post("/api/reading-listId", removeBookFromReadingList);

sequelize
   .authenticate()
   .then(() => {
    console.log("database connected");
   }).catch((error) => {
    console.error("Unable to connect to database", error);
   });

module.exports = {
    app,
}