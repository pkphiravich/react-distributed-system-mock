export default function SimControls({ consumerSpeed, setConsumerSpeed, hpaThreshold, setHpaThreshold }) {
  return (
    <div className="sim-controls">
      <label className="control-item">
        <div className="control-label">
          <span>⚡ ความเร็ว Consumer</span>
          <span className="control-value">{consumerSpeed / 1000}s</span>
        </div>
        <input
          type="range"
          min="500"
          max="5000"
          step="500"
          value={consumerSpeed}
          onChange={(e) => setConsumerSpeed(Number(e.target.value))}
          aria-label="ปรับความเร็ว Kafka Consumer"
        />
      </label>
      <label className="control-item">
        <div className="control-label">
          <span>📊 HPA เริ่มสเกลที่</span>
          <span className="control-value">{hpaThreshold} items</span>
        </div>
        <input
          type="range"
          min="2"
          max="5"
          step="1"
          value={hpaThreshold}
          onChange={(e) => setHpaThreshold(Number(e.target.value))}
          aria-label="ปรับ HPA threshold"
        />
      </label>
    </div>
  );
}
