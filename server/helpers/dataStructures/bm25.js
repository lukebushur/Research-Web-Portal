/*  This class, bm25, utilizes the bm25 or best match 25 ranking algorithm to identify the best matches given a search query. It should be used for long fields
    such as the description and responsbility fields of projects. For future developer reference, use this website https://ethen8181.github.io/machine-learning/search/bm25_intro.html
    which provide a python project that implements a similar bm25 class, and for reference on the bm25 algorithm use this website : 
    https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables

    The formula used in this algorithm is as follows SUMMATION(IDF(q) * (TF(q, D) * (k1 + 1)) / (TF(q, D) + k1 * (1 - b + b * (|D| / avgdl))))
    q - the query term(s)  |  D - the documents used in the search. In the case of searching projects, D is a specified field from every project that is being searched
    TF(q, D) - term frequency of q in documents D  |  |D| - the field length of the current document  |  avgdl - the average length of the documents (or fields) being used in the search
    IDF(q) - is the inverse document frequency of the current query term. This measure how oftern a term appears in all of the documents and "penalizes" common terms to stop them from 
    dominating the formula. 
    k1 - a variable that determines the "term frequency saturation". It limits how much a single term can affect the score of a given document. A higher value of k1 makes the scoring more 
    sensitive to term frequency which makes documents with higher occurences of query terms receive higher scores. If k1 is too high the algorithm might overfit, and if its too low then 
    the algorithm may be insensitive to query terms
    b - a variable that controls how the document length affects the score. b should remain between 0-1. As b approaches 1, longer documents are more penalized for their length. As b 
    approaches 0, the penalty for longer documents is decreased, and at 0 there is no scoring penalty for document length. 

    This class is split into a constructor and 5 methods
    constructor - simply set the value of k1 and b to the parameters or the default parameter values.
    fit - this method sets up the class to utilize the algorithm. It sets all the variables up such as idf, termFrequency, avgDocLength, etc. This method needs to be used before 
    using the search method. The fit method takes a parameter documents, which needs to be an array of strings. Each string is considered a document.
    calculateTermFrequency - this method calculates the term frequencies of each term in the document provided and stores it in a dictionary then returns the dictionary.
    calculateIDF - this method calculates the idf from the term frequencies of each document.
    search - this method uses the score method to generate an array of scores and returns them.
    score - this method uses the bm25 algorithm with the previously created variables in fit to generate a score for the query string against a document.
*/
class bm25 {
    //Basic constructor, b must be between 0 - 1, more information about b and k1 is above
    constructor(k1 = 1.5, b = 0.75) {
        this.k1 = k1;
        this.b = b;
    }

