import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { ApiDateProp } from './api.decorators';

export class APIItem<T> {
  @Exclude()
  protected _d: T;
  constructor(d: T) {
    this._d = d;
  }
}

export class APIDevData extends APIItem<{
  respDuration: number;
  now: string;
}> {
  static create =
    process.env.NODE_ENV === 'development'
      ? (perfStart: number) => new APIDevData(perfStart)
      : () => undefined;
  constructor(perfStart: number) {
    super({
      respDuration: performance.now() - perfStart,
      now: new Date().toISOString(),
    });
  }

  @ApiProperty({
    description: [
      'The performance of the response in milliseconds.',
      '/!\\ this is sensitive data, exposed here only to illustrate',
    ].join('\n'),
    type: Number,
    example: '1.123',
  })
  perf = this._d.respDuration;

  @ApiDateProp('The current server time')
  now = this._d.now;
}

export type APIRespParams<T> = {
  data: T;
  perfStart: number;
};

export class APIOkWithMeta<
  T extends APIRespParams<unknown>,
> extends APIItem<T> {
  static swagger = <T extends Type<unknown>>(it: T) => {
    class APIOkWithMetaOfT extends APIOkWithMeta<any> {
      _d: any;
      @ApiProperty({
        title: it.name,
        description: 'The response data',
        type: it,
      })
      data = null;
    }
    return APIOkWithMetaOfT;
  };

  static create = <T extends APIRespParams<unknown>>(d: T) =>
    new APIOkWithMeta<T>(d);

  data = this._d.data;

  @ApiPropertyOptional({
    description: [
      'The response dev metadata.',
      'Only available if NODE_ENV=development',
    ].join('\n'),
    type: APIDevData,
  })
  dev = APIDevData.create(this._d.perfStart);
}
