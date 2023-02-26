import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule,
            ConfigModule.forRoot(),
            JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '10h' }, 
                // 10h would be better, but we can test with 60s
            }),
        ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
