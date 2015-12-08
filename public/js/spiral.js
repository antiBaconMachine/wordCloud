define(['jquery', 'lodash', 'quadtree', 'config'], function($, _, Quadtree, config) {
    "use strict";

    function spiral(t) {
        return [(t *= 0.1) * Math.cos(t), t * Math.sin(t)];
    }

    return function (lookup) {

        console.log("laying out spiral");

        var spiralSize = 800,
            center = (spiralSize / 2),
            quad = new Quadtree({
                width: spiralSize,
                height: spiralSize
            }),
            pad = 5,
            topics = [];


        $('.spiralNode').each(function (index, node) {
            var $node = $(node),
                topicId = $node.data('topic'),
                topic = lookup(topicId),
                i = 0,
                next = (function () {
                    var j = 0;
                    return function () {
                        j = j + (Math.random() * 50);
                        return spiral(j);
                    };
                }()),
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
                    width: $node.width() + pad,
                    height: $node.height() + pad
                };
                var collisions = quad.colliding(rect);

                if (!collisions.length) {
                    break;
                }

                //TODO: better failsafe condition, maxDelta?
            } while (i++ < 500);

            quad.push(rect);
            topic.s_left = rect.x;
            topic.s_top = rect.y;
            topics.push(topic);
        });

        return topics;
    };

});