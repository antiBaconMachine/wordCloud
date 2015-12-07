define(['Ractive', 'jquery', 'text!views/domCloud.html', 'json!res/topics.json', 'topicProcessor', 'lodash'], function (Ractive, $, domCloudTemplate, json, proc, _) {
    "use strict";

    Ractive.DEBUG = false;
    var domCloud = new Ractive({
        el: 'content',
        template: domCloudTemplate,
        data: {
            topics: _.shuffle(proc.weight.bottomHeavy(6, json.topics.sort(proc.sort.hilo))),
            pad: _.compose(Math.floor, function(x) {
                return x * 30;
            }, Math.random),
            verticalAlign: function() {
                var rnd = Math.floor(Math.random() * 3);
                if (rnd === 2) {
                    return "top";
                } else if (rnd === 1) {
                    return "middle";
                } else {
                    return "bottom";
                }
            },
            vertical: function() {
                return (Math.floor(Math.random() * 10) === 0) ? 'vertical' : '';
            }
        }
    });

});