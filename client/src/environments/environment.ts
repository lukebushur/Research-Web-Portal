// change to port 3000 for docker deployment
export const environment = {
  apiUrl: (window as any)["env"]?.["BACKEND_URI"] || 'http://localhost:3000/api',
  studentType: 0,
  facultyType: 1,
  industryType: 2,
};
