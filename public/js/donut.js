define(['jquery', 'lodash', 'config', 'd3', 'd3pie'], function ($, _, config, d3, D3pie) {
    "use strict";

    var donutId = config.donut.id;

    return function (topic) {
        $('#' + donutId).html('');
        new D3pie("donut", {
            "size": {
                "canvasHeight": 400,
                "canvasWidth": 400,
                "pieInnerRadius": "80%",
                "pieOuterRadius": "100%"
            },
            "data": {
                "sortOrder": "label-desc",
                "content": _.reduce(topic.sentiment, function (acc, v, k) {
                    acc.push({
                        "label": k,
                        "value": v,
                        "color": config.colours[k]
                    });
                    return acc;
                }, [])
            },
            "labels": {
                "outer": {
                    "format": "none",
                    "pieDistance": 10
                },
                "inner": {
                    "format": "value"
                },
                "mainLabel": {
                    "fontSize": 11
                },
                "value": {
                    "color": "#000000",
                    "fontSize": 11
                }
            },
            "misc": {
                "colors": {
                    "segmentStroke": "#000000"
                }
            }
        });
    };
});