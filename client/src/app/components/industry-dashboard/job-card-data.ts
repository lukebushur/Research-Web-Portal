export interface JobCardData {
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
  deadline: Date | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  datePosted: Date;
}