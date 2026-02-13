import { HttpStatus } from "@nestjs/common";
import { BaseException } from "./error.baseException";
import { ErrorCodeEnum } from "./error.enum";


// lib/exceptions/profile.exception.ts

export class AccessTokenExpiredException extends BaseException {
    constructor() {
        super(ErrorCodeEnum.AccessTokenExpired, "AccessTokenExpired", HttpStatus.UNAUTHORIZED);
    }
}

export class AccessTokenInvalidTokenException extends BaseException {
    constructor() {
        super(ErrorCodeEnum.AccessTokenInvalid, "AccessTokenInvalid", HttpStatus.UNAUTHORIZED);
    }
}

export class RefreshTokenExpiredException extends BaseException {
    constructor() {
        super(ErrorCodeEnum.RefreshTokenExpired, "RefreshTokenExpired", HttpStatus.UNAUTHORIZED);
    }
}

export class RefreshTokenInvalidTokenException extends BaseException {
    constructor() {
        super(ErrorCodeEnum.RefreshTokenInvalid, "RefreshTokenInvalid", HttpStatus.UNAUTHORIZED);
    }
}

export class RoleException extends BaseException {
    constructor() {
        super(ErrorCodeEnum.RoleException, "RoleException", HttpStatus.UNAUTHORIZED);
    }
}

export class BlockIpException extends BaseException {
    constructor() {
        super(ErrorCodeEnum.BlockIp, "BlockIp", HttpStatus.UNAUTHORIZED);
    }
}

export class UnCatchedException extends BaseException {
    constructor() {
        super("9999", "UncatchedException", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}