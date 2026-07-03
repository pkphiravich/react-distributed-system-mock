export default function KafkaQueue({ queue }) {
  return (
    <section className="kafka-section" aria-label="Apache Kafka Queue">
      <div className="section-header">
        <h3 className="section-title">🪵 Apache Kafka</h3>
        <span className="section-badge kafka-badge">{queue.length} ในคิว</span>
      </div>
      <p className="section-subtitle">Topic: ticket-orders</p>
      <div className="kafka-track">
        {queue.length === 0 ? (
          <span className="kafka-empty">ท่อว่าง — พร้อมรับออเดอร์ใหม่</span>
        ) : (
          <div className="kafka-items">
            {queue.map((item) => (
              <div key={item.id} className="kafka-item">
                📩 {item.user}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
