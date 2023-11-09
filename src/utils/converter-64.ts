import { PayloadDTO } from '../auth/dtos/payload.dto';

export const authPayload = (authorization: string): PayloadDTO | undefined => {
  const authArray = authorization.split('.');

  if (authArray.length !== 3 || !authArray) {
    return undefined;
  }

  const payload = JSON.parse(
    Buffer.from(authArray[1], 'base64').toString('ascii'),
  );

  return payload;
};
