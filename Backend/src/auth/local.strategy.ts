import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

// using passport might be overkill here, I could probably get away with just using a route
// * although I guess it's handy for builtin guards

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // * in fact this probably won't work because it should return a user object
  // * I'm not sure what use this serves, it's supposed to inform req.user but I don't need that at all
  async validate(username:string, password: string): Promise<any> {
    const passwordCorrect = await this.authService.authenticate(password);
    if (!passwordCorrect) {
      throw new UnauthorizedException();
    }
    // maybe you return a user object based on the environment?
    return passwordCorrect;
  }
}