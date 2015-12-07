describe("topicProcessor", function () {
    "use strict";

    const topics = require('../public/res/topics.json').topics,
        fixture = require('../public/js/topicProcessor'),
        _ = require('lodash');

    const SORTED = [
        {volume: 130},
        {volume: 120},
        {volume: 110},
        {volume: 10},
        {volume: 90},
        {volume: 80},
        {volume: 70},
        {volume: 60},
        {volume: 50},
        {volume: 40},
        {volume: 30},
        {volume: 20},
        {volume: 10}
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
        const result = fixture.weight.bottomHeavy(6, SORTED),
            counts = _.countBy(result, 'weight');
        expect(counts['6']).toBe(2);
        expect(counts['5']).toBe(2);
        expect(counts['4']).toBe(2);
        expect(counts['3']).toBe(2);
        expect(counts['2']).toBe(2);
        expect(counts['1']).toBe(3);
    });

    it("should weight topics on a static curve with the top item having the largest weight", function() {
        const result = fixture.weight.bottomHeavySquare(6, SORTED),
            counts = _.countBy(result, 'weight');
        expect(counts['6']).toBe(1);
        expect(counts['5']).toBe(2);
        expect(counts['4']).toBe(4);
        expect(counts['3']).toBe(6);
        expect(counts['2']).toBeUndefined();
        expect(counts['1']).toBeUndefined();
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