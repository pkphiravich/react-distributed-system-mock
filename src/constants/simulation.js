export const CONSUMER_INTERVAL_MS = 1500;
export const HPA_QUEUE_THRESHOLD = 3;
export const SELF_HEAL_DELAY_MS = 1000;
export const SCALE_DOWN_DELAY_MS = 5000;
export const POD_PENDING_DELAY_MS = 800;

export const MOCK_USERS = [
  "สมชาย", "สมหญิง", "วิชัย", "นภา", "อาร์ม",
  "เบียร์", "กิ๊ฟ", "นัท", "ปลา", "ฝน",
];

export const INITIAL_PODS = [
  { id: "pod-1", name: "Backend-1", status: "Running", processedCount: 0 },
  { id: "pod-2", name: "Backend-2", status: "Running", processedCount: 0 },
];
