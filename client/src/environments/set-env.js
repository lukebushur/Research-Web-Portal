const fs = require('fs');

// This file dynamically grabs the envs from a container and writes them to the environment.ts file.
// This file is only to be used when dynamically creating ALBs for testing AWS deployments,
// long term deployments would typically use a permanent DNS name from Route 53 instead

const albDns = process.env.ALB_DNS || 'localhost:8080';
const studentType = process.env.STUDENT || 'localhost:8080';
const facultyType = process.env.FACULTY || 'localhost:8080';
const industryType = process.env.INDUSTRY || 'localhost:8080';
const targetPath = './src/environments/environment.ts';

const envConfigFile = `
export const environment = {
  apiUrl: 'http://${albDns}/api',
  studentType: ${studentType},
  facultyType: ${facultyType},
  industryType: ${industryType},
};
`;

console.log('Generating environment.ts with ALB DNS:', albDns);

fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.error('Error writing to file:', err);
    }
});
