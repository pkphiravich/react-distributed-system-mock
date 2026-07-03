import { useSimulation } from "../hooks/useSimulation";
import KubernetesCluster from "../components/KubernetesCluster";
import KafkaQueue from "../components/KafkaQueue";
import LogPanel from "../components/LogPanel";
import SimControls from "../components/SimControls";

export default function SimulationPage() {
  const {
    pods,
    queue,
    logs,
    ticketStatus,
    bookingCount,
    consumerSpeed,
    setConsumerSpeed,
    hpaThreshold,
    setHpaThreshold,
    bookTicket,
    crashPod,
    clearLogs,
  } = useSimulation();

  return (
    <div className="sim-page">
      {/* Left column */}
      <div className="left-col">
        <div className="user-panel">
          <p className="panel-label">📱 หน้าบ้าน — React App</p>

          <div className="ticket-status">
            <span className="ticket-status__label">สถานะตั๋ว</span>
            <span className="ticket-status__value">{ticketStatus}</span>
          </div>

          <div className="ticket-status">
            <span className="ticket-status__label">🎟️ จองแล้วทั้งหมด</span>
            <span className="ticket-status__value">{bookingCount} ใบ</span>
          </div>

          <div className="action-row">
            <button
              className="btn btn--primary"
              onClick={bookTicket}
              aria-label="จองตั๋วคอนเสิร์ต ทดสอบ High Concurrency"
            >
              🎟️ จองตั๋วคอนเสิร์ต
            </button>
            <button
              className="btn btn--danger"
              onClick={crashPod}
              aria-label="จำลองเซิร์ฟเวอร์ล่ม ทดสอบ Self-healing"
            >
              💥 ทำให้เซิร์ฟเวอร์ล่ม
            </button>
          </div>

          <SimControls
            consumerSpeed={consumerSpeed}
            setConsumerSpeed={setConsumerSpeed}
            hpaThreshold={hpaThreshold}
            setHpaThreshold={setHpaThreshold}
          />
        </div>

        <LogPanel logs={logs} onClear={clearLogs} />
      </div>

      {/* Right column */}
      <div className="right-col">
        <KubernetesCluster pods={pods} />
        <KafkaQueue queue={queue} />
      </div>
    </div>
  );
}
