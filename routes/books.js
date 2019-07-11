
const bookRoutes = (app, fs) => {
    // variables
    const dataPath = './database.json';

    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/books', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            let bookList = JSON.parse(data).books;
            console.log("Books List read method");
            res.send(bookList);
        });
    });

    // CREATE
    app.post('/books', (req, res) => {

        readFile(data => {
            let BookISBN = req.body.data.isbn;
            // add the new book
            console.log("Books create method");
            if(data.books.filter(book => book.isbn == BookISBN).length ){
              res.status(200).send({message: "Book with ISBN " + BookISBN + " exist already."});
            }else{
              data.books.push(req.body.data);
              writeFile(JSON.stringify(data, null, 2), () => {
                  res.status(200).send({message: 'New book added.'});
              });
            }
        },
            true);
    });

    // UPDATE
    app.put('/books/:isbn', (req, res) => {

        readFile(data => {

            // add the new book
            const isbn = req.params["isbn"];
            let index = data.books.findIndex(x => x.isbn === isbn);
            console.log("Books Update method");
            if(index < 0){
              data.books.push(req.body.data);
              writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send({message: `Book with ISBN ${isbn} not exist for update. Inserted new one.`});
              });
            }else{
              data.books[index] = req.body.data;
              writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send({message: `Books with ISBN: ${isbn} updated.`});
              });
            }


        },
            true);
    });

    // DELETE
    app.delete('/books/:isbn', (req, res) => {
        readFile(data => {
            // add the new book
            const isbn = req.params["isbn"];
            let index = data.books.findIndex(x => x.isbn === isbn);
            console.log("Books Delete method");
            if(index < 0){
              res.status(200).send({message: `Book with ISBN: ${isbn} not exist for delete.`});
            }else{
              data.books.splice(index, 1);
              writeFile(JSON.stringify(data, null, 2), () => {
                  res.status(200).send({message: `Book with ISBN: ${isbn} removed.`});
              });
            }
        },
            true);
    });
};

module.exports = bookRoutes;
