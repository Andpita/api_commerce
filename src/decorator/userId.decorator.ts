import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { authPayload } from '../utils/converter-64';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const { authorization } = context.switchToHttp().getRequest().headers;

    if (!authorization) {
      throw new ForbiddenException('Faça Login para continuar.');
    }

    const auth = authorization.split(' ');

    const loginPayload = authPayload(auth[1]);

    return loginPayload?.id;
  },
);
