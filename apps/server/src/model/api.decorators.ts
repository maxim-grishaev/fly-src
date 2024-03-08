import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export const ApiDateProp = (str: string) =>
  ApiProperty({
    description: `${str}: a UTC date string in ISO format`,
    type: String,
    example: '2021-01-01T12:00:00Z',
  });

export const ApiIdProp = (str: string) =>
  ApiProperty({
    description: str,
    type: String,
    example: 'abc123',
  });

export const ApiDict = (it: Type<unknown>, desc: string) =>
  ApiProperty({
    title: `Record<string, ${it.name}>`,
    description: desc,
    additionalProperties: { $ref: getSchemaPath(it) },
  });
