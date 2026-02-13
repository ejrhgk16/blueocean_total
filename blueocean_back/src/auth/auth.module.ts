import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from './passport_access.jwt';
import { RefreshTokenStrategy } from './passport_refresh.jwt';
import { AccessAuthGuard } from './passport_access_guard.jwt';
import { RolesGuard } from './role.gaurd';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
      }),

      inject: [ConfigService],
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository,AccessTokenStrategy, RefreshTokenStrategy, AccessAuthGuard, RolesGuard],
})
export class AuthModule {}
