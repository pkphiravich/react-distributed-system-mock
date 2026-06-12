import React from "react";

// รับค่า props ชื่อ kafkaQueue มาจากไฟล์หลักเพื่อนำมาเรนเดอร์ในท่อ
export default function KafkaQueue({ kafkaQueue }) {
  return (
    <div style={{ border: "2px solid #e05e00", padding: "15px", borderRadius: "8px" }}>
      <h3 style={{ color: "#e05e00", margin: "0 0 10px 0" }}>🪓 ท่อคิว Apache Kafka (Topic: ticket-orders)</h3>
      <div style={{ background: "#fff3eb", padding: "10px", minHeight: "50px", borderRadius: "5px", border: "1px dashed #e05e00" }}>
        {kafkaQueue.length === 0 ? (
          <span style={{ color: "#666", fontSize: "13px" }}>ท่อว่างเปล่า (พร้อมรับแรงกระแทกจากออเดอร์ถัดไป)</span>
        ) : (
          <div style={{ display: "flex", gap: "5px" }}>
            {kafkaQueue.map((item, i) => (
              <div key={i} style={{ background: "#ff771c", color: "white", padding: "5px 10px", borderRadius: "4px", fontSize: "12px" }}>
                📩 งานจองจาก: {item.user}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}