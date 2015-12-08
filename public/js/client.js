define(['Ractive', 'jquery', 'text!views/domCloud.html', 'json!res/topics.json', 'topicProcessor', 'lodash',
        'config', 'text!views/layout.html', 'text!views/sideBar.html', 'donut', 'tab', 'text!views/spiralCloud.html', 'spiral'],
    function (Ractive, $, tDomCloud, json, proc, _, config, tLayout, tSideBar, donut, tab, tSprialCloud, spiral) {
        "use strict";

        var CONST = Object.freeze({
            weights: {
                exp: proc.weight.bottomHeavyExp,
                eql: proc.weight.bottomHeavy
            }
        });

        var topics = _.shuffle((CONST.weights[config.weight.default])(config.weight.divisions, json.topics.sort(proc.sort.hilo))
            .map(_.compose(
                function (topic) {
                    topic.seed = Math.floor(Math.random() * 5);
                    topic.s_top = -1000;
                    topic.s_left = -1000;
                    return topic;
                },
                _.partial(proc.score, config.score))
            ));

        var lookup = function (id) {
            var indexed = _.indexBy(topics, 'id');
            lookup = function (id) {
                return indexed[id];
            };
            return lookup(id);
        };

        Ractive.DEBUG = false;
        var ractive = new Ractive({
            el: 'content',
            template: tLayout,
            partials: {
                domCloud: tDomCloud,
                spiralCloud: tSprialCloud,
                sideBar: tSideBar
            },
            data: {
                topics: topics,
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
                str: function (a) {
                    return JSON.stringify(a);
                }
            }
        });

        ractive.on('selectTopic', function (event) {
            var $node = $(event.node),
                id = $node.data('topic'),
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

        ractive.on('complete', function () {
            _.defer(function () {
                ractive.set('topics', spiral(lookup));
            });
        });

    });