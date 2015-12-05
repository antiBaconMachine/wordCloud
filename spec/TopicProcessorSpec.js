describe("topicProcessor", function () {
    "use strict";

    const topics = require('../public/res/topics.json'),
        TopicProcessor = require('../public/js/TopicProcessor'),
        _ = require('lodash');

    let fixture;

    it("should return null when no json is provided", function () {
        expect(new TopicProcessor().process()).toBeNull();
    });

    describe("when ititialised with json", function () {
        beforeEach(function () {
            fixture = new TopicProcessor(topics);
        });

        it("should sort topics by volume", function () {
            const result = fixture.process();
            let last = result.shift().volume;
            result.forEach(function (topic) {
                expect(topic.volume <= last).toBe(true);
                last = topic.volume;
            });
            //console.log(_.pluck(result, 'volume'));
        });
    });
});