import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conductor } from '../conductores/entities/conductor.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Conductor)
    private readonly conductoresRepository: Repository<Conductor>,
    private readonly jwtService: JwtService,
  ) {}

  async login(usermail: string, password: string) {
    if (usermail === '47461872S' && password === 'miclave') {
      const user = {
        id: 2,
        idProveedor: -1,
        razonSocial: 'Overtek S.L',
        activoParaAgendados: 0,
        activoParaInmediatos: 0,
        email: 'martin@example.com',
        dni: '47461872S',
        marcaCoche: 'Tesla',
        modeloCoche: 's3',
        nombre: 'Martín',
        apellidos: 'Domínguez',
        soyAdmin: 1,
        estado: 10,
        licencia: 'jhhj',
        matricula: '1377CVX',
        revisarDistancia: 1,
        telefono: '664001824',
        token_pushes: 'd6HoPD0JQm2l8xSsD3D...',
        estadoUsuario: 10,
        logado: 1,
        ultimaPenalizacion: null,
        ultimoServicioNoInmediato_at: '2022-05-04 16:33:21',
        created_at: '2021-10-15',
        updated_at: '2022-10-05',
        deleted_at: null
      };
      // Determinar el rol
      let rol = 'conductor';
      if (user.soyAdmin) rol = 'admin';
      // Generar el token
      const payload = { sub: user.id, email: user.email, rol };
      const token = this.jwtService.sign(payload);
      return {
        message: 'Login exitoso',
        user,
        token,
      };
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // ...resto del servicio
} 