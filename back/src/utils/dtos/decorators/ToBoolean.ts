import { Transform } from 'class-transformer';

export function ToBoolean() {
  return Transform(({ value }): boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  });
}