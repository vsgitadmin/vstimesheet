
function CreateMiddleware(app,routes) {
    routes.forEach(({middleware}) => app.use(middleware));
    return app
}

module.exports=CreateMiddleware