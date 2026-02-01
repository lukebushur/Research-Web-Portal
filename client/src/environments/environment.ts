// change to port 3000 for docker deployment
export const environment = {

  get apiUrl() {
    return (window as any)["env"]?.["apiUrl"] || 'http://localhost:3000/api';
  },
  studentType: 0,
  facultyType: 1,
  industryType: 2,
};
