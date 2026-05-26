const express = require("express");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const cors = require("cors");
const { connectDb } = require("../src/Config/Database/DbConnection");
const CreateRoutes = require("./Helpers/Functions/Routes/CreateRoute");
const startCron = require("./Helpers/Functions/Cron/initateCron");
const routes = require('../src/Routes/Processor/index');
const cronAll = require('../src/Cron/index');
const CreateMiddleware = require("./Helpers/Functions/Middlewares/createMiddlewares");
const middleware = require('../src/Middlewares/Processor/index');
const busboy = require('connect-busboy');
const http = require('http');
const socketIO = require('socket.io');
const fileUpload = require('express-fileupload');
const establishSocketEvents = require('../src/Controllers/Controller/socket.controller')
const socketData = require("./Classes/Socket/index")
const socketManager = socketData.getInstance();
const port = Number(process.env.PORT || 50000)
const {existsSync, mkdirSync} = require("fs");
let app = express();

const server = http.createServer(app); // Create a new HTTP server instance
const io = socketIO(server, {
  path: '/socket.io/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['polling', 'websocket']
});

socketManager.setIo(io);

app.use(cors()); // Enable CORS for the Express app
app.use(express.json());
app.use(busboy());
if(!existsSync('public'))
    mkdirSync('public')
app.use('/public', express.static('public'));
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app = CreateMiddleware(app, middleware);
app = CreateRoutes(app, routes);
startCron(cronAll);

// Handle new socket connections
io.on('connection', (socket) => {
  console.log('New client connected with ID: ' + socket.id);
  establishSocketEvents(socket,socket.id)
});

connectDb()
  .then(() => {
    server.listen(port, () =>
      console.log("DB connection successfull\nserver running on port " + port)
    );
  })
  .catch((err) => console.log("DB connection failed", err.message));
