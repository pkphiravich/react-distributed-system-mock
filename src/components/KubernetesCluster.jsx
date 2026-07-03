import PodCard from "./PodCard";

export default function KubernetesCluster({ pods }) {
  const running = pods.filter((p) => p.status === "Running").length;

  return (
    <section className="k8s-cluster" aria-label="Kubernetes Cluster">
      <div className="section-header">
        <h3 className="section-title">☸️ Kubernetes Cluster</h3>
        <span className="section-badge">
          {running}/{pods.length} Pods ทำงานอยู่
        </span>
      </div>
      <div className="pod-grid">
        {pods.map((pod) => (
          <PodCard key={pod.id} pod={pod} />
        ))}
      </div>
    </section>
  );
}
