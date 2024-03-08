import { QuestionData } from "../apply-to-post/questionData";

export interface AssessmentData {
  _id: string,
  name: string,
  dateCreated: Date,
  questions: QuestionData[],
};