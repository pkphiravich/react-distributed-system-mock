export const CONSUMER_INTERVAL_MS = 2000;
export const HPA_QUEUE_THRESHOLD = 3;
export const SELF_HEAL_DELAY_MS = 1500;
export const INITIAL_POD_COUNT = 2;
export const HPA_SCALE_UP_COUNT = 2;
export const SCALE_DOWN_DELAY_MS = 5000;
export const POD_PENDING_DELAY_MS = 500;

export const MOCK_USERS = ["User-1", "User-2", "User-3", "User-4", "User-5"];

export const INITIAL_PODS = [
  { id: "pod-1", name: "Pod-Backend-1", status: "Running", processedCount: 0 },
  { id: "pod-2", name: "Pod-Backend-2", status: "Running", processedCount: 0 },
];
