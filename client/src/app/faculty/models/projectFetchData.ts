import { Application } from 'app/shared/models/application';
import { QuestionData } from '../../shared/models/questionData';

export interface ProjectFetchData {
  projectType: 'active' | 'draft' | 'archived',
  applications: Application[],
  deadline: Date | null,
  description: string,
  majors: string[],
  projectName: string,
  id: string,
  questions: QuestionData[]
  posted: Date | null,
  GPA: number,
  number: number,
  numApp: number,
}
