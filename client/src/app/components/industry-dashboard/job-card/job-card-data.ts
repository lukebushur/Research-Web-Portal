export interface JobCardData {
  _id: string;
  employer: string;
  title: string;
  isInternship: boolean;
  isFullTime: boolean;
  description: string;
  location: string;
  reqYearsExp: number;
  tags: string[] | undefined;
  timeCommitment: string | undefined;
  pay: string | undefined;
  deadline: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  datePosted: string;
}