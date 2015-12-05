var requireConfig = {
    paths: {
        text: '../bower_components/requirejs-plugins/lib/text',
        json: '../bower_components/requirejs-plugins/src/json',
        //optional: 'bower_components/requirejs-optional/dist/optional',
        lodash: '../bower_components/lodash/lodash',
        Ractive: '../bower_components/ractive/ractive',
        socketio: '../bower_components/socket.io-client/socket.io',
        jquery: '../bower_components/jquery/dist/jquery',
        //Cookies: '../bower_components/js-cookie/src/js.cookie',
        views: '../views'
    }
};

var require = require || requireConfig;

if (typeof module !== "undefined" && module.exports) {
    module.exports = requireConfig;
}
