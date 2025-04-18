import { QuestionData } from 'app/shared/models/questionData';

export interface AssessmentData {
  _id: string,
  name: string,
  dateCreated: Date,
  questions: QuestionData[],
};
