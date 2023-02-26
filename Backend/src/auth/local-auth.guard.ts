
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// * what am I supposed to do here?
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}