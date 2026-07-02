export default function KafkaQueue({ kafkaQueue }) {
  return (
    <section className="kafka-queue" aria-label="Apache Kafka Queue">
      <h3 className="kafka-queue__title">🪓 ท่อคิว Apache Kafka (Topic: ticket-orders)</h3>
      <div className="kafka-queue__track">
        {kafkaQueue.length === 0 ? (
          <span className="kafka-queue__empty">
            ท่อว่างเปล่า (พร้อมรับแรงกระแทกจากออเดอร์ถัดไป)
          </span>
        ) : (
          <div className="kafka-queue__items">
            {kafkaQueue.map((item, i) => (
              <div key={i} className="kafka-item queue-item-enter">
                📩 {item.user}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
