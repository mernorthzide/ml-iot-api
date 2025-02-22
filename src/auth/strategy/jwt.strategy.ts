import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(payload: any, req: any) {
    // ตรวจสอบว่าเป็น hard coded token หรือไม่
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token === jwtConstants.hardCodedToken) {
      return { sub: 'hardcoded', iat: Date.now() };
    }

    // ถ้าไม่ใช่ hard coded token ให้ตรวจสอบ payload ตามปกติ
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
