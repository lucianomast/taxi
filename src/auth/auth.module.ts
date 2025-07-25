import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conductor } from '../conductores/entities/conductor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conductor]),
    JwtModule.register({
      secret: 'supersecreto123', // Cambia esto por una variable de entorno en producción
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {} 