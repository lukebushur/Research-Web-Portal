export interface JobProject {
  _id: string;
  title: string;
  description: string;
  skillsAssessed: string;
  eta: string;
  deadline: Date;
  materials?: string[];
  submissionType: 'text' | 'file';
  fileTypes?: string[];
  dateCreated: Date;
};