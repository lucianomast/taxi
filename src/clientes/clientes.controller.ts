import { Controller, Post, Body, BadRequestException, Put, Param, Get, Query } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CrearClienteDto } from './dto/crear-cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';
import { GetLocationDto } from './dto/get-location.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post('registrar')
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiBody({ type: CrearClienteDto })
  @ApiResponse({
    status: 201,
    description: 'Cliente registrado correctamente',
    schema: {
      example: {
        id: 67,
        nombre: 'Ana',
        telefono: '600000001',
        prefijo: '+34',
        ocultarTelefono: false,
        email: 'ana@correo.com',
        informacionCliente: 'Cliente frecuente',
        informacionAdicional: '',
        estadoUsuario: 10,
        apellidos: 'Pérez Mora',
        direccionHabitual: 'C. Inventada, 123, 28000 Madrid, España',
        empresaId: 23,
        lat: '40.4000000',
        lon: '-3.7000000',
        created_at: '2024-06-01T12:00:00.000Z',
        updated_at: null,
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 400, description: 'El teléfono ya está asociado a un cliente o error de validación' })
  async registrar(@Body() body: CrearClienteDto) {
    try {
      const cliente = await this.clientesService.registrar(body);
      return {
        id: cliente.id,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        prefijo: cliente.prefijo,
        ocultarTelefono: !!cliente.ocultarTelefono,
        email: cliente.email,
        informacionCliente: cliente.informacionCliente,
        informacionAdicional: cliente.informacionAdicional,
        estadoUsuario: cliente.estadoUsuario,
        apellidos: cliente.apellidos,
        direccionHabitual: cliente.direccionHabitual,
        empresaId: cliente.empresaId,
        lat: cliente.lat,
        lon: cliente.lon,
        created_at: cliente.created_at,
        updated_at: cliente.updated_at,
        deleted_at: cliente.deleted_at,
      };
    } catch (e) {
      throw new BadRequestException(e.message || 'Error al registrar cliente');
    }
  }

  @Put('actualizar/:id')
  @ApiOperation({ summary: 'Actualizar un cliente existente' })
  @ApiBody({ type: ActualizarClienteDto })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado correctamente',
    schema: {
      example: {
        id: 67,
        nombre: 'Ana',
        telefono: '600000001',
        prefijo: '+34',
        ocultarTelefono: false,
        email: 'ana@correo.com',
        informacionCliente: 'Cliente frecuente',
        informacionAdicional: '',
        estadoUsuario: 10,
        apellidos: 'Pérez Mora',
        direccionHabitual: 'C. Inventada, 123, 28000 Madrid, España',
        empresaId: 23,
        lat: '40.4000000',
        lon: '-3.7000000',
        created_at: '2024-06-01T12:00:00.000Z',
        updated_at: '2024-07-25T12:00:00.000Z',
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async actualizar(@Param('id') id: number, @Body() body: ActualizarClienteDto) {
    return this.clientesService.actualizar(id, body);
  }

  @Get('get_lista')
  @ApiOperation({ summary: 'Obtener la lista de todos los clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes',
    schema: {
      example: [
        {
          id: 67,
          nombre: 'Ana',
          telefono: '600000001',
          prefijo: '+34',
          ocultarTelefono: false,
          email: 'ana@correo.com',
          informacionCliente: 'Cliente frecuente',
          informacionAdicional: '',
          estadoUsuario: 10,
          apellidos: 'Pérez Mora',
          direccionHabitual: 'C. Inventada, 123, 28000 Madrid, España',
          empresaId: 23,
          lat: '40.4000000',
          lon: '-3.7000000',
          created_at: '2024-06-01T12:00:00.000Z',
          updated_at: null,
          deleted_at: null
        }
      ]
    }
  })
  async getLista() {
    return this.clientesService.getLista();
  }

  @Get('getUser')
  @ApiOperation({ summary: 'Buscar cliente por teléfono' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
    schema: {
      example: {
        id: 67,
        nombre: 'Ana',
        telefono: '600000001',
        prefijo: '+34',
        ocultarTelefono: false,
        email: 'ana@correo.com',
        informacionCliente: 'Cliente frecuente',
        informacionAdicional: '',
        estadoUsuario: 10,
        apellidos: 'Pérez Mora',
        direccionHabitual: 'C. Inventada, 123, 28000 Madrid, España',
        empresaId: 23,
        lat: '40.4000000',
        lon: '-3.7000000',
        created_at: '2024-06-01T12:00:00.000Z',
        updated_at: null,
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async getUser(@Query('telefono') telefono: string) {
    return this.clientesService.getUser(telefono);
  }

  @Get('get_location')
  @ApiOperation({ 
    summary: 'Obtener coordenadas de una dirección',
    description: 'Convierte una dirección en coordenadas de latitud y longitud usando OpenStreetMap/Nominatim. Utilizado automáticamente al crear servicios.'
  })
  @ApiResponse({
    status: 200,
    description: 'Coordenadas obtenidas correctamente',
    schema: {
      example: {
        address: 'Calle Mayor 123, Madrid, España',
        lat: 40.4168,
        lng: -3.7038,
        formattedAddress: 'Calle Mayor, 123, 28013 Madrid, España',
        country: 'España',
        city: 'Madrid',
        state: 'Madrid',
        zipcode: '28013',
        streetName: 'Calle Mayor',
        streetNumber: '123'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error al obtener coordenadas' })
  @ApiResponse({ status: 404, description: 'Dirección no encontrada' })
  async getLocation(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('El parámetro address es requerido');
    }
    return this.clientesService.getLocation(address);
  }
} 