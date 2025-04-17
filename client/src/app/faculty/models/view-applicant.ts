import { QuestionData } from "app/shared/models/questionData";

export interface ApplicantProjectData {
  projectName: string;
  posted: Date;
  deadline: Date;
  description: string;
  responsibilities?: string;
  categories: string[];
  GPA: number;
  majors: string[];
  questions: QuestionData[];
};

export interface ApplicantData {
  application: string;
  name: string;
  email: string;
  appliedDate: Date;
  status: 'Accept' | 'Reject' | 'Pending';
  GPA: number;
  major: string[];
  answers: QuestionData[];
};
