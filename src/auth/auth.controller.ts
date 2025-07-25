import { Controller, Post, Body, BadRequestException, Get, Query, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login de usuario (conductor)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        message: 'Login exitoso',
        user: {
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
        },
        token: 'mock-jwt-token'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() body: LoginDto) {
    console.log('Intento de login:', body); // Mostrar info recibida en el servidor
    if (!body || !body.usermail || !body.password) {
      throw new BadRequestException('Faltan credenciales: usermail y password son requeridos');
    }
    return this.authService.login(body.usermail, body.password);
  }
} 