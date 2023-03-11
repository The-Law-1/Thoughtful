import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor( private jwtService: JwtService) {}

    // ? why does this return {}
    async authenticate(password: string): Promise<boolean> {
        // find password in environment
        // TODO probably should store this encrypted, and decrypt it here
        // return true;
        if (password === process.env.PASSWORD) {
            return true;
        }
        return false;
    }

    async createJWT() {
        // * this feels weird
        const payload = { username: process.env.USERNAME, sub: process.env.USER_ID };

        // get a timestamp for now + 10h

        return {
            access_token: this.jwtService.sign(payload)
        };
    }

//   async validateUser(username: string, pass: string): Promise<any> {
//     const user = await this.usersService.findOne(username);
//     if (user && user.password === pass) {
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }
}