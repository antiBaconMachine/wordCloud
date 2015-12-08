define(['Ractive', 'jquery', 'text!views/domCloud.html', 'json!res/topics.json', 'topicProcessor', 'lodash',
        'config', 'text!views/layout.html', 'text!views/sideBar.html', 'd3', 'd3pie', 'tab', 'text!views/canvasCloud.html', 'quadtree'],
    function (Ractive, $, tDomCloud, json, proc, _, config, tLayout, tSideBar, d3, D3pie, tab, tCanvasCloud, quadtree) {
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

        ractive.on('weightChanged', function (event) {
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
                    function (topic) {
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

        var d3Cloud = function (spiralSize) {
            var center = spiralSize / 2;
            window.spiral = spiral;

            var quad = new Quadtree({
                    width: spiralSize,
                    height: spiralSize
                }),
                pad = 2;

            var nodes = d3.select('#svgCloud')
                .attr('width', spiralSize)
                .attr('height', spiralSize)
                .selectAll('text')
                .data(_.shuffle(buildTopics()))
                .enter().append('text')
                .text(function (d) {
                    return d.label;
                })
                .attr('font-size', function (d) {
                    return (d.weight * 10) + 'px';
                })
                .style('dominant-baseline', 'central')
                .attr("text-anchor", "middle");

            nodes.each(function (d) {
                var i = 0,
                    bbox = this.getBBox(),
                    next = (function () {
                        var j = 0;
                        return function () {
                            j = j + 50;
                            return spiral(j);
                        }
                    }()),
                    pad = 2,
                    point,
                    rect;

                do {
                    var xy = next(),
                        x = xy[0] + center,
                        y = xy[1] + center;

                    point = {
                        x: x,
                        y: y
                    };

                    rect = {
                        x: x - pad,
                        y: y - pad,
                        width: bbox.width + pad,
                        height: bbox.height + pad
                    };
                    var collisions = quad.colliding(rect);
                    console.log(collisions);
                    if (!collisions || !collisions.length) {
                        break;
                    }

                    //TODO: better failsafe condition, maxDelta?
                } while (i++ < 500);
                d3.select(this).attr(_.extend(point, {
                    class: " sentiment_" + d.sentimentValue
                }));
                quad.push(rect);
            });


            //window.nodes = nodes;
        };

        function spiral(t) {
            return [(t *= .1) * Math.cos(t), t * Math.sin(t)];
        }

        _.defer(_.partial(d3Cloud, 800));

    });