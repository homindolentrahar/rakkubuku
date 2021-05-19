const {addBook, getAllBooks, getBooksDetail, editBook, deleteBook} = require("../handler/BooksHandler");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBook,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBooksDetail,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBook,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBook,
    }
]

module.exports = routes