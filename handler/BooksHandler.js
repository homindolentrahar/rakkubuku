const books = require("../data/Books");
const {nanoid} = require("nanoid");

const addBook = (req, h) => {
//    Payload
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload
//    Server generated
    const id = nanoid(16)
    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
//    Respond to client
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400)
    }
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        }).code(400)
    }

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }
    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0
    if (isSuccess) {
        return h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id
            }
        }).code(201)
    }
    return h.response({
        status: "error",
        message: "Buku gagal ditambahkan"
    }).code(500)
}

const getAllBooks = (req, h) => {
    //Query
    const name = req.query.name
    const reading = req.query.reading
    const finished = req.query.finished

    if (name) {
        return h.response({
            status: "success",
            data: {
                books: books
                    .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    }))
            }
        }).code(200)
    }
    if (reading) {
        return h.response({
            status: "success",
            data: {
                books: books
                    .filter((book) => book.reading === Boolean(Number(reading)))
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    }))
            }
        }).code(200)
    }
    if (finished) {
        return h.response({
            status: "success",
            data: {
                books: books
                    .filter((book) => book.finished === Boolean(Number(finished)))
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    }))
            }
        }).code(200)
    }

    return h.response({
        status: "success",
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }))
        }
    }).code(200)
}

const getBooksDetail = (req, h) => {
    const {bookId} = req.params

    const book = books.filter((book) => book.id === bookId)[0]

    if (book !== undefined) {
        return h.response({
            status: "success",
            data: {
                book: book
            }
        }).code(200)
    }

    return h.response({
        status: "fail",
        message: "Buku tidak ditemukan"
    }).code(404)
}

const editBook = (req, h) => {
//    Payload
    const {bookId} = req.params
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = req.payload
    const updatedAt = new Date().toISOString()
    const bookIndex = books.findIndex((book) => book.id === bookId)

    if (!name) {
        return h.response(({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        })).code(400)
    }
    if (readPage > pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400)
    }
    if (bookIndex === -1) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        }).code(404)
    }

    books[bookIndex] = {
        ...books[bookIndex],
        name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
    }
    return h.response({
        status: "success",
        message: "Buku berhasil diperbarui"
    }).code(200)
}

const deleteBook = (req, h) => {
    const {bookId} = req.params
    const bookIndex = books.findIndex((book) => book.id === bookId)

    if (bookIndex === -1) {
        return h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        }).code(404)
    }

    books.splice(bookIndex, 1)

    return h.response({
        status: "success",
        message: "Buku berhasil dihapus"
    }).code(200)
}

module.exports = {addBook, getAllBooks, getBooksDetail, editBook, deleteBook}