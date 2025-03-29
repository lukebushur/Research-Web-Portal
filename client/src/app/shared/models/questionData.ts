export interface QuestionData {
  question: string;
  requirementType: 'text' | 'check box' | 'radio button';
  required: boolean;
  choices?: string[] | null;
  questionNum?: number;
  answers?: string[];
};
