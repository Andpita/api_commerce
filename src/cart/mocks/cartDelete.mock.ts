import { DeleteResult } from 'typeorm';

export const cartDeleteMock: DeleteResult = {
  raw: ['Cart Empty'],
  affected: 1,
};
