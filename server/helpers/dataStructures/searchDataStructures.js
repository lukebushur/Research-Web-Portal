const { bm25 } = require('./bm25');

//This stopwords array are words that contribute little meaning to text, so they will be ignored by the search to provide better results. These will be used to filter the query and the documents that will be searched
const stopwords = new Set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
    'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who',
    'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
    'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against',
    'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);

/*  The search class is used to perform a search against a list of documents (projects). It utilizes two types of searching functions. One is a simple term matcher for short fields such as project title, 
    professor name, project categories, majors, etc. The second using the bm25 (best match 25) algorithm to identify the best matches for longer fields such as description and responsbilities field. 
    This class will then aggregrate the scores generated from the term matcher and bm25 algorithm to determine the best results from the search.
    This class can only be used with textual inputs and does not work with numerical data. 
*/
class search {
    /*  The constructor takes 5 parameters, projects, query, fields, searchTypes, and weights. The fields, searchTypes, and weights all need to have the same length, and each index is associated with the same project. 
        i.e. weight[0], searchType[0], and fields[0] all reference the same field.

        projects - an array of objects that represent the documents that will be searched through with this class.
        query - a string that represents the search query that will be used against the documents
        fields - an array of the fields that exist in the projects parameter. These fields will be used to search with this class. The length of this array needs to match the searchTypes and weights. Each field in the projects should be a string or array of strings.
        searchTypes - an array that specifies the search type for each fields. The values should only ever be 0 or 1. 0 indicates a simple search, i.e. a term match, while 1 indicate complex search with bm25
        weights - an array of numbers that specifies the relative weight for the score of each search field. The value at each index will be multiplied with the score of the project at the same index to get the final scores
    */
    constructor(projects, query, fields, searchTypes, weights) {
        this.preprocessData(projects, fields, searchTypes, weights);

        this.projectData = projects; //The data of the projects, each question, description, title, etc is stored here
        if(query)
            this.query = this.removePunctuation(query).toLowerCase().split(" ").filter(word => !stopwords.has(word)); //The query that is being searched, it is filtered to remove stopword (the, for, while, inbetween, etc.) and split into a string
        else
            this.query = ""
        
        this.fields = fields; //This is an array of the fields that are being using in the search
        this.searchTypes = searchTypes; //This is an array that specifies the types of search to be performed, either with bm25, or a simple term match algorithm
        this.searchCriteria = {}; //this is a dictionary that holds the arrays of the scores for each field that is used in the search
        this.weights = {}; //This is an array that holds the relative weights of each of the fields included in the search, which allows for fields such as projectTitle to have higher or lower weights depending on developer input
        for (let i = 0; i < fields.length; i++) { //This for loop makes weights of each of the fields the weight provided or 1, and also creates an empty array for each of the search criteria fields
            this.weights[fields[i]] = weights[i] || 1;
            this.searchCriteria[fields[i]] = [];
        }

        this.aggregrateScore = []; //This array will hold the aggregrate score of all the fields used in the search for each of the projects used in the search
        for (let i = 0; i < projects.length; i++) {
            this.aggregrateScore.push(0); //Initally set all scores to 0, so if there is any errors with the fields provided the score is automatically 0 for that category
        }
    }
    //This function performs a scoring for each project based on the searchTypes array.
    search() {
        for (let i = 0; i < this.fields.length; i++) {
            if (this.searchTypes[i] === 1) { //if searchtype is 1 then bm25 search
                this.bm25Search(this.fields[i]);
            } else { //otherwise simple term match search
                this.termMatch(this.fields[i]);
            }
        }

        this.aggregrateScores(); //get all the scores finalized

        for (let i = 0; i < this.projectData.length; i++) { //store the scores in the project data
            this.projectData[i].score = this.aggregrateScore[i];
        }

        return this.projectData; //return the scored projects
    }

