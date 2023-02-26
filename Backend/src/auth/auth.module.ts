import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule,
            ConfigModule.forRoot(),
            JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '60s' }, // what does this mean?
                // why would I want my token to expire in 60 seconds?
                // 10h would be better
            }),
        ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
