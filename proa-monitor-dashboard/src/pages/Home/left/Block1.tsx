import ReactECharts from 'echarts-for-react';
import React from 'react';
import { ErrorDisplay } from '../../../components/ErrorDisplay';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { StatsCard } from '../../../components/StatsCard';
import { TimescaleSelector } from '../../../components/TimescaleSelector';
import { useTemperatureChart } from '../../../hooks/useTemperatureChart';
import { useTemperatureWarning } from '../../../hooks/useTemperatureWarning';
import { formattedTime } from '../../../utils';
import { useWarning } from '../../../utils/useWarning';
import './Block1.css';

const TemperatureDashboard: React.FC = () => {
  const {
    data,
    stats,
    loading,
    error,
    selectedTimescale,
    handleTimescaleChange,
    retry,
    getChartOption,
    TIMESCALES,
  } = useTemperatureChart();

  const { WarningDisplay } = useWarning();
  
  // Handle temperature warnings
  useTemperatureWarning(stats);

  if (loading && data?.length === 0) {
    return <LoadingSpinner message="Loading temperature dashboard..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        onRetry={retry}
        title="Error Loading Dashboard"
      />
    );
  }

  if (!data?.length) {
    return <div className="no-data">No data available</div>;
  }

  return (
    <div className="temperature-dashboard">
      <WarningDisplay />
      
      <div className="dashboard-header">
        <h2>Temperature Dashboard</h2>
        <TimescaleSelector
          selectedTimescale={selectedTimescale}
          timescales={TIMESCALES}
          onTimescaleChange={handleTimescaleChange}
        />
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <StatsCard
            icon="📊"
            label="Average"
            value={stats.stats.averageTemperature.toFixed(1)}
            unit="°C"
          />
          <StatsCard
            icon="📉"
            label="Minimum"
            value={stats.stats.minTemperature.toFixed(1)}
            unit="°C"
          />
          <StatsCard
            icon="📈"
            label="Maximum"
            value={stats.stats.maxTemperature.toFixed(1)}
            unit="°C"
          />
          <StatsCard
            icon="📏"
            label="Range"
            value={stats.stats.temperatureRange.toFixed(1)}
            unit="°C"
          />
          <StatsCard
            icon="🔢"
            label="Readings"
            value={stats.stats.totalReadings}
          />
          <StatsCard
            icon="📊"
            label="Std Dev"
            value={stats.stats.standardDeviation.toFixed(2)}
            unit="°C"
          />
        </div>
      )}

      {/* Chart Section */}
      <div className="chart-section">
        <ReactECharts option={getChartOption()} style={{ height: 400 }} />
      </div>

      {/* Data Summary */}
      {stats && (
        <div className="data-summary">
          <h3>Data Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <strong>First Reading:</strong> {formattedTime(new Date(stats.stats.firstReading))}
            </div>
            <div className="summary-item">
              <strong>Last Reading:</strong> {formattedTime(new Date(stats.stats.lastReading))}
            </div>
            <div className="summary-item">
              <strong>Time Range:</strong> {selectedTimescale}
            </div>
            <div className="summary-item">
              <strong>Data Points:</strong> {data.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemperatureDashboard;
