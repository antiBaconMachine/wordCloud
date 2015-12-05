(function (root, factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.myModule = factory();
    }

}(this, function () {
    "use strict";

    var cstr = function(json, processors) {
        this.json = json;
        this.processors = processors;

    };

    cstr.prototype = {
        process: function() {
            var json = this.json;
            if (json && json.topics && json.topics.length) {

                var sorted = json.topics.sort(function(a, b) {
                    if (a.volume > b.volume) {
                        return -1;
                    } else if (a === b) {
                        return 0;
                    } else {
                        return 1;
                    }
                });

                //json.topics.reduce(function(acc, topic) {
                //
                //}, []);

                return sorted;
            }
            return null;
        }
    };

    return cstr;

}));