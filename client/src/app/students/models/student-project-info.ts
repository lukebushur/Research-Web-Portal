import { QuestionData } from "app/shared/models/questionData";

export interface StudentProjectInfo {
  projectName: string;
  questions: QuestionData[];
  description: string;
  posted: Date;
  deadline: Date;
  professorId: string;
  categories: string[];
  majors: string[];
  GPA: number;
  responsibilities?: string;
  professorName: string;
};

export interface SuccessStudentProjectInfo {
  success: {
    status: number;
    message: string;
    project: StudentProjectInfo;
  };
};
