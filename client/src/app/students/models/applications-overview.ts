import { QuestionData } from "app/shared/models/questionData";

export interface OverviewApplication {
  opportunityRecordId: string;
  opportunityId: string;
  projectName: string;
  projectSponsor: string;
  professorEmail: string;
  posted: Date;
  deadline: Date;
  description: string;
  GPAREQ: number;
  applicationID: string;
  appliedDate: Date;
  questions: QuestionData[];
  status: 'Accept' | 'Reject' | 'Pending';
}
