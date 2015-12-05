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

    var self = Object.freeze({
        sort: function(topics, sort) {
            if (topics && topics.length) {
                return topics.sort(sort || self.SORT_HILO);
            }
            return topics;
        },
        SORT_HILO: function(a, b) {
            if (a.volume > b.volume) {
                return -1;
            } else if (a === b) {
                return 0;
            } else {
                return 1;
            }
        }
    });
    return self;
}));