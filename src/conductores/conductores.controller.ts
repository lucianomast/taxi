import { Controller, Post, Body, Put, Param, Get, Query, BadRequestException, Req, UseGuards } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { CrearConductorDto } from './dto/crear-conductor.dto';
import { ActualizarConductorDto } from './dto/actualizar-conductor.dto';
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
} 