    /*  This function performs a simple term matching scheme to score a field. It takes one parameter, field, which should be the string of the field that is being scored. 
        This function scores the field by adding one to the score for each matched term of the query, then dividing the final amount by the total number of tokens in the 
        field that is being searched. The query and the fields are filtered for stop words prior to performing the term matching. This method should only ever be used with 
        small fields as long text fields will result in very small scores. Use BM25 search for medium to large field searching. The value returned should always be between 0 and 1
    */
    termMatch(field) {
        let results = [];

        for (const project of this.projectData) { //For each project of the total provided projects
            if (project[field] == null) { return; } //if the field is null or undefined, skip over it as it will cause errors otherwise

            let score = 0;

            let fieldTokens; //an array of each token in the field
            if (typeof project[field] === "string") { //If the type is a string, then make its value lowercase and split it into tokens
                const fieldValue = project[field].toLowerCase();
                fieldTokens = this.removeTitles(fieldValue.split(/\s+/)); //remove titles in case of titles in names, also filters for stopwords
            } else if (Array.isArray(project[field])) { //If the type of the field is an array of strings, make them lowercase and filter for stopwords
                fieldTokens = project[field];
                let newArr = [];
                fieldTokens.forEach(element => {
                    newArr = newArr.concat(element.split(" "));
                });
                newArr = newArr.map(v => v.toLowerCase());
                newArr = newArr.filter(word => !stopwords.has(word));
                fieldTokens = newArr;
            }

            for (const queryToken of this.query) { //for each query token in the query, increase the score by the number of times a querytoken exists in the field
                if (fieldTokens.includes(queryToken)) {
                    score++;
                }
            }

            score /= fieldTokens.length; //divide the score by the tokens
            results.push(score); //push the result to the results array
            score = 0; //reset score

        }
        this.searchCriteria[field] = results; //assign the results array to the searchCriteria dictionary for the specified field
    }
    /*  The bm25Search method is to be used for medium to longer fields, i.e. full sentences to entire documents / paragraphs. It takes a single parameter, field, with is the field that 
        will be search through from the projects array. It then creates a bm25 object and searches through the field for the field in each project and returns the scores of the field in 
        each of the projects. If the value of the field is null or undefined it returns to avoid errors in searching empty data.
    */
    bm25Search(field) {
        let corpus = []; //corpus is a collection of written texts, in this case the collection of text data from the fields
        for (const project of this.projectData) {
            if (project[field] == null) { return; }
            corpus.push(project[field]); //push each field data to the corpus array
        }

        let filteredCorpus = this.filterCorpus(corpus); //filter the corpus to remove stopwords and prepare it for the algorithm

        let BM25 = new bm25();
        BM25.fit(filteredCorpus); //set up the bm25 class for searching
        let scores = BM25.search(this.query); //search the documents

        this.searchCriteria[field] = scores; //get the scores
    }
    //This simple method removes the titles from the array of tokens that is provide in the parameter
    removeTitles(tokenArray) {
        const titles = ['dr.', 'esq.', 'hon.', 'jr.', 'mr.', 'mrs.', 'ms.', 'messrs.', 'mmes.', 'msgr.', 'prof.', 'rev.', 'rt. hon.', 'sr.', 'st.'].concat(stopwords);
        return tokenArray.filter(element => !titles.includes(element));
    }

    /*  This method filters the text that will be sent to the bm25 class. It takes two parameters, corpus and strict. Corpus is the array of strings that represents the documents that will be used in a 
        search with the bm25 class. Strict is a boolean that determines how strict the filtering is, if its true then any word that appears once is removed, otherwise if its false all non-filtered words are kept
        This method will take all the words in the corpus, make them lowercase, spilt the string and filter the stopwords from it, and depending on the strict setting will either remove words that appear once or immediately return 
        the filtered words. This method returns an array of array of strings.
    */
    filterCorpus(corpus, strict = false) { //strict is a boolean that defines whether to remove words that only appear once
        corpus = corpus.map(x => this.removePunctuation(x)); //removes punctuation from the words

        const texts = corpus.map(document => //filters stopwords from corpus and splits the string
            document.toLowerCase().split(" ").filter(word => !stopwords.has(word))
        );

        if (strict) {
            //if strict, build a word count dictionary
            const wordCountDict = {};
            texts.forEach(text => {
                text.forEach(token => {
                    wordCountDict[token] = (wordCountDict[token] || 0);
                });
            });

            //filter words that appear only once out of the corpus
            const filteredTexts = texts.map(text =>
                text.filter(token => wordCountDict[token] > 1)
            );

            return filteredTexts;
        } else {
            return texts;
        }
    }
    //This method simply combines all the scores from across each field and stores it in the aggregrate score variable
    aggregrateScores() {
        for (const field in this.searchCriteria) { //for each key in the searchCriteria dictionary (use in not of)
            if (this.searchCriteria[field] == null || this.searchCriteria[field] == []) { continue; } //if the value from the key is null, continue
            for (let i = 0; i < this.searchCriteria[field].length; i++) { //otherwise add the the values of the searchCriteria array for the field to their respective places in aggregrate score
                this.aggregrateScore[i] += this.searchCriteria[field][i];
            }
        }
    }

    removePunctuation(str) { //Thank you chat-gpt
        // Define a regular expression to match punctuation characters
        const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
        // Replace punctuation characters with an empty string
        if(str)
            return str.replace(punctuationRegex, '');
        else 
            return str;
    }
    //this simple method prepocesses the data for the data structure, it will throw errors if the data provided is unrecoverable, otherwise it will attempt to remedy the data issues
    preprocessData(projects, fields, searchTypes, weights) {
        const length = fields.length; //if the lengths of the searchTypes, weights, and fields are not the same, this class cannot work so throw an error
        if (searchTypes.length !== length && weights.length && length) { throw new Error('Length mismatch for fields, searchTypes, and weights.'); }

        const spliceArr = (x) => { //function to remove an element from each array
            fields.splice(x, 1);
            searchTypes.splice(x, 1);
            weights.splice(x, 1);
        }

        for (let x = 0; x < fields.length; x++) { // for field in the field array, remove it using spliceArr if the field is not a string or an array of strings
            if (projects[0][fields[x]] == null) { // if the field is null remove it from each array
                spliceArr(x);
            }
            else if ( // if the field is not a string or a not an array of strings then remove it from the array
                typeof projects[0][fields[x]] !== "string" &&
                (!Array.isArray(projects[0][fields[x]]) || projects[0][fields[x]].some(item => typeof item !== "string"))
            ) {
                spliceArr(x);
            }
        }
    }
}



module.exports = { search }