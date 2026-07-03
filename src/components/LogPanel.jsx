export default function LogPanel({ logs, onClear }) {
  return (
    <section className="log-panel">
      <div className="log-header">
        <h3 className="section-title">📋 System Log</h3>
        <button className="btn btn--ghost btn--sm" onClick={onClear} aria-label="ล้าง logs ทั้งหมด">
          ล้าง
        </button>
      </div>
      <div className="log-body" role="log" aria-live="polite" aria-label="บันทึกการทำงานของระบบ">
        {logs.length === 0 ? (
          <p className="log-empty">ยังไม่มีกิจกรรม — กดจองตั๋วเพื่อเริ่ม</p>
        ) : (
          logs.map((entry, i) => (
            <div key={i} className="log-entry">
              {entry}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
