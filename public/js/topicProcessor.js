(function (root, factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['lodash'], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require('lodash'));
    } else {
        root.myModule = factory(root._);
    }

}(this, function (_) {
    "use strict";

    var hilo = function (a, b) {
        if (a.volume > b.volume) {
            return -1;
        } else if (a === b) {
            return 0;
        } else {
            return 1;
        }
    };

    var self = {
        sort: {
            hilo: hilo,
            lohi: _.compose(
                function (n) {
                    return n * -1;
                }, hilo)
        },
        weight: {
            bottomHeavy: function (divisions, sorted) {
                var total = sorted.length,
                    dLen = Math.floor(Math.max(1, total / divisions));

                var div = divisions + 1;
                return sorted.map(function (topic, i) {
                    if ((i % dLen) === 0) {
                        div--;
                    }
                    topic.weight = Math.max(1, div);
                    return topic;
                });
            },
            bottomHeavyExp: function (divisions, sorted) {
                var length = sorted.length,
                    base = Math.pow(length, (1 / divisions)),
                    div = divisions,
                    rollover = base;

                return sorted.map(function (topic, i) {
                    if (i+1 >= rollover) {
                        div--;
                        rollover = rollover * base;
                    }
                    topic.weight = Math.max(1, div);
                    return topic;
                });
            }
        },
        score: function(spec, topic) {
            var score = topic[spec.property],
                last = -Infinity,
                label = spec.labels[spec.labels.length - 1];

            spec.zones.every(function(zone, i) {
                if (score >= last && score < zone) {
                    label = spec.labels[i];
                    return false;
                } else {
                    last = zone;
                    return true;
                }
            });

            topic[spec.output] = label;
            return topic;
        }
    };

    return Object.freeze(self);
}));