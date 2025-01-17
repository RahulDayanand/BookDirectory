const { User, Book, ReadingList } = require("../models");

const addUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        if(!username || !email) {
            return res.status(400).json({ message: "Username/Email is required" });
        }

        if(typeof username !== 'string') {
            return res.status(400).json({ message: "Username must be in string format" });
        }

        if(typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ message: "Email should be formatted properly" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if(existingUser) {
            return res.status(400).json({  "message": "Email already exists" });
        }

        const newUser = await User.create({
            username,
            email
        });

        res.status(201).json({ "message": "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while adding the user details ", error });
    }
}

const addBook = async (req, res) => {
    try {
       const { title, author, genre, publicationYear } = req.body;

       if(!title || !author || !genre || !publicationYear) {
         return res.status(400).json({ "message": "Book title,author,genre and publicationYear are required" });
       }

       if(typeof title !== 'string' || typeof author !== 'string' || typeof genre !== 'string' || typeof publicationYear !== 'number') {
         return res.status(400).json("Required fields should be formatted properly");
       }

       const newBook = await Book.create({
        title,
        author,
        genre,
        publicationYear
       });

       res.status(201).json({ "message": "Book added successfully" , book: newBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while adding the book details ", error });
    }
}

const searchBooks = async(req, res) => {
    try {
        const { title, author } = req.query;

        if(!title || !author) {
            return res.status(400).json({ "message": "Book title and author are required" });
        }

        const books = await Book.findAll({ where: { title, author } });

        if(books.length === 0) return res.status(404).json({ message: "Books not found" });

        res.json({ books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while searching the book details ", error });
    }
}

const addToReadingList = async (req, res) => {
    try {
        const { userId, bookId, status } = req.body;
 
        if(!userId || !bookId || !status) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const Status = ["Want to Read", "Reading", "Finished"];

        if(!Status.includes(status)) {
            return res.status(400).json({ message: "status field is not formatted properly" });
        }

        const existingUser = await User.findByPk(userId);

        const existingBook = await Book.findByPk(bookId);

        if(!existingUser || !existingBook) return res.status(404).json({ "message": "Invalid user or book ID" })

        const readingList = await ReadingList.create({
            userId,
            bookId,
            status,
        });

        res.status(201).json({"message": "Book added to reading list", readingList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while adding the reading list details ", error });
    }
}

const updateBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const existingBook = await Book.findByPk(bookId);
        const updateBook = req.body;

        if(!existingBook) return res.status(404).json({ message: "Book not found" });

        existingBook.set(updateBook);

        const response = await existingBook.save();
        res.json({ "message": "Book details updated successfully", book: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while updating the book details ", error });
    }
}

const getUserByReadingList = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findByPk(userId);
        if(!user) return res.status(404).json({ "message": "User not found or no books in reading list" });

        const findReadingList = await ReadingList.findAll({ where: { userId } });
        const readingList = [];

        for(const list of findReadingList) {
           const book = await Book.findOne({ where: { id: list.bookId } }); 
           readingList.push({
            "id": list.id,
            "userId": list.userId,
            "status": list.status,
            "books": {
                "title": book.title,
                "author": book.author,
                "genre": book.genre
            }
           })
        }

        res.json({ readingList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while fetching the reading list details ", error });
    }
}

const removeBookFromReadingList = async (req, res) => {
    try {
        const { readingListId } = req.body;

        if(!readingListId) return res.status(400).json({ message: "readingListId is required" });

        const readingList = await ReadingList.findByPk(readingListId);

        if(!readingList) return res.status(404).json({ message: "Reading list entry not found" });

        await ReadingList.destroy({ where: { id: readingListId } });
  
        res.json({ "message": "Book removed from reading list" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while deleting the book from the reading list details ", error });
    }
}

module.exports = {
    addUser,
    addBook,
    searchBooks,
    addToReadingList,
    updateBook,
    getUserByReadingList,
    removeBookFromReadingList,
}