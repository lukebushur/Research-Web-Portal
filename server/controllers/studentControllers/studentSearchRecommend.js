const Project = require('../../models/project');
const User = require('../../models/user');
const JWT = require('jsonwebtoken');
const generateRes = require('../../helpers/generateJSON');
const { search } = require('../../helpers/dataStructures/searchDataStructures');

/*HTTP BODY :
    GPA REQUIREMENT - minimum GPA amount, not required
    Majors - array of majors for the search for applicable projects
    Search Query - the string that is the actual search query, will be used against the project name, description, professor name, and categories

    step 1 - user GPA requirement, location, and majors to search for every project in the database that majors those criteria, 

    step 2 - use some sort of algorithm + data structure to identify "correct" results based upon title, project name, description, professor name, and categories 
    this will likely be done through a data structure with a map that identifies a score of based on the closeness to the string string for each category

    step 3 - sort the "correct" results and identify any that the student already applied to, and modify those. 
*/
const searchProjects = async (req, res) => {
    try {
        //Don't need to decode the access token as this route can be used with any account
        const majors = (req.query.majors) ? req.query.majors.split(",") : false; //get and split majors if they exist, otherwise make it false
        let projects = []; //array for the 

        //Set up a request pipeline in order to dynamically add the database query specifications
        const pipeline = [
            { $unwind: '$projects' },
            {
                $match: {
                    'type': 'Active', // Ensure type is 'Active'
                }
            },
            {
                $project: {
                    _id: 1,
                    professorEmail: 1,
                    professorName: 1,
                    'projects.projectName': 1,
                    'projects.GPA': 1,
                    'projects.majors': 1,
                    'projects.categories': 1,
                    'projects.posted': 1,
                    'projects.deadline': 1,
                    'projects.archived': 1,
                    'projects.description': 1,
                    'projects.responsibilities': 1,
                    'projects.questions': 1
                }
            }
        ]

        if (majors && majors.length > 0) { //if there exists a majors parameter in the request, include it in the db query
            pipeline[1].$match['projects.majors'] = { $elemMatch: { $in: majors } };
        }

        if (req.query.GPA && req.query.GPA <= 4) { //if there exists a valid GPA parameter in the request, include it in the db query
            pipeline[1].$match['projects.GPA'] = { $gte: parseFloat(req.query.GPA) };
        }

        const postedDate = req.query.posted ? new Date(req.query.posted) : null;
        const deadlineDate = req.query.deadline ? new Date(req.query.deadline) : null;

        if (postedDate && postedDate instanceof Date) {
            pipeline[1].$match['projects.posted'] = { $gt: postedDate };
        }

        if (deadlineDate && deadlineDate instanceof Date) {
            pipeline[1].$match['projects.deadline'] = { $gt: deadlineDate };
        }


        await Project.aggregate(pipeline)
            .then(results => { //do the results filtering / decision in this block, that way the ram is freed after it is finished.
                if (results.length > 1) {
                    for (let project of results) {
                        project.projects.professorName = project.professorName;
                        project.projects.professorEmail = project.professorEmail;
                        projects.push(project.projects);
                    }

                    const fields = ["projectName", "majors", "GPA", "professorName", "categories", "description", "responsibilities"];
                    const searchTypes = [0, 0, 0, 0, 0, 1, 1];
                    const weights = [1, 1, 1, 1, 1, 1, 1];

                    searchEngine = new search(projects, req.query.query, fields, searchTypes, weights);
                    projects = searchEngine.search();
                    projects.sort((a, b) => b.score - a.score);
                }
            });

        return res.status(200).json(generateRes(true, 200, "RESULTS_FOUND", { results: projects }));
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

module.exports = {
    searchProjects
};