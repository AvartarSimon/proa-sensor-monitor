export interface TimeRange {
  from: Date;
  to: Date;
}

export interface AggregatedDataPoint {
  timestamp: Date;
  value: number;
  count?: number;
}

export class TimeUtils {
  static calculateTimeRange(timescale: string): TimeRange {
    const now = new Date();
    const to = now;
    let from: Date;

    switch (timescale.toLowerCase()) {
      case '1h':
      case '1hour':
        from = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
      case '6hours':
        from = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case '1d':
      case '1day':
        from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
      case '7days':
      case '1w':
      case '1week':
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
      case '30days':
      case '1m':
      case '1month':
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        // Default to last hour
        from = new Date(now.getTime() - 60 * 60 * 1000);
    }

    return { from, to };
  }

  static aggregateData(data: any[], aggregation: string): AggregatedDataPoint[] {
    if (aggregation === 'raw' || data.length === 0) {
      return data.map((item) => ({
        timestamp: new Date(item.timestamp),
        value: item.value,
      }));
    }

    const aggregated: AggregatedDataPoint[] = [];
    const interval = this.getAggregationInterval(aggregation);

    let currentInterval = Math.floor(data[0].timestamp.getTime() / interval) * interval;
    let intervalData: any[] = [];

    for (const point of data) {
      const pointTime = new Date(point.timestamp).getTime();
      const pointInterval = Math.floor(pointTime / interval) * interval;

      if (pointInterval === currentInterval) {
        intervalData.push(point);
      } else {
        if (intervalData.length > 0) {
          const avgValue = intervalData.reduce((sum, p) => sum + p.value, 0) / intervalData.length;
          aggregated.push({
            timestamp: new Date(currentInterval),
            value: Math.round(avgValue * 100) / 100,
            count: intervalData.length,
          });
        }
        currentInterval = pointInterval;
        intervalData = [point];
      }
    }

    // Add the last interval
    if (intervalData.length > 0) {
      const avgValue = intervalData.reduce((sum, p) => sum + p.value, 0) / intervalData.length;
      aggregated.push({
        timestamp: new Date(currentInterval),
        value: Math.round(avgValue * 100) / 100,
        count: intervalData.length,
      });
    }

    return aggregated;
  }

  private static getAggregationInterval(aggregation: string): number {
    switch (aggregation) {
      case '1min':
        return 60000;
      case '5min':
        return 300000;
      case '15min':
        return 900000;
      case '1hour':
        return 3600000;
      default:
        return 60000;
    }
  }

  static formatDate(date: Date): string {
    return date.toISOString();
  }

  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  static isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}
