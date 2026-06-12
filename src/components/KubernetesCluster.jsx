import React from "react";

// สร้าง Component และใช้ Destructuring ดึงค่า props ชื่อ pods ส่งต่อมาจากหน้าหลัก
export default function KubernetesCluster({ pods }) {
  return (
    <div style={{ border: "2px solid #326ce5", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
      <h3 style={{ color: "#326ce5", margin: "0 0 10px 0" }}>☸️ คลัสเตอร์ Kubernetes (Docker Containers)</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {pods.map((pod) => (
          <div key={pod.id} style={{ background: "#e6f0ff", border: "1px solid #326ce5", padding: "10px", borderRadius: "5px", textAlign: "center", minWidth: "140px" }}>
            <div style={{ fontSize: "12px", fontWeight: "bold" }}>🐳 {pod.id}</div>
            <div style={{ fontSize: "11px", color: "green" }}>● {pod.status}</div>
            <div style={{ fontSize: "12px", marginTop: "5px", background: "#fff", padding: "2px", borderRadius: "3px" }}>
              สับไปแล้ว: <b>{pod.processedCount}</b> งาน
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}