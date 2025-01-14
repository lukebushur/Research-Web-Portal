import { QuestionData } from "app/_models/projects/questionData";

export interface ApplyRequestData {
  projectID: string;
  professorEmail: string,
  questions: QuestionData[],
};
