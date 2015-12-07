/**
 * This leverages Express to create and run the http server.
 * A Fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the application is rendered via React.
 */

import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';
import serialize from 'serialize-javascript';
import {navigateAction} from 'fluxible-router';
import debugLib from 'debug';
import React from 'react';
import ReactDOM from 'react-dom/server';
import app from './app';
import HtmlComponent from './components/Html';
import {createElementWithContext} from 'fluxible-addons-react';
import dataService from './services/data';
import steam from './services/data/steam';

const appCache = {};

steam.getTournament('3671')
.then((res) => {
    appCache.frankfurt = res;
    console.log(appCache);
})

app.use(bodyParser.json());

app.use('/api', Fetcher.middleware());


// dataService.initialize('3671')
// .catch( (err) => { throw err} )
// .then( (res) => {
//     return dataService.getAll('3671')
// })
// .catch( (err) => { throw err} )
// .then( (res) => {
//     // appCache['3671'] = res;
//     console.log('app cache is', appCache);
// })
// .catch( (err) => {
//     consle.log(err);
// })

// dataService.getAll().then( (res) => {console.log(res)}); 

const env = process.env.NODE_ENV;

const debug = debugLib('spoilerfreedota2');

const server = express();
server.use('/public', express.static(path.join(__dirname, '/build')));
server.use(compression());
server.use(bodyParser.json());

server.use((req, res, next) => {
    const context = app.createContext();

    debug('Executing navigate action');
    context.getActionContext().executeAction(navigateAction, {
        url: req.url
    }, (err) => {
        if (err) {
            if (err.statusCode && err.statusCode === 404) {
                // Pass through to next middleware
                next();
            } else {
                next(err);
            }
            return;
        }

        debug('Exposing context state');
        const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

        debug('Rendering Application component into html');
        const markup = ReactDOM.renderToString(createElementWithContext(context));
        const htmlElement = React.createElement(HtmlComponent, {
            clientFile: env === 'production' ? 'main.min.js' : 'main.js',
            context: context.getComponentContext(),
            state: exposed,
            markup: markup
        });
        const html = ReactDOM.renderToStaticMarkup(htmlElement);

        debug('Sending markup');
        res.type('html');
        res.write('<!DOCTYPE html>' + html);
        res.end();
    });
});

server.get('/api/tournament/:id', function(req, res){
})

const port = process.env.PORT || 3000;
server.listen(port);
console.log('Application listening on port ' + port);

export default server;
