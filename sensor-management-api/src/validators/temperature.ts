import { TemperatureQueryParams, StatsQueryParams, SensorControlParams } from '../services/types';

export class TemperatureValidator {
  static validateTemperatureQuery(params: any): TemperatureQueryParams {
    const validated: TemperatureQueryParams = {};

    if (params.from && typeof params.from === 'string') {
      validated.from = params.from;
    }

    if (params.to && typeof params.to === 'string') {
      validated.to = params.to;
    }

    if (params.timescale && typeof params.timescale === 'string') {
      validated.timescale = params.timescale;
    }

    if (params.aggregation && typeof params.aggregation === 'string') {
      validated.aggregation = params.aggregation;
    }

    if (params.limit && typeof params.limit === 'string') {
      validated.limit = params.limit;
    }

    return validated;
  }

  static validateStatsQuery(params: any): StatsQueryParams {
    const validated: StatsQueryParams = {};

    if (params.from && typeof params.from === 'string') {
      validated.from = params.from;
    }

    if (params.to && typeof params.to === 'string') {
      validated.to = params.to;
    }

    if (params.timescale && typeof params.timescale === 'string') {
      validated.timescale = params.timescale;
    }

    return validated;
  }

  static validateControlParams(params: any): SensorControlParams {
    const validParams: SensorControlParams = {};

    if (
      params.period !== undefined &&
      typeof params.period === 'number' &&
      params.period >= 100 &&
      params.period <= 10000
    ) {
      validParams.period = params.period;
    }

    if (
      params.amplitude !== undefined &&
      typeof params.amplitude === 'number' &&
      params.amplitude >= 0 &&
      params.amplitude <= 50
    ) {
      validParams.amplitude = params.amplitude;
    }

    if (params.status !== undefined) {
      if (typeof params.status === 'boolean') {
        validParams.status = params.status;
      } else if (typeof params.status === 'string') {
        validParams.status = params.status === 'true';
      }
    }

    return validParams;
  }

  static validateTimescale(timescale: string): boolean {
    const validTimescales = [
      '1h',
      '1hour',
      '6h',
      '6hours',
      '1d',
      '1day',
      '7d',
      '7days',
      '1w',
      '1week',
      '30d',
      '30days',
      '1m',
      '1month',
    ];
    return validTimescales.includes(timescale.toLowerCase());
  }

  static validateAggregation(aggregation: string): boolean {
    const validAggregations = ['raw', '1min', '5min', '15min', '1hour'];
    return validAggregations.includes(aggregation);
  }

  static validateLimit(limit: string): boolean {
    const limitNum = parseInt(limit);
    return !isNaN(limitNum) && limitNum > 0 && limitNum <= 10000;
  }
}
