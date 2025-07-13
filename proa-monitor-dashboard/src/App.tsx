import "./App.css";
import RecentTemperatureChart from "./pages/Home/left/RecentTemperatureChart";
import SensorControl from "./pages/Home/left/SensorControl";
import TemperatureDashboard from "./pages/Home/left/TemperatureDashboard";

function App() {
  return (
    <div className="app1">
      <header className="app-header1">
        <h1>Modbus Sensor Simulator Dashboard</h1>
        <p>Real-time temperature monitoring and control</p>
      </header>

      <main className="app-main1">
        <div className="dashboard-grid">
          {/* Temperature Dashboard Section */}
          <section className="chart-section">
            <TemperatureDashboard />
          </section>
        </div>
        {/* Sensor Control Section */}
        <section className="control-section">
          <SensorControl />
        </section>
        <section className="chart-section">
          <RecentTemperatureChart />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Modbus Sensor Simulator - Built with React, ECharts, and TypeScript
        </p>
      </footer>
    </div>
  );
}

export default App;
