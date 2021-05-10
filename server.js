const http = require('http');
const express = require('express');
let socketio = require('socket.io');
const Room = require('./models/room');
const Player = require('./models/player');

const port = 3000;

const app = require('./app');

const { path } = require('./app');
const { disconnect } = require('process');

const server = http.createServer(app);

const io = socketio(server);