    // This method sets up all the variables necessary for the bm25 algorithm - It requires an array of strings as its documents parameter in order to work. Each string is considered a document.
    fit(documents) {
        if (!Array.isArray(documents)) { throw new Error("Documents parameter is not an array of strings.") } //Check that the documents parameter is a array of strings
        if (documents.length == 0 || typeof documents[0][0] != "string") { throw new Error("Documents parameter is not an array of strings.") }
        //For the variables that are arrays, each index represents the same document. I.E. document 1's length is stored in documentLengths[0] and its term frequencies in termFrequency[0].
        this.documentFrequency = {}; //Document frequency per term, number of documents that contain a term
        this.termFrequency = []; //Term frequency per document. Each index will hold a dictionary that contains the terms to the number of occurances they have
        this.idf = {}; //Inverse document frequency 
        this.documentLengths = []; //This is an array that holds the length of each document
        this.documents_Amount = 0; //Total number of documents

        for (const document of documents) { //For each document, calculate the term frequency and document length
            this.documents_Amount += 1;
            this.documentLengths.push(document.length); //get document length

            this.termFrequency.push(this.calculateTermFrequency(document)); //get termFrequency
            //for each term and frequency in the latest termFrequency, update the documentFrequency, i.e. the number of documents that contain a certain term
            for (const [term, _] of Object.entries(this.termFrequency[this.termFrequency.length - 1])) {
                let dfCount = this.documentFrequency[term] + 1; //create dfCount as the documentFrequency of the term + 1
                if (!dfCount) { dfCount = 1; } //If it doesn't exist set dfCount to 1 as its the first
                this.documentFrequency[term] = dfCount; //update the documentFrequency
            }

        }

        this.idf = this.calculate_idf(Object.entries(this.documentFrequency)); //Set idf to the idf 

        this.documents = documents; //store documents for later use
        this.avgDocLength = this.documentLengths.reduce((a, b) => a + b, 0) / this.documents_Amount; //get average document length

    }
    //This calculates the term frequency of a specific document, takes a single document as a parameter
    calculateTermFrequency(document) {
        let termFrequency = {};
        for (const term of document) {
            if (!termFrequency[term]) //if the index of the term count is undefined it will return false 
            {
                termFrequency[term] = 1; //first occurance set to one
            } else {
                termFrequency[term] = termFrequency[term] + 1; //not first occurance add one more occurance
            }
        }
        return termFrequency;
    }
    //Calculates the idf score, takes an array of dictionaries representing the term frequencies
    calculate_idf(termFreq) {
        let idf = {};
        for (const [term, freq] of termFreq) {
            idf[term] = Math.log(1 + (this.documents_Amount - freq + 0.5) / (freq + 0.5));
        }

        return idf;
    }
    //performs the "search". Takes an array of string tokens that represent the query
    search(query) {
        let scores = [];
        for (let i = 0; i < this.documents_Amount; i++) { //generate an array of scores for each document searched
            scores.push(this.score(query, i))
        }
        return scores;
    }
    //This scores a specific document using each query term. The parameters it takes are query and index. query is an array of string that represent the query being searched while the index
    //is the index of the document that will be search
    score(query, index) {
        if (typeof query === "string") { query = query.toLowerCase().split(" "); } //If the query is a string for some reason, make it an array of tokens
        let score = 0.0; //Score is 0 at the start

        let documentLength = this.documentLengths[index]; //Get the documentLength and term frequencies from the given index.
        let frequencies = this.termFrequency[index];

        for (const term of query) { //For each token in the query, calculate a score for it if it exists in the document otherwise continue
            if (!frequencies[term]) { continue; } //If the query token doesn't exist, then continue as it will cause the equation to equal 0 anyways

            let freq = frequencies[term]; 
            let numerator = this.idf[term] * freq * (this.k1 + 1); //calculate the bm25 numerator
            let denominator = freq + this.k1 * (1 - this.b + this.b * documentLength / this.avgDocLength); //calculate the bm25 denominator
            score += (numerator / denominator); //summation this iteration of the score
        }

        return score; //return the score
    }
}
// This is a test method used to test the other functions in this file
const test = () => {
    let query = 'The intersection of graph survey and trees'

    let corpus = [
        'Human machine interface for lab abc computer applications',
        'A survey of user opinion of computer system response time',
        'The EPS user interface management system',
        'System and human system engineering testing of EPS',
        'Relation of user perceived response time to error measurement',
        'The generation of random binary unordered trees',
        'The intersection graph of paths in trees',
        'Graph minors IV Widths of trees and well quasi ordering',
        'Graph minors A survey'
    ]

    const stopwords = new Set(['for', 'a', 'of', 'the', 'and', 'to', 'in']);
    query = query.toLowerCase().split(" ").filter(word => !stopwords.has(word));
    const texts = corpus.map(document =>
        document.toLowerCase().split(" ").filter(word => !stopwords.has(word))
    );

    // Build a word count dictionary
    const wordCountDict = {};
    texts.forEach(text => {
        text.forEach(token => {
            wordCountDict[token] = (wordCountDict[token] || 0) + 1;
        });
    });

    // Remove words that appear only once
    const filteredTexts = texts.map(text =>
        text.filter(token => wordCountDict[token] > 1)
    );
    console.log(filteredTexts);

    let BM25 = new bm25()
    BM25.fit(filteredTexts)
    let scores = BM25.search(query)

    scores.forEach((score, index) => {
        const roundedScore = score.toFixed(3); // Round score to 3 decimal places
    });
}

export { bm25 };