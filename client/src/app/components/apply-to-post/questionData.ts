export interface QuestionData {
  question: string;
  requirementType: string;
  required: boolean;
  choices: Array<string> | null;
};