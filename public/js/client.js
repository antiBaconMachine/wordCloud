define(['Ractive', 'jquery', 'text!views/hello.html', 'json!res/topics.json'], function (Ractive, $, helloTemplate, topics) {
    "use strict";

    Ractive.DEBUG = false;
    var hello = new Ractive({
        el: 'content',
        template: helloTemplate,
        data: {
            json: JSON.stringify(topics)
        }
    });

    

});