import { NavChoice } from "app/_models/toolbar/navchoice";

export const facultyNavList: NavChoice[] = [
  {
    name: 'Dashboard',
    link: '/faculty/dashboard',
    icon: 'dashboard',
  },
  {
    name: 'Create Project',
    link: '/faculty/create-project',
    icon: 'add',
  },
];

export const studentNavList: NavChoice[] = [
  {
    name: 'Dashboard',
    link: '/student/dashboard',
    icon: 'dashboard',
  },
  {
    name: 'Search Projects',
    link: '/student/search-projects',
    icon: 'search',
  },
  {
    name: 'Applications',
    link: '/student/applications-overview',
    icon: 'assignment',
  },
];

export const industryNavList: NavChoice[] = [
  {
    name: 'Dashboard',
    link: '/industry/dashboard',
    icon: 'dashboard',
  },
  {
    name: 'Create Job',
    link: '/industry/create-job',
    icon: 'add',
  },
  {
    name: 'Assessments',
    link: '/industry/assessments',
    icon: 'quiz',
  },
  {
    name: 'Create Assessment',
    link: '/industry/create-assessment',
    icon: 'library_add',
  },
];
