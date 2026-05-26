function CreateRoutes(app,routes) {
    routes.forEach(({url,routerObj}) => app.use(url,routerObj));
    return app
}

module.exports=CreateRoutes