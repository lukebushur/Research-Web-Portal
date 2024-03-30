import { QuestionData } from "src/app/_models/projects/questionData";

export interface ApplyRequestData {
  projectID: string;
  professorEmail: string,
  questions: QuestionData[],
};