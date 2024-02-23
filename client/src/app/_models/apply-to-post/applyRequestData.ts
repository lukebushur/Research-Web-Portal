import { QuestionData } from "./questionData";

export interface ApplyRequestData {
  projectID: string;
  professorEmail: string,
  questions: QuestionData[],
};