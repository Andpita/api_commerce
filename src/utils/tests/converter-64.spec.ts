import { authPayload } from '../converter-64';

describe('Test converter64', () => {
  it('should authPayload error ', () => {
    const authorization = '123.123.123';
    const loginPayload = authPayload(authorization[1]);

    expect(loginPayload).toEqual(undefined);
  });
});
