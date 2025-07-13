import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import React, { useEffect, useRef, useState } from "react";
import { sensorDataApi, type TemperatureData } from "../../../services/sensorDataApi";

type DataPoint = {
  time: number; // Unix timestamp
  value: number;
};

const RecentTemperatureChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Fetch recent temperature data from API
  const fetchRecentTemperatureData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get recent temperature data with limit 100
      const response = await sensorDataApi.getRecentTemperatures(100);

      // Transform API data to chart format
      const chartData: DataPoint[] = response?.data?.map(
        (item: TemperatureData) => ({
          time: new Date(item.timestamp).getTime(),
          value: item.value,
        })
      );

      setData(chartData);
    } catch (err) {
      console.error("Error fetching temperature data:", err);
      setError("Failed to load temperature data");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and periodic updates
  useEffect(() => {
    // Fetch data immediately
    fetchRecentTemperatureData();

    // Set up periodic updates every 5 seconds
    intervalRef.current = window.setInterval(() => {
      fetchRecentTemperatureData();
    }, 5000); // 5 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const option: echarts.EChartsOption = {
    title: {
      text: "Recent Temperature Data (Last 100 Readings)",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: "{b} : {c} °C",
    },
    xAxis: {
      type: "time",
      name: "Time",
    },
    yAxis: {
      type: "value",
      name: "°C",
      min: "dataMin",
      max: "dataMax",
    },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
      {
        type: "inside",
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: "Temperature",
        type: "line",
        showSymbol: false,
        smooth: true,
        areaStyle: {
          opacity: 0.3,
        },
        data: data?.map((d) => [d.time, d.value]),
      },
    ],
  };

  if (loading && data?.length === 0) {
    return (
      <div
        style={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading temperature data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "red",
        }}
      >
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="recent-temperature-chart">
      <h3>Recent real time temperature chart: Update every 5 seconds</h3>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
};

export default RecentTemperatureChart;
