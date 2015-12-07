define(['Ractive', 'jquery', 'text!views/domCloud.html', 'json!res/topics.json', 'topicProcessor', 'lodash', 'config', 'text!views/layout.html', 'text!views/sideBar.html', 'd3', 'd3pie'],
    function (Ractive, $, tDomCloud, json, proc, _, config, tLayout, tSideBar, d3, d3pie) {
        "use strict";

        var CONST = Object.freeze({
            donutId: "donut"
        });

        Ractive.DEBUG = false;
        var ractive = new Ractive({
            el: 'content',
            template: tLayout,
            partials: {
                domCloud: tDomCloud,
                sideBar: tSideBar
            },
            data: {
                topics: _.shuffle(proc.weight.bottomHeavy(6, json.topics.sort(proc.sort.hilo)))
                    .map(_.partial(proc.score, {
                        "property": "sentimentScore",
                        "output": "sentimentValue",
                        "zones": [40, 61],
                        "labels": ["negative", "neutral", "positive"]
                    })),
                focussed: null,
                pad: _.compose(Math.floor, function (x) {
                    return x * 30;
                }, Math.random),
                verticalAlign: function () {
                    var rnd = Math.floor(Math.random() * 3);
                    if (rnd === 2) {
                        return "top";
                    } else if (rnd === 1) {
                        return "middle";
                    } else {
                        return "bottom";
                    }
                },
                vertical: function () {
                    //return (Math.floor(Math.random() * 10) === 0) ? 'vertical' : '';
                    return '';
                },
                str: function (a) {
                    return JSON.stringify(a);
                }
            }
        });

        ractive.on('selectTopic', function(event) {
            var id = $(event.node).data('topic');
            ractive.set('focussed', id);
            donut(id);
        });

        var donut = function(id) {
            $('#' + CONST.donutId).html('');
            new d3pie("donut", {
                "header": {
                    "title": {
                        "text": "Top 15 Fears",
                        "fontSize": 34,
                        "font": "courier"
                    },
                    "subtitle": {
                        "text": "What strikes the most terror in people?",
                        "color": "#999999",
                        "fontSize": 10,
                        "font": "courier"
                    },
                    "location": "pie-center",
                    "titleSubtitlePadding": 10
                },
                "footer": {
                    "text": "* This was curious. We're not sure why over several people regard Winnipeg as a Top 15 Fear.",
                    "color": "#999999",
                    "fontSize": 10,
                    "font": "open sans",
                    "location": "bottom-left"
                },
                "size": {
                    "canvasHeight": 300,
                    "canvasWidth": 300,
                    "pieInnerRadius": "80%",
                    "pieOuterRadius": "70%"
                },
                "data": {
                    "sortOrder": "label-desc",
                    "content": [
                        {
                            "label": "Spiders",
                            "value": 2,
                            "color": "#333333"
                        },
                        {
                            "label": "Mother-in-laws",
                            "value": 10,
                            "color": "#444444"
                        },
                        {
                            "label": "Sharks",
                            "value": 8,
                            "color": "#555555"
                        },
                        {
                            "label": "Alien invasion",
                            "value": 8,
                            "color": "#666666"
                        },
                        {
                            "label": "Learning Objective-C",
                            "value": 5,
                            "color": "#777777"
                        },
                        {
                            "label": "Public speaking",
                            "value": 3,
                            "color": "#888888"
                        },
                        {
                            "label": "Donald Rumsfeld",
                            "value": 4,
                            "color": "#999999"
                        },
                        {
                            "label": "The Zombie Apocalypse",
                            "value": 4,
                            "color": "#cb2121"
                        },
                        {
                            "label": "The City of Winnipeg *",
                            "value": 3,
                            "color": "#830909"
                        },
                        {
                            "label": "IE 6",
                            "value": 2,
                            "color": "#923e99"
                        },
                        {
                            "label": "Planes with/out snakes",
                            "value": 5,
                            "color": "#ae83d5"
                        },
                        {
                            "label": "Off-by-one errors",
                            "value": 3,
                            "color": "#111111"
                        },
                        {
                            "label": "Chickadees",
                            "value": 4,
                            "color": "#050505"
                        },
                        {
                            "label": "A never-ending Harper Government",
                            "value": 1,
                            "color": "#646464"
                        },
                        {
                            "label": "Canada",
                            "value": 4,
                            "color": "#747474"
                        }
                    ]
                },
                "labels": {
                    "outer": {
                        "format": "label-percentage1",
                        "pieDistance": 20
                    },
                    "inner": {
                        "format": "none"
                    },
                    "mainLabel": {
                        "fontSize": 11
                    },
                    "percentage": {
                        "color": "#999999",
                        "fontSize": 11,
                        "decimalPlaces": 0
                    },
                    "value": {
                        "color": "#cccc43",
                        "fontSize": 11
                    },
                    "lines": {
                        "enabled": true,
                        "color": "#777777"
                    },
                    "truncation": {
                        "enabled": true
                    }
                },
                "effects": {
                    "pullOutSegmentOnClick": {
                        "effect": "linear",
                        "speed": 400,
                        "size": 8
                    }
                },
                "misc": {
                    "colors": {
                        "segmentStroke": "#000000"
                    }
                }
            });
        }

    });