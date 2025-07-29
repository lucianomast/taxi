import { Controller, Post, Body, Put, Param, Get, Query, BadRequestException, Req, UseGuards } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { CrearConductorDto } from './dto/crear-conductor.dto';
import { ActualizarConductorDto } from './dto/actualizar-conductor.dto';
import { SolicitarActivacionDto } from './dto/solicitar-activacion.dto';
import { ActivarCuentaDto } from './dto/activar-cuenta.dto';
import { OlvidePasswordDto } from './dto/olvide-password.dto';
import { CambiarPasswordCodigoDto } from './dto/cambiar-password-codigo.dto';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
// import { AuthGuard } from '../auth/auth.guard'; // Descomenta si tienes un guard de autenticación

@ApiTags('conductores')
@Controller('conductores')
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Post('registrar')
  @ApiOperation({ summary: 'Registrar un nuevo conductor' })
  @ApiBody({ type: CrearConductorDto })
  @ApiResponse({
    status: 201,
    description: 'Conductor registrado correctamente',
    schema: {
      example: {
        id: 2,
        idProveedor: 1,
        razonSocial: 'Overtek S.L',
        activoParaAgendados: true,
        activoParaInmediatos: true,
        email: 'martin@example.com',
        dni: '47461872S',
        password: 'miclave',
        marcaCoche: 'Tesla',
        modeloCoche: 's3',
        nombre: 'Martín',
        apellidos: 'Domínguez',
        soyAdmin: true,
        estado: 10,
        licencia: 'jhhj',
        matricula: '1377CVX',
        revisarDistancia: true,
        telefono: '664001824',
        token_pushes: 'd6HoPD0JQm2l8xSsD3D...',
        estadoUsuario: 10,
        logado: true,
        created_at: '2024-06-01T12:00:00.000Z',
        updated_at: null,
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación o conductor ya existe' })
  registrar(@Body() dto: CrearConductorDto) {
    return this.conductoresService.registrar(dto);
  }

  @Put('actualizar/:id')
  actualizar(@Param('id') id: number, @Body() dto: ActualizarConductorDto) {
    return this.conductoresService.actualizar(id, dto);
  }

  // @UseGuards(AuthGuard) // Descomenta si tienes un guard de autenticación
  @Post('cambiar_password')
  async cambiarPassword(@Body() body: { id?: number; password?: string }) {
    console.log('Cambio de password recibido:', body);
    if (!body || !body.id || !body.password) {
      throw new BadRequestException('Faltan datos: id y password son requeridos');
    }
    return this.conductoresService.cambiarPassword(body.id, body.password);
  }

  @Get('get_lista')
  getLista() {
    return this.conductoresService.getLista();
  }

  @Get('getByDni')
  getByDni(@Query('dni') dni: string) {
    return this.conductoresService.getByDni(dni);
  }

  // Endpoints para sistema de activación por email
  @Post('solicitar-activacion')
  @ApiOperation({ 
    summary: 'Solicitar código de activación por email',
    description: 'Envía un código de 6 dígitos al email del conductor para activar su cuenta. Solo requiere el email.'
  })
  @ApiBody({ type: SolicitarActivacionDto })
  @ApiResponse({
    status: 200,
    description: 'Código de activación enviado',
    schema: {
      example: {
        message: 'Código de activación enviado al email',
        codigo: '123456',
        expiracion: '2024-01-15T14:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado' })
  solicitarActivacion(@Body() dto: SolicitarActivacionDto) {
    return this.conductoresService.solicitarActivacion(dto);
  }

  @Post('activar-cuenta')
  @ApiOperation({ 
    summary: 'Activar cuenta con código',
    description: 'Activa la cuenta del conductor usando el código enviado por email. Solo requiere email y código.'
  })
  @ApiBody({ type: ActivarCuentaDto })
  @ApiResponse({
    status: 200,
    description: 'Cuenta activada correctamente',
    schema: {
      example: {
        message: 'Cuenta activada correctamente',
        success: true
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Código incorrecto o expirado' })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado' })
  activarCuenta(@Body() dto: ActivarCuentaDto) {
    return this.conductoresService.activarCuenta(dto);
  }

  @Get('verificar-codigo')
  @ApiOperation({ 
    summary: 'Verificar código de activación',
    description: 'Verifica si un código de activación es válido sin activar la cuenta'
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de verificación',
    schema: {
      example: {
        valido: true,
        message: 'Código válido'
      }
    }
  })
  verificarCodigo(
    @Query('email') email: string,
    @Query('codigo') codigo: string
  ) {
    return this.conductoresService.verificarCodigo(email, codigo);
  }

  // Endpoints para recuperación de contraseña
  @Post('olvide-password')
  @ApiOperation({ 
    summary: 'Solicitar código de recuperación de contraseña',
    description: 'Envía un código de 6 dígitos al email del conductor para recuperar su contraseña'
  })
  @ApiBody({ type: OlvidePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Código de recuperación enviado',
    schema: {
      example: {
        message: 'Código de recuperación enviado al email',
        expiracion: '2024-01-15T14:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado' })
  olvidePassword(@Body() dto: OlvidePasswordDto) {
    return this.conductoresService.olvidePassword(dto);
  }

  @Post('cambiar-password-codigo')
  @ApiOperation({ 
    summary: 'Cambiar contraseña con código',
    description: 'Cambia la contraseña del conductor usando el código enviado por email'
  })
  @ApiBody({ type: CambiarPasswordCodigoDto })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada correctamente',
    schema: {
      example: {
        message: 'Contraseña cambiada correctamente',
        success: true
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Código incorrecto o expirado' })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado' })
  cambiarPasswordConCodigo(@Body() dto: CambiarPasswordCodigoDto) {
    return this.conductoresService.cambiarPasswordConCodigo(dto);
  }
} 