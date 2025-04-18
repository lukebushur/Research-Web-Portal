import { QuestionData } from './questionData';

export interface ProjectData {
  professorName: string;
  professorEmail: string;
  projectID: string;
  projectName: string;
  description: string;
  categories: string[];
  GPA: number;
  majors: string[];
  posted: string;
  deadline: string;
  responsibilities?: string;
  questions: QuestionData[];
};
