export interface QuestionData {
  question: string;
  requirementType: string;
  required: boolean;
  choices: string[] | null;
  questionNum?: number;
  answers?: string[];
};