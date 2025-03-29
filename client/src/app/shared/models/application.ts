export interface Application {
  _id: string,
  applicationRecordID: string
  application: string,
  status: string,
  name: string,
  GPA: number,
  major: string[],
  email: string,
  appliedDate: Date,
  location: string,
}