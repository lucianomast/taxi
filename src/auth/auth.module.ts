import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
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
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard], // Exportar el guard para usar en otros módulos
})
export class AuthModule {} 