const bookRoutes = require('./books');

const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    // // other routes
    bookRoutes(app, fs);

};

module.exports = appRouter;
