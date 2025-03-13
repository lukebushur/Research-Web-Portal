import { QuestionData } from 'app/shared/models/questionData';

export interface ApplyRequestData {
  projectID: string;
  professorEmail: string,
  questions: QuestionData[],
};
