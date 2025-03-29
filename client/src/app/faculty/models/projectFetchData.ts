import { Application } from 'app/shared/models/application';
import { QuestionData } from '../../shared/models/questionData';

export interface ProjectFetchData {
  projectType: 'active' | 'draft' | 'archived',
  applications: Application[],
  deadline: Date,
  description: string,
  majors: string[],
  projectName: string,
  professorId: string,
  id: string,
  questions: QuestionData[]
  posted: Date,
  GPA: number,
  number: number,
  numApp: number,
}
