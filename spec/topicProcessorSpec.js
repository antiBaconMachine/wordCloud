describe("topicProcessor", function () {
    "use strict";

    const topics = require('../public/res/topics.json').topics,
        fixture = require('../public/js/topicProcessor'),
        _ = require('lodash');


    it("should return falsy when no json is provided", function () {
        expect(fixture.sort()).toBeFalsy();
    });

    it("should sort topics by volume", function () {
        const result = fixture.sort(topics);
        let last = result.shift().volume;
        result.forEach(function (topic) {
            expect(topic.volume <= last).toBe(true);
            last = topic.volume;
        });
        //console.log(_.pluck(result, 'volume'));
    });

    it("should apply processors to the topics in the given order", function () {

        const sorted = fixture.sort(topics),
            processed = sorted.map(_.compose.apply(_, [
                function (topic) {
                    topic.volume *= 2;
                    return topic;
                },
                function (topic) {
                    topic.volume += 2;
                    return topic;
                },
                function (topic) {
                    topic.volume *= 0.5;
                    return topic;
                },
                function (topic) {
                    topic.volume -= 1;
                    return topic;
                }
            ]));
        expect(processed).toEqual(sorted);

    });
});