import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/resources/modules/user/entities/user.entity';

export const GetUserLogged = createParamDecorator(
  (_, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
