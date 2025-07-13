import './Center.css';

export default function Center() {
  return (
    <div className="center">
      <div className="farm-scene">
        {/* Farm Background Image */}
        <div className="farm-background">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
            alt="Farm landscape with crops, cows, and farmhouse"
            className="farm-image"
          />
        </div>

        {/* Proa-Ede Temperature Monitor */}
        <div className="proa-monitor">
          <div className="monitor-body">
            <div className="monitor-screen">
              <div className="monitor-title">Proa-Ede</div>
              <div className="temperature-display">
                <span className="temp-value">24.5</span>
                <span className="temp-unit">°C</span>
              </div>
              <div className="humidity-display">
                <span className="humidity-label">Humidity:</span>
                <span className="humidity-value">65%</span>
              </div>
            </div>
            <div className="monitor-stand"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
