describe("topicProcessor", function () {
    "use strict";

    const topics = require('../public/res/topics.json').topics,
        fixture = require('../public/js/topicProcessor'),
        _ = require('lodash');

    const SORTED = [
        {volume: 4},
        {volume: 3},
        {volume: 2},
        {volume: 1}
    ];

    it("should sort topics hilo by volume", function () {
        const result = topics.sort(fixture.sort.hilo);
        let last = result.shift().volume;
        result.forEach(function (topic) {
            expect(topic.volume <= last).toBe(true);
            last = topic.volume;
        });
    });

    it("should sort topics lohi by volume", function () {
        const result = topics.sort(fixture.sort.lohi);
        let last = result.shift().volume;
        result.forEach(function (topic) {
            expect(topic.volume >= last).toBe(true);
            last = topic.volume;
        });
    });

    it("should weight topics in arbitrary divisions with leftovers in lowest", function () {
        const result = fixture.weight.bottomHeavy(3, SORTED),
            counts = _.countBy(result, 'weight');
        expect(counts['3']).toBe(1);
        expect(counts['2']).toBe(1);
        expect(counts['1']).toBe(2);
    });

    it("should assign a score based on arbitrary property and defined zones", function () {

        const result = [{sentimentScore: 39}, {sentimentScore: 40}, {sentimentScore: 60}, {sentimentScore: 61}].map(
            _.partial(fixture.score, {
                "property": "sentimentScore",
                "output": "sentimentValue",
                "zones": [40, 61],
                "labels": ["negative", "neutral", "positive"]
            })
        );
        expect(_.pluck(result, 'sentimentValue')).toEqual(['negative', 'neutral', 'neutral', 'positive']);

    });
});