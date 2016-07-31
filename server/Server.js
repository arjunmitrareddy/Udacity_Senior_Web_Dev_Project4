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
import dummyjson from 'dummy-json';
import fastcsv from 'fast-csv';
import customersFile from '../public/json/customers.json';
import reportsFile from '../public/json/reportedIssues.json';
import issuesFile from '../public/json/issues.json';

events.EventEmitter.prototype._maxListeners = 100;

const compressor = compression({
    flush: zlib.Z_PARTIAL_FLUSH
});
const FETCH_INTERVAL = 5000;
const GEO_CSV = '../public/csv/geo.csv';
const CUSTOMERS_JSON = '../public/json/customers.json';
const REPORTS_JSON = '../public/json/reportedIssues.json';
const ISSUES_JSON = '../public/json/issues.json';

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
            socket.on('poll-client-metrics', () => {
                this._processMetricsData(socket);
            });
            socket.on('poll-client-geo', () => {
                this._processGeoData(socket);
            });
            socket.on('poll-client-issues', () => {
                this._processIssuesData(socket);
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
    _processMetricsData(socket) {
        this._updateMetricsJson(socket);
        var timer = setInterval(() => {
            this._updateMetricsJson(socket);
        }, FETCH_INTERVAL);
        socket.on('disconnect', function () {
            clearInterval(timer);
        });
    }
    _processGeoData(socket) {
        this._updateGeoCsv(socket);
        var timer = setInterval(() => {
            this._updateGeoCsv(socket);
        }, FETCH_INTERVAL);
        socket.on('disconnect', function () {
            clearInterval(timer);
        });
    }
    _processIssuesData(socket) {
        this._updateIssuesJson(socket);
        var timer = setInterval(() => {
            this._updateIssuesJson(socket);
        }, FETCH_INTERVAL);
        socket.on('disconnect', function () {
            clearInterval(timer);
        });
    }
    _updateMetricsJson(socket) {
        customersFile.customers[customersFile.customers.length - 1] = (customersFile.customers[customersFile.customers.length - 1] > 1500) ? customersFile.customers[customersFile.customers.length - 1] : customersFile.customers[customersFile.customers.length - 1]+ this._rand(1, 10);
        for (var i=0; i<reportsFile.issues.length; i++) {
            for (var j=0; j<reportsFile.issues[i].data.length; j++) {
                if (i == reportsFile.issues.length -1) {
                    reportsFile.issues[i].data[j]  = (reportsFile.issues[i].data[j] < 5) ? reportsFile.issues[i].data[j] :  reportsFile.issues[i].data[j] - this._rand();
                }
                else {
                    reportsFile.issues[i].data[j]  = (reportsFile.issues[i].data[j] > 1500) ? reportsFile.issues[i].data[j] :  reportsFile.issues[i].data[j] + this._rand();
                }
            }
        }
        fs.writeFile(CUSTOMERS_JSON, JSON.stringify(customersFile, null, 2), (err) => {
            if (err) console.log(err);
        });
        fs.writeFile(REPORTS_JSON, JSON.stringify(reportsFile, null, 2), (err) => {
            if (err) console.log(err);
        });
        socket.emit('poll-server', {metrics: true});
    }
    _updateGeoCsv(socket) {
        var csv = [];
        fastcsv
            .fromPath(GEO_CSV)
            .on("data", (data) => {
                data[0] = (parseInt(data[0]) > 30) ? data[0] : (parseInt(data[0]) + 1).toString();
                csv.push(data);
            })
            .on("end", () => {
                fastcsv
                    .writeToPath(GEO_CSV, csv, {headers: true})
                    .on('finish', () => {
                        socket.emit('poll-server', {geo: true});
                });
            });
    }
    _updateIssuesJson(socket) {
        var d = new Date().getTime();
        var template = '{\
            "stimestamp":' + '"' + d + '"' + ',\
            "customername": "{{firstName}}",\
            "customeremail": "{{email}}",\
            "description": ' + '"' + "New Issue Lorem Ipsum" + '"' + ',\
            "status": false,\
            "closedtimestamp": null,\
            "employeename": "{{firstName}}"\
        }';
        var issue = dummyjson.parse(template);
        issuesFile.push(JSON.parse(issue));
        fs.writeFile(ISSUES_JSON, JSON.stringify(issuesFile, null, 2), (err) => {
            if (err) console.log(err);
        });
        socket.emit('poll-server', {issues: true});
    }
    _rand(min=0, max=5) {
        return Math.round(Math.random() * (max - min) + min);
    }
    _uuid() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
}