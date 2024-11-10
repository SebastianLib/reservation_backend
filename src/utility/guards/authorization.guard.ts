import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, mixin } from "@nestjs/common";

export const AuthorizeGuard = (allowedRoles: string[]) => {
    class RolesGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext): boolean {
            const request = context.switchToHttp().getRequest();
            const hasRole = allowedRoles.includes(request?.currentUser?.role);
            
            if (hasRole) return true;

            throw new UnauthorizedException("Sorry, you are not authorized");
        }
    }
    const guard = mixin(RolesGuardMixin)
    return guard;
}
