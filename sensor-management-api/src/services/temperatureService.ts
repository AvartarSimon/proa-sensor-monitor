import { TemperatureRepository } from '../repositories/temperatureRepository';
import { TimeUtils } from '../utils/timeUtils';
import { TemperatureValidator } from '../validators/temperature';
import {
  TemperatureResponse,
  TemperatureStats,
  TemperatureQueryParams,
  StatsQueryParams,
} from './types';
import { TimeRange } from '../utils/timeUtils';

export class TemperatureService {
  constructor(private temperatureRepository: TemperatureRepository) {}

  async getTemperatureData(params: TemperatureQueryParams): Promise<TemperatureResponse> {
    try {
      // Validate and process query parameters
      const validatedParams = TemperatureValidator.validateTemperatureQuery(params);
      const timeRange = this.calculateTimeRange(validatedParams);
      const limit = this.parseLimit(validatedParams.limit);
      const aggregation = validatedParams.aggregation || 'raw';

      console.log('Fetching temperatures:', {
        from: timeRange.from,
        to: timeRange.to,
        aggregation,
        limit,
      });

      // Fetch data from repository
      const rawData = await this.temperatureRepository.getTemperatureData(timeRange, limit);

      // Apply aggregation if requested
      const aggregatedData = TimeUtils.aggregateData(rawData, aggregation);

      return {
        data: aggregatedData.map((item) => ({
          timestamp: item.timestamp.toISOString(),
          value: item.value,
        })),
        meta: {
          from: timeRange.from.toISOString(),
          to: timeRange.to.toISOString(),
          timescale: validatedParams.timescale || 'custom',
          aggregation,
          totalPoints: rawData.length,
          aggregatedPoints: aggregatedData.length,
        },
      };
    } catch (error) {
      console.error('Error in getTemperatureData service:', error);
      throw error;
    }
  }

  async getTemperatureStats(params: StatsQueryParams): Promise<TemperatureStats> {
    try {
      // Validate and process query parameters
      const validatedParams = TemperatureValidator.validateStatsQuery(params);
      const timeRange = this.calculateTimeRange(validatedParams);

      // Fetch stats from repository
      const stats = await this.temperatureRepository.getTemperatureStats(timeRange);

      // Update meta information
      stats.meta.from = timeRange.from.toISOString();
      stats.meta.to = timeRange.to.toISOString();
      stats.meta.timescale = validatedParams.timescale || 'custom';

      return stats;
    } catch (error) {
      console.error('Error in getTemperatureStats service:', error);
      throw error;
    }
  }

  async getRecentTemperatures(limit: number = 100): Promise<TemperatureResponse> {
    try {
      const data = await this.temperatureRepository.getRecentTemperatures(limit);

      return {
        data: data.map((item) => ({
          timestamp: item.timestamp,
          value: item.value,
        })),
        meta: {
          from:
            data.length > 0
              ? data[0]?.timestamp || new Date().toISOString()
              : new Date().toISOString(),
          to:
            data.length > 0
              ? data[data.length - 1]?.timestamp || new Date().toISOString()
              : new Date().toISOString(),
          timescale: 'recent',
          aggregation: 'raw',
          totalPoints: data.length,
          aggregatedPoints: data.length,
        },
      };
    } catch (error) {
      console.error('Error in getRecentTemperatures service:', error);
      throw error;
    }
  }

  private calculateTimeRange(params: TemperatureQueryParams | StatsQueryParams): TimeRange {
    if (params.from && params.to) {
      return {
        from: TimeUtils.parseDate(params.from),
        to: TimeUtils.parseDate(params.to),
      };
    } else if (params.timescale) {
      return TimeUtils.calculateTimeRange(params.timescale);
    } else {
      // Default to last hour
      return TimeUtils.calculateTimeRange('1h');
    }
  }

  private parseLimit(limit?: string): number {
    if (!limit) return 1000;

    const limitNum = parseInt(limit);
    if (TemperatureValidator.validateLimit(limit)) {
      return limitNum;
    }

    return 1000; // Default limit
  }
}
