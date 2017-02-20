"use strict";
var natural_1 = require("natural");
function relations(options) {
    options = Object.assign({
        terms: 5,
        max: 5,
        threshold: 0,
        text: function (document) { return String(document.content); }
    }, options);
    if (options.match == null) {
        throw new Error("Expected match criteria on which to filter.");
    }
    function matchDocument(document) {
        var match = options.match;
        return Object.keys(match).every(function (key) {
            if (document[key] === match[key]) {
                return true;
            }
            if (document[key] && document[key].indexOf) {
                return document[key].indexOf(match[key]) > -1;
            }
            return false;
        });
    }
    return function (documents, metalsmith, done) {
        var tfidf = new natural_1.TfIdf();
        var keys = Object.keys(documents).filter(function (key) { return matchDocument(documents[key]); });
        keys.forEach(function (key) { return tfidf.addDocument(options.text(documents[key]), key); });
        keys.forEach(function (key, index) {
            var document = documents[key];
            var keyTerms = tfidf.listTerms(index)
                .slice(0, options.terms)
                .map(function (_a) {
                var term = _a.term;
                return term;
            });
            document.relations = keys.reduce(function (relations, key, d) {
                if (d !== index) {
                    var frequency = tfidf.tfidf(keyTerms, d);
                    if (frequency > options.threshold) {
                        relations.push({ key: key, frequency: frequency });
                    }
                }
                return relations;
            }, [])
                .sort(function (a, b) { return a.frequency - b.frequency; })
                .slice(0, options.max)
                .map(function (_a) {
                var key = _a.key;
                return documents[key];
            });
        });
        done();
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = relations;
//# sourceMappingURL=index.js.map