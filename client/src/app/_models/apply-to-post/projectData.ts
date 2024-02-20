import { QuestionData } from "./questionData";

export interface ProjectData {
  projectName: string;
  professorName: string;
  professorEmail: string;
  projectID: string;
  title: string;
  description: string;
  categories: string[];
  GPA: number;
  majors: string[];
  posted: string;
  deadline: string;
  questions: QuestionData[];
};