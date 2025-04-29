export interface TrainingHistoryPoint {
  accuracy: number | null;
  loss: number | null;
  validationAccuracy: number | null;
  validationLoss: number | null;
  epoch: number;
}