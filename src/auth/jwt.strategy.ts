import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecreto123', // Debe coincidir con el usado en JwtModule
    });
  }

  async validate(payload: any) {
    // El payload debe incluir el rol
    return { userId: payload.sub, email: payload.email, rol: payload.rol };
  }
} 