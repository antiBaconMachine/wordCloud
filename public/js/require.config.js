var requireConfig = {
    paths: {
        text: '../bower_components/requirejs-plugins/lib/text',
        json: '../bower_components/requirejs-plugins/src/json',
        lodash: '../bower_components/lodash/lodash',
        Ractive: '../bower_components/ractive/ractive',
        jquery: '../bower_components/jquery/dist/jquery',
        d3: '../bower_components/d3/d3',
        d3pie: '../bower_components/d3pie/d3pie/d3pie',
        views: '../views',
        res: '../res'
    }
};

var require = require || requireConfig;

if (typeof module !== "undefined" && module.exports) {
    module.exports = requireConfig;
}
