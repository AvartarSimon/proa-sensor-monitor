import { PrismaClient } from '../../generated/prisma/client';
import { TemperatureData, TemperatureStats, TimeRange } from './types';

export class TemperatureRepository {
  constructor(private prisma: PrismaClient) {}

  async getTemperatureData(timeRange: TimeRange, limit: number = 1000): Promise<TemperatureData[]> {
    try {
      const readings = await this.prisma.sensor_readings.findMany({
        where: {
          timestamp: {
            gte: timeRange.from,
            lte: timeRange.to,
          },
        },
        select: {
          timestamp: true,
          temperature_celsius: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
      });

      return readings.map((reading: { timestamp: Date; temperature_celsius: any }) => ({
        timestamp: reading.timestamp.toISOString(),
        value: Number(reading.temperature_celsius),
      }));
    } catch (error) {
      console.error('Database error in getTemperatureData:', error);
      throw new Error('Failed to fetch temperature data from database');
    }
  }

  async getTemperatureStats(timeRange: TimeRange): Promise<TemperatureStats> {
    try {
      const stats = await this.prisma.sensor_readings.aggregate({
        where: {
          timestamp: {
            gte: timeRange.from,
            lte: timeRange.to,
          },
        },
        _count: {
          id: true,
        },
        _avg: {
          temperature_celsius: true,
        },
        _min: {
          temperature_celsius: true,
          timestamp: true,
        },
        _max: {
          temperature_celsius: true,
          timestamp: true,
        },
      });

      // Get standard deviation using raw query since Prisma doesn't support it in aggregate
      const stdDevResult = await this.prisma.$queryRaw<Array<{ std_dev: number }>>`
                SELECT STDDEV(temperature_celsius) as std_dev
                FROM sensor_readings 
                WHERE timestamp >= ${timeRange.from} AND timestamp <= ${timeRange.to}
            `;

      const stdDev = stdDevResult[0]?.std_dev || 0;
      const avgTemp = stats._avg.temperature_celsius || 0;
      const minTemp = stats._min.temperature_celsius || 0;
      const maxTemp = stats._max.temperature_celsius || 0;
      const totalReadings = stats._count.id || 0;

      return {
        stats: {
          totalReadings,
          averageTemperature: Number(avgTemp),
          minTemperature: Number(minTemp),
          maxTemperature: Number(maxTemp),
          standardDeviation: Number(stdDev),
          temperatureRange: Number(maxTemp) - Number(minTemp),
          firstReading: stats._min.timestamp?.toISOString() || timeRange.from.toISOString(),
          lastReading: stats._max.timestamp?.toISOString() || timeRange.to.toISOString(),
        },
        meta: {
          from: timeRange.from.toISOString(),
          to: timeRange.to.toISOString(),
          timescale: 'custom',
        },
      };
    } catch (error) {
      console.error('Database error in getTemperatureStats:', error);
      throw new Error('Failed to fetch temperature statistics from database');
    }
  }

  async getRecentTemperatures(limit: number = 100): Promise<TemperatureData[]> {
    try {
      const readings = await this.prisma.sensor_readings.findMany({
        select: {
          timestamp: true,
          temperature_celsius: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
      });

      return readings.reverse().map((reading: { timestamp: Date; temperature_celsius: any }) => ({
        timestamp: reading.timestamp.toISOString(),
        value: Number(reading.temperature_celsius),
      }));
    } catch (error) {
      console.error('Database error in getRecentTemperatures:', error);
      throw new Error('Failed to fetch recent temperature data from database');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}
