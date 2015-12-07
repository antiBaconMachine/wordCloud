define(['Ractive', 'jquery', 'text!views/domCloud.html', 'json!res/topics.json', 'topicProcessor', 'lodash', 'config', 'text!views/layout.html', 'text!views/sideBar.html', 'd3', 'd3pie'],
    function (Ractive, $, tDomCloud, json, proc, _, config, tLayout, tSideBar, d3, D3pie) {
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
                topics: _.shuffle(proc.weight.bottomHeavyExp(6, json.topics.sort(proc.sort.hilo)))
                    .map(_.compose(
                        function(topic) {
                            topic.seed = Math.floor(Math.random() * 5);
                            return topic;
                        },
                        _.partial(proc.score, config.score))
                    ),
                focussed: null,
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

        ractive.on('selectTopic', function (event) {
            var id = $(event.node).data('topic'),
                topic = lookup(id);
            ractive.set('focussed', topic);
            if (topic) {
                donut(topic);
            }
        });

        ractive.on('dodgeChanged', function (event) {
            $('body').toggleClass('dodge', event.node.checked);
        });

        var lookup = function (id) {
            var indexed = _.indexBy(json.topics, 'id');
            lookup = function (id) {
                return indexed[id];
            };
            return lookup(id);
        };

        var donut = function (topic) {
            $('#' + CONST.donutId).html('');
            new D3pie("donut", {
                "size": {
                    "canvasHeight": 400,
                    "canvasWidth": 400,
                    "pieInnerRadius": "80%",
                    "pieOuterRadius": "70%"
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