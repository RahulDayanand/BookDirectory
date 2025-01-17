const { addBook, addToReadingList, addUser } = require("../service/modelService");
const http = require("http");
const { app } = require("../server");
let server;
const request = require("supertest");

jest.mock("../service/modelService.js", () => ({
    ...jest.requireActual("../service/modelService.js"),
    addUser: jest.fn(),
    addBook: jest.fn(),
    addToReadingList: jest.fn(),
}));

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(3001, done); 
});

afterAll((done) => {
    server.close(done);
});

describe("MS1_Assesment_1.8: Writing Unit and Integration Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Add user", async () => {
        const mockUser = {
            id: 1,
            username: "kiran",
            email: "kiran@gmail.com",
        };

        addUser.mockResolvedValue(mockUser);

        const response = await request(server).post("/api/users").send({
            username: "kiran",
            email: "kiran@gmail.com",
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockUser);
    });

    it("Add Book", async () => {
        const mockBook = {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            genre: "Fiction",
            publicationYear: 1925,
        };

        addBook.mockResolvedValue(mockBook);

        const response = await request(server).post("/api/books").send({
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            genre: "Fiction",
            publicationYear: 1925,
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockBook);

    });

    it("Add Reading List", async () => {
        const mockReadingList = {
            id: 1,
            userId: 1,
            bookId: 1,
            status: "Want to Read",
        };

        addToReadingList.mockResolvedValue(mockReadingList);

        const response = await request(server).post("/api/reading-list").send({
            userId: 1,
            bookId: 1,
            status: "Want to Read",
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockReadingList);
    });
});
