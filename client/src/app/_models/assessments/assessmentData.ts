import { QuestionData } from "src/app/_models/projects/questionData";

export interface AssessmentData {
  _id: string,
  name: string,
  dateCreated: Date,
  questions: QuestionData[],
};