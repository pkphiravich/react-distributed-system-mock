export default function KubernetesCluster({ pods }) {
  return (
    <section className="k8s-cluster" aria-label="Kubernetes Cluster">
      <h3 className="k8s-cluster__title">☸️ คลัสเตอร์ Kubernetes (Docker Containers)</h3>
      <div className="pod-grid">
        {pods.map((pod) => (
          <div
            key={pod.id}
            className={`pod pod--${pod.status.toLowerCase()}`}
            aria-label={`${pod.name} สถานะ ${pod.status}`}
          >
            <div className="pod__name">🐳 {pod.name}</div>
            <div className={`pod__status pod__status--${pod.status.toLowerCase()}`}>
              ● {pod.status}
            </div>
            <div className="pod__count">
              สับไปแล้ว: <b>{pod.processedCount}</b> งาน
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
