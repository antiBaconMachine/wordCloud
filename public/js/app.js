define(['Ractive', 'jquery', 'text!views/hello.html'], function (Ractive, $, helloTemplate) {
    "use strict";

    Ractive.DEBUG = false;
    var hello = new Ractive({
        el: 'content',
        template: helloTemplate
    });

});