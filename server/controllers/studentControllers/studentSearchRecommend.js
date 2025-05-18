import jwt from 'jsonwebtoken';

import Project from '../../models/project.js';
import Applications from '../../models/application.js';
import User from '../../models/user.js';
import generateRes from '../../helpers/generateJSON.js';
import { search } from '../../helpers/dataStructures/searchDataStructures.js';
import { retrieveOrCacheUsers } from '../../helpers/schemaCaching.js';

/*  This route uses a get request and requires an access token to use. This route should return an array of relevant projects given the search criteria and query string. 
    There is no body as it is a get request however there are url parameters that effect the route. 
    Below are possible url parameters : 

    <GPA> - The minimum GPA requirement for the projects. I.E. if the GPA is set to 2.5, all projects with 2.5 or higher will be included as apart of the document search.
    <majors> - An array of string that represent the majors that projects have to have to be considered. I.E. if the majors array is ["Computer Science", "Biology"], only projects that have Computer Science or 
    Biology in their majors requirements would be included in the search. The format for these is **&majors=Computer Science,Biology,Frogs**
    <posted> - The earliest post date to be considered in the search in ISO format. I.E. if **&posted=2024-01-16T16:41:59.968325** is included, only projects that are created after that date will be included
    <deadline> - The earliest deadline to be considered in the search in ISO format. I.E. if **&posted=2024-03-17T16:41:59.968325** is included, only projects with a deadline later than that will be included
    <pageNum> - the page number, works in tandem with number per page. If its page 2 and number per page is 25, then page two will return items 26-50 based on relevance. If npp is not provided, page number is ignored
    <npp> - (Number Per Page) the number of items to be returned per page. If there is not enough items, then a 207 partial success will be returned.

    Below is an example of a valid url with parameters for this route: 
    http://localhost:5000/api/search/searchProjects?posted=2024-01-16T16:41:59.968325&query=Matthew Im Test&deadline=2024-03-17T16:41:59.968325&majors=Computer Science,Biology,Frogs


    This route uses the search data structure to score each project that is obtained through the inital database query. Will update in future to limit the number of records retrieved/records returned once I 
    figure out a good way to do so. 
*/
const searchProjects = async (req, res) => {
    try {
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
                    'projects.questions': 1,
                    'projects._id': 1
                }
            }
        ]

        if (majors && majors.length > 0) { //if there exists a majors parameter in the request, include it in the db query
            pipeline[1].$match['projects.majors'] = { $elemMatch: { $in: majors } };
        }

        if (req.query.GPA && req.query.GPA <= 4) { //if there exists a valid GPA parameter in the request, include it in the db query
            pipeline[1].$match['projects.GPA'] = { $gte: parseFloat(req.query.GPA) };
        }

        const postedDate = req.query.posted ? new Date(req.query.posted) : null; //Get a date if it exists in the query for posted and deadline
        const deadlineDate = req.query.deadline ? new Date(req.query.deadline) : null;

        if (postedDate && postedDate instanceof Date) { //get records that were posted after the posted date
            pipeline[1].$match['projects.posted'] = { $gte: postedDate };
        }

        if (deadlineDate && deadlineDate instanceof Date) { //get the records that have a deadline at or after deadline
            pipeline[1].$match['projects.deadline'] = { $gte: deadlineDate };
        }

        let student;
        let searchResults;
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const promises = [
            retrieveOrCacheUsers(req, decodeAccessToken.email),
            Project.aggregate(pipeline)
        ]

        await Promise.all(promises).then(results => {
            student = results[0];
            searchResults = results[1]
        });

        //check if user type is a student or faculty, will probably remove
        // if (student.userType.Type != process.env.STUDENT || student.userType.Type != process.env.FACULTY) { return res.status(401).json(generateRes(false, 401, "ACCESS_DENIED", { details: "Invalid account type for this operation." })); }

        //do the results filtering / decision in this block, that way the ram is freed after it is finished.
        if (searchResults.length > 0) { //if there exists results, do the filtering
            for (let project of searchResults) { //add the name and email to each array element
                project.projects.professorName = project.professorName;
                project.projects.professorEmail = project.professorEmail;
                projects.push(project.projects);
            }
            //set up the fields that will be used will the search data structure, also set up the type of search for each field and their respective weights
            const fields = ["projectName", "majors", "professorName", "categories", "description", "responsibilities"];
            const searchTypes = [0, 0, 0, 0, 1, 1];
            const weights = [1, 1, 1, 1, 1, 1];
            //create the search object and search, then sort by score descending
            const searchEngine = new search(projects, req.query.query, fields, searchTypes, weights);
            projects = searchEngine.search();
            projects.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
            //grab the student's applications
            const applications = await Applications.findOne({ _id: student.userType.studentApplications });
            projects.forEach((element) => element.applied = false); //initally set all projects to applied false
            if (applications) {
                applications.applications.forEach((element) => { //for each element in the applications array, check if the student has already applied to the opportunities
                    let index = projects.findIndex((project) =>
                        element.opportunityId.equals(project._id)); //if the opportunity object id is the same as the project id, then the student has applied to a project that is being returned in the searhc
                    if (index > -1) { projects[index].applied = true; } //if index > -1 the project has already been applied to, 
                });
            }
        }

        const pageNum = parseInt(req.query.pageNum, 10); //ensure variables are numbers 
        const npp = parseInt(req.query.npp, 10);

        if (pageNum && npp && pageNum >= 1) { //check that pageNumber and npp exist
            if (projects.length > npp * (pageNum - 1)) { //if so, ensures there is enough projects for teh specified page, i.e. npp = 10 and page equals 2, then it ensures that the length is 11 or higher by checking that the length is longer than 10 * (2 - 1) 
                projects = projects.slice((npp * (pageNum - 1)), (npp * (pageNum)));
            } else {
                let finalPageNum = Math.floor(projects.length / npp) + 1;
                projects = projects.slice((npp * (finalPageNum - 1)));
            }
        } else if (npp) {
            projects = projects.slice(0, npp);
        }

        return res.status(200).json(generateRes(true, 200, "RESULTS_FOUND", { results: projects }));
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

export { searchProjects };
