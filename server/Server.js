/**
 * Created by arjunMitraReddy on 7/16/2016.
 */
import express from 'express';
import zlib from 'zlib';
import compression from 'compression';
import http from 'http';
import path from 'path';
import request from 'request';
import fs from 'fs';
import bodyParser from 'body-parser';
import socketio from 'socket.io';
import events from 'events';
import yearsFile from '../public/json/years.json'
import reportsFile from '../public/json/reports.json'
events.EventEmitter.prototype._maxListeners = 100;

const compressor = compression({
    flush: zlib.Z_PARTIAL_FLUSH
});
const FETCH_INTERVAL = 3000;
const YEARS_JSON = '../public/json/years.json';
const REPORTS_JSON = '../public/json/reports.json';

export default class Server {
    constructor(port) {
        this._app = express();
        this._port = port;
        this._appServerUp = false;
        this._appServer = http.createServer(this._app);
        this._sio = socketio.listen(this._appServer);
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(bodyParser.json());
        this._serveStaticFiles();
        this._app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../public/index.html'));
        });
        this._sio.sockets.on('connection', (socket) => {
            socket.on('randomize', () => {
                this._processRandomData(socket);
            })
        })
    }
    _serveStaticFiles() {
        this._app.use('/js', express.static('../public/js'));
        this._app.use('/styles', express.static('../public/styles'));
        this._app.use('/imgs', express.static('../public/imgs'));
        this._app.use('/fonts', express.static('../public/fonts'));
        this._app.use('/templates', express.static('../public/templates'));
        this._app.use('/json', express.static('../public/json'));
        this._app.use('/csv', express.static('../public/csv'));
        this._app.use('/bower_components', express.static('../../bower_components'));
    }
    _listen() {
        if (!this._appServerUp) {
            this._appServer.listen(process.env.PORT || this._port, _ => {
                console.log("\n\n ***** Server Listening on localhost:" + this._port + " ***** \n\n");
            });
            this._appServerUp = true;
        }
    }
    _processRandomData(socket) {
        this._updateJson(socket);
        var timer = setInterval(() => {
            this._updateJson(socket);
        }, FETCH_INTERVAL);
        socket.on('disconnect', function () {
            clearInterval(timer);
        });
    }
    _updateJson(socket) {
        yearsFile.customers[yearsFile.customers.length - 1] = (yearsFile.customers[yearsFile.customers.length - 1] > 1200) ? this._rand(300, 500) :  yearsFile.customers[yearsFile.customers.length - 1] + this._rand();
        for (var i=0; i<reportsFile.issues.length; i++) {
            for (var j=0; j<reportsFile.issues[i].data.length; j++) {
                reportsFile.issues[i].data[j] = (reportsFile.issues[i].data[j] > 300) ? this._rand(50, 100) :  reportsFile.issues[i].data[j] + this._rand();
            }
        }
        fs.writeFile(YEARS_JSON, JSON.stringify(yearsFile, null, 2), (err) => {
            if (err) console.log(err);
        });
        fs.writeFile(REPORTS_JSON, JSON.stringify(reportsFile, null, 2), (err) => {
            if (err) console.log(err);
        });
        socket.emit('randomReady', {done: "done"});
    }
    _rand(min=0, max=200) {
        return Math.round(Math.random() * (max - min) + min);
    }
}