define(['Ractive', 'jquery', 'text!views/domCloud.html', 'json!res/topics.json', 'topicProcessor', 'lodash',
    'config', 'text!views/layout.html', 'text!views/sideBar.html', 'd3', 'd3pie', 'tab', 'text!views/canvasCloud.html'],
    function (Ractive, $, tDomCloud, json, proc, _, config, tLayout, tSideBar, d3, D3pie, tab, tCanvasCloud) {
        "use strict";

        var CONST = Object.freeze({
            donutId: "donut",
            weights: {
                exp: proc.weight.bottomHeavyExp,
                eql: proc.weight.bottomHeavy
            }
        });

        Ractive.DEBUG = false;
        var ractive = new Ractive({
            el: 'content',
            template: tLayout,
            partials: {
                domCloud: tDomCloud,
                sideBar: tSideBar,
                canvasCloud: tCanvasCloud
            },
            data: {
                topics: buildTopics(),
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
                },
                shuffle: _.shuffle
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

        ractive.on('weightChanged', function(event) {
            var topics = ractive.get('topics'),
                weight = CONST.weights[event.node.value];
            if (weight) {
                ractive.set('topics', weight(config.weight.divisions, topics));
            }
        });

        ractive.on('')

        function buildTopics() {
            return (CONST.weights[config.weight.default])(config.weight.divisions, json.topics.sort(proc.sort.hilo))
                .map(_.compose(
                    function(topic) {
                        topic.seed = Math.floor(Math.random() * 5);
                        return topic;
                    },
                    _.partial(proc.score, config.score))
                );
        }

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

        var d3Cloud = function(spiralSize) {
            var spiral = archimedeanSpiral([spiralSize, spiralSize]),
                next = (function(){
                    var i = 0;
                    return function() {
                        i = i + 50;
                        return spiral(i);
                    }
                }()),
                center = spiralSize / 2;
                window.spiral = spiral;


            var quad = new d3.geom.quadtree([]);

            var nodes = d3.select('#svgCloud')
                .attr('width', spiralSize)
                .attr('height', spiralSize)
                .selectAll('text')
                .data(_.shuffle(buildTopics()))
                .enter().append('text')
                .text(function(d) {
                    return d.label;
                })
                .each(function(d) {
                    var xy = next();

                    //var rect = {
                    //    x: xy[0],
                    //    y: xy[1],
                    //    height: d.height,
                    //    width: d.width
                    //};
                    //console.dir(rect);

                    d3.select(this).attr({
                        class: "weight_" + d.weight + " sentiment_" + d.sentimentValue,
                        x: center + xy[0],
                        y: center + xy[1]
                    })
                })
                .style('dominant-baseline', 'central');


            window.nodes = nodes;
        };

        function archimedeanSpiral(size) {
            var e = size[0] / size[1];
            return function(t) {
                return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
            };
        }

        d3Cloud(800);

    });