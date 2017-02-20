# metalsmith-relations

A [Metalsmith][metalsmith-url] plugin that computes related documents for each document in a collection.

[![Dependencies][dependencies-badge]][dependencies-url]
[![NPM Version][npm-version-badge]][npm-url]
[![License][github-license-badge]](LICENCE)

This project is similar to [metalsmith-related][metalsmith-related-url], but favors property matching over globbing. This is the same approach that [metalsmith-permalinks][metalsmith-permalinks-url] uses, which typically depends on [metalsmith-collections][metalsmith-collections-url]. There is no real difference other than that. It's written in TypeScript, but the algorithm and supporting library, [natural][natural-url], are the same.

## Use

```
$ npm install metalsmith-relations
```

Then in your build script:

```javascript
const Metalsmith  = require('metalsmith');
const markdown    = require('metalsmith-markdown');
const relations   = require('metalsmith-relations');
const collections = require('metalsmith-collections');

Metalsmith(__dirname)
.use(collections())
.use(relations({
  match: {
    collection: 'posts' // or whatever
  },
  terms: 5,
  max: 5,
  threshold: 0,
  text: document => String(document.content)
}))
.use(markdown())
.build((error, files) => {
  if(error) { throw error }
});
```

[github-license-badge]: https://img.shields.io/github/license/tjpeden/metalsmith-relations.svg
[npm-version-badge]: https://img.shields.io/npm/v/metalsmith-relations.svg
[dependencies-badge]: https://david-dm.org/tjpeden/metalsmith-relations.svg
[dependencies-url]: https://david-dm.org/tjpeden/metalsmith-relations
[npm-url]: https;//www.npmjs.com/package/metalsmith-relations
[metalsmith-url]: http://www.metalsmith.io/
[metalsmith-related-url]: https://www.npmjs.com/package/metalsmith-related
[metalsmith-permalinks-url]: https://www.npmjs.com/package/metalsmith-permalinks
[metalsmith-collections-url]: https://www.npmjs.com/package/metalsmith-collections
[natural-url]: https://www.npmjs.com/package/natural
