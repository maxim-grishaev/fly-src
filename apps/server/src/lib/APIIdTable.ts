import { Expose } from 'class-transformer';
import {
  createIdTableByArray,
  getId,
  selectFromIdTable,
  writeToIdTable,
} from './createIdTableByArray';
import { SerializeOptions, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ApiDict } from '../model/api.decorators';

@SerializeOptions({ strategy: 'excludeAll' })
export class APIIdTable<T, ID extends keyof any> {
  byId: Record<ID, T>;

  @Expose()
  @ApiProperty({
    description: 'Array of IDs',
    type: [String],
    example: ['abc123', 'def456'],
  })
  ids: ID[];

  static getId = getId;

  #getId: (item: T) => ID;

  static swagger = <T extends Type<unknown>>(it: T) => {
    class APIIdTableOfT extends APIIdTable<any, any> {
      @Expose()
      @ApiDict(it, 'A map of IDs to items')
      byId = {};
    }
    return APIIdTableOfT;
  };

  constructor(arr: T[], getId: (it: T) => ID) {
    this.#getId = getId;
    const data = createIdTableByArray(arr, getId);

    this.ids = data.ids;
    this.byId = data.byId;
  }

  write(item: T) {
    return writeToIdTable(this, this.#getId, item);
  }

  select(filter: (it: T) => boolean) {
    return selectFromIdTable(this, filter);
  }

  static createByArray = <T, ID extends keyof any>(
    arr: T[],
    getId: (it: T) => ID,
  ) => new APIIdTable(arr, getId);
}
