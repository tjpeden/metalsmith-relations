import {TfIdf} from 'natural';

interface Hash {
  [name: string]: any;
}

interface Document extends Hash {
  content: string;
  relations?: Array<Document>;
}

interface DocumentHash {
  [name: string]: Document;
}

interface TextFn {
  (document: Hash): string;
}

interface Options {
  match: Hash;
  terms?: number;
  max?: number;
  threshold?: number;
  text: TextFn;
}

interface DoneFn {
  (): void;
}

interface MetalsmithPlugin {
  (documents: DocumentHash, metalsmith: Hash, done: DoneFn): void;
}

export default function relations(options: Options) {
  options = Object.assign({
    terms: 5,
    max: 5,
    threshold: 0,
    text: (document: Document) => String(document.content)
  }, options);

  if(options.match == null) {
    throw new Error("Expected match criteria on which to filter.");
  }

  function matchDocument(document: Document) {
    const {match} = options;

    return Object.keys(match).every(key => {
      if(document[key] === match[key]) { return true }
      if(document[key] && document[key].indexOf) {
        return document[key].indexOf(match[key]) > -1;
      }

      return false;
    });
  }

  return (documents: DocumentHash, metalsmith: Hash, done: DoneFn) => {
    const tfidf = new TfIdf();
    const keys = Object.keys(documents).filter(key => matchDocument(documents[key]));

    keys.forEach(key => tfidf.addDocument(options.text(documents[key]), key));

    keys.forEach((key, index) => {
      const document: Document = documents[key];
      const keyTerms = tfidf.listTerms(index)
      .slice(0, options.terms)
      .map(({term}) => term);

      document.relations = keys.reduce((relations, key, d) => {
        if(d !== index) {
          const frequency = tfidf.tfidf(keyTerms, d);

          if(frequency > options.threshold) {
            relations.push({key, frequency});
          }
        }

        return relations;
      }, [])
      .sort((a, b) => a.frequency - b.frequency)
      .slice(0, options.max)
      .map(({key}) => documents[key]);
    });

    done();
  };
}
