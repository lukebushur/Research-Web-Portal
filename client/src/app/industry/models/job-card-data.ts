import { QuestionData } from 'app/shared/models/questionData';

export interface JobCardData {
  _id: string;
  employer: string;
  title: string;
  isInternship: boolean;
  isFullTime: boolean;
  description: string;
  location: string;
  reqYearsExp: number;
  tags?: string[];
  timeCommitment?: string;
  pay?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  questions?: QuestionData[];
  datePosted: string;
}
