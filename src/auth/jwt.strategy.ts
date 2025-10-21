import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (payload.role && !payload.type) {
      if (!token) {
        throw new UnauthorizedException('Token not found');
      }

      const admin = await this.authService.validateAdminToken(token);
      if (!admin) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    return {
      id: payload.sub,
      email: payload.email,
      login: payload.login,
      role: payload.role,
      type: payload.type,
    };
  }
}
