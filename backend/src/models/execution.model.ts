export interface Execution {
  id: string;
  workflowId: string;
  status: string;
  result?: any;
  createdAt: Date;
}
