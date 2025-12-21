import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const currentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const requrest = ctx.switchToHttp().getRequest();

        return requrest.user;
    }
);