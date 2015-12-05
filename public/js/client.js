define(['Ractive', 'jquery', 'text!views/domCloud.html', 'json!res/topics.json', 'topicProcessor', 'lodash'], function (Ractive, $, domCloudTemplate, json, proc, _) {
    "use strict";

    Ractive.DEBUG = false;
    var domCloud = new Ractive({
        el: 'content',
        template: domCloudTemplate,
        data: {
            topics: _.shuffle(proc.weight.bottomHeavy(6, json.topics.sort(proc.sort.hilo)))
        }
    });

});