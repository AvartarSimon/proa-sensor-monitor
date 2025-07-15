import './App.css';
import RecentTemperatureChart from './pages/Home/left/RecentTemperatureChart';
import SensorControl from './pages/Home/left/SensorControl';
import TemperatureDashboard from './pages/Home/left/TemperatureDashboard';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Proa Monitor Dashboard</h1>
        <p>Real-time temperature monitoring and control</p>
      </header>

      <main className="app-main">
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
    </div>
  );
}

export default App;
