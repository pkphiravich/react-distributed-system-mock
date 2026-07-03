const STATUS_LABEL = {
  Running: "กำลังทำงาน",
  Pending: "กำลังเริ่มต้น",
  Terminating: "กำลังหยุด",
};

const STATUS_DOT = {
  Running: "🟢",
  Pending: "🟡",
  Terminating: "🔴",
};

export default function PodCard({ pod }) {
  return (
    <div
      className={`pod-card pod-card--${pod.status.toLowerCase()}`}
      aria-label={`${pod.name} สถานะ: ${STATUS_LABEL[pod.status]}`}
    >
      <div className="pod-card__header">
        <span className="pod-card__icon">🐳</span>
        <span className="pod-card__name">{pod.name}</span>
      </div>
      <div className={`pod-card__status pod-card__status--${pod.status.toLowerCase()}`}>
        {STATUS_DOT[pod.status]} {STATUS_LABEL[pod.status]}
      </div>
      <div className="pod-card__count">
        <span className="pod-card__count-num">{pod.processedCount}</span>
        <span className="pod-card__count-label"> งาน</span>
      </div>
    </div>
  );
}
