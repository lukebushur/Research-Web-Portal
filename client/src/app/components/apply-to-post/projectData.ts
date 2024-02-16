import { QuestionData } from "./questionData";

export interface ProjectData {
  projectName: string;
  professorName: string;
  professorEmail: string;
  projectID: string;
  title: string;
  description: string;
  categories: Array<string>;
  GPA: number;
  majors: Array<string>;
  posted: string;
  deadline: string;
  questions: Array<QuestionData>;
};