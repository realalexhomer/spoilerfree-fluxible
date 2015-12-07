import Fluxible from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import RouteStore from './stores/RouteStore';

// create new fluxible instance
const app = new Fluxible({
    component: Application
});

app.plug(fetchrPlugin({
    xhrPath: '/api' // Path for XHR to be served from
}));

// register stores
app.registerStore(RouteStore);
app.registerStore(ApplicationStore);

module.exports = app;
