import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TarifasService } from './tarifas.service';
import { CrearTarifaDto } from './dto/crear-tarifa.dto';
import { ActualizarTarifaDto } from './dto/actualizar-tarifa.dto';
import { CalcularPrecioDto } from './dto/calcular-precio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Tarifas')
@Controller('tarifas')
@UseGuards(JwtAuthGuard) // Proteger todo el controlador
@ApiBearerAuth() // Agregar autenticación Bearer en Swagger
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  // Endpoints para Tarifas
  @Post()
  @ApiOperation({ 
    summary: 'Crear una nueva tarifa',
    description: 'Crea una nueva tarifa con las condiciones especificadas'
  })
  @ApiBody({ 
    type: CrearTarifaDto,
    description: 'Datos de la tarifa a crear',
    examples: {
      tarifaNormal: {
        summary: 'Tarifa Normal',
        value: {
          nombre: 'Tarifa Normal',
          descripcion: 'Tarifa estándar para días laborales',
          tarifa_por_km: 1.25,
          costo_base: 5.00,
          condiciones: {
            dias_semana: [1,2,3,4,5],
            horario_inicio: '07:00',
            horario_fin: '21:00',
            festivos: false,
            zona_especial: false,
            tipo_servicio: ['normal'],
            distancia_minima: 0,
            distancia_maxima: null
          }
        }
      },
      tarifaEspecial: {
        summary: 'Tarifa Especial',
        value: {
          nombre: 'Tarifa Especial',
          descripcion: 'Tarifa para fines de semana y festivos',
          tarifa_por_km: 1.50,
          costo_base: 5.00,
          condiciones: {
            dias_semana: [6,7],
            horario_inicio: '00:00',
            horario_fin: '23:59',
            festivos: true,
            zona_especial: false,
            tipo_servicio: ['normal'],
            distancia_minima: 0,
            distancia_maxima: null
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tarifa creada exitosamente',
    schema: {
      example: {
        id: 1,
        nombre: 'Tarifa Normal',
        descripcion: 'Tarifa estándar para días laborales',
        tarifa_por_km: 1.25,
        costo_base: 5.00,
        activa: true,
        created_at: '2024-01-15T10:30:00.000Z',
        updated_at: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  crear(@Body() crearTarifaDto: CrearTarifaDto) {
    return this.tarifasService.crear(crearTarifaDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las tarifas',
    description: 'Retorna la lista completa de todas las tarifas en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tarifas',
    schema: {
      example: [
        {
          id: 1,
          nombre: 'Tarifa Normal',
          descripcion: 'Tarifa estándar para días laborales',
          tarifa_por_km: 1.25,
          costo_base: 5.00,
          activa: true,
          created_at: '2024-01-15T10:30:00.000Z'
        },
        {
          id: 2,
          nombre: 'Tarifa Especial',
          descripcion: 'Tarifa para fines de semana',
          tarifa_por_km: 1.50,
          costo_base: 5.00,
          activa: true,
          created_at: '2024-01-15T10:30:00.000Z'
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  obtenerTodas() {
    return this.tarifasService.obtenerTodas();
  }

  @Get('activas')
  @ApiOperation({ 
    summary: 'Obtener tarifas activas',
    description: 'Retorna solo las tarifas que están actualmente activas'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tarifas activas',
    schema: {
      example: [
        {
          id: 1,
          nombre: 'Tarifa Normal',
          descripcion: 'Tarifa estándar para días laborales',
          tarifa_por_km: 1.25,
          costo_base: 5.00,
          activa: true
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  obtenerActivas() {
    return this.tarifasService.obtenerActivas();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener una tarifa por ID',
    description: 'Retorna una tarifa específica por su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la tarifa',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarifa encontrada',
    schema: {
      example: {
        id: 1,
        nombre: 'Tarifa Normal',
        descripcion: 'Tarifa estándar para días laborales',
        tarifa_por_km: 1.25,
        costo_base: 5.00,
        activa: true,
        created_at: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar una tarifa',
    description: 'Actualiza los datos de una tarifa existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la tarifa a actualizar',
    example: 1
  })
  @ApiBody({ 
    type: ActualizarTarifaDto,
    description: 'Datos a actualizar',
    examples: {
      actualizarPrecio: {
        summary: 'Actualizar precio',
        value: {
          tarifa_por_km: 1.75,
          costo_base: 8.00
        }
      },
      actualizarNombre: {
        summary: 'Actualizar nombre',
        value: {
          nombre: 'Tarifa Actualizada',
          descripcion: 'Nueva descripción'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarifa actualizada exitosamente',
    schema: {
      example: {
        id: 1,
        nombre: 'Tarifa Actualizada',
        descripcion: 'Nueva descripción',
        tarifa_por_km: 1.75,
        costo_base: 8.00,
        activa: true,
        updated_at: '2024-01-15T11:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarTarifaDto: ActualizarTarifaDto,
  ) {
    return this.tarifasService.actualizar(id, actualizarTarifaDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar una tarifa',
    description: 'Elimina permanentemente una tarifa del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la tarifa a eliminar',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarifa eliminada exitosamente',
    schema: {
      example: {
        message: 'Tarifa eliminada correctamente'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.eliminar(id);
  }

  // Endpoints para Festivos
  @Post('festivos')
  @ApiOperation({ 
    summary: 'Crear un nuevo festivo',
    description: 'Agrega una nueva fecha festiva al calendario'
  })
  @ApiBody({ 
    description: 'Datos del festivo a crear',
    examples: {
      navidad: {
        summary: 'Navidad',
        value: {
          fecha: '2024-12-25',
          nombre: 'Navidad',
          descripcion: 'Celebración de la navidad'
        }
      },
      añoNuevo: {
        summary: 'Año Nuevo',
        value: {
          fecha: '2024-01-01',
          nombre: 'Año Nuevo',
          descripcion: 'Celebración del año nuevo'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Festivo creado exitosamente',
    schema: {
      example: {
        id: 1,
        fecha: '2024-12-25',
        nombre: 'Navidad',
        descripcion: 'Celebración de la navidad',
        activo: true,
        created_at: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  crearFestivo(@Body() crearFestivoDto: any) {
    return this.tarifasService.crearFestivo(crearFestivoDto);
  }

  @Get('festivos/todos')
  @ApiOperation({ 
    summary: 'Obtener todos los festivos',
    description: 'Retorna la lista completa de todos los festivos registrados'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de festivos',
    schema: {
      example: [
        {
          id: 1,
          fecha: '2024-01-01',
          nombre: 'Año Nuevo',
          descripcion: 'Celebración del año nuevo',
          activo: true
        },
        {
          id: 2,
          fecha: '2024-12-25',
          nombre: 'Navidad',
          descripcion: 'Celebración de la navidad',
          activo: true
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  obtenerFestivos() {
    return this.tarifasService.obtenerFestivos();
  }

  @Get('festivos/anio/:anio')
  @ApiOperation({ 
    summary: 'Obtener festivos por año',
    description: 'Retorna todos los festivos de un año específico'
  })
  @ApiParam({ 
    name: 'anio', 
    description: 'Año para filtrar festivos',
    example: 2024
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de festivos del año',
    schema: {
      example: [
        {
          id: 1,
          fecha: '2024-01-01',
          nombre: 'Año Nuevo',
          descripcion: 'Celebración del año nuevo',
          activo: true
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  obtenerFestivosPorAnio(@Param('anio') anio: number) {
    return this.tarifasService.obtenerFestivosPorAnio(anio);
  }

  @Get('festivos/verificar')
  @ApiOperation({ 
    summary: 'Verificar si una fecha es festiva',
    description: 'Comprueba si una fecha específica está marcada como festiva'
  })
  @ApiQuery({ 
    name: 'fecha', 
    description: 'Fecha a verificar (YYYY-MM-DD)',
    example: '2024-12-25'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Información del festivo',
    schema: {
      example: {
        id: 1,
        fecha: '2024-12-25',
        nombre: 'Navidad',
        descripcion: 'Celebración de la navidad',
        activo: true
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'La fecha no es festiva',
    schema: {
      example: null
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  verificarFestivo(@Query('fecha') fecha: string) {
    const fechaObj = new Date(fecha);
    return this.tarifasService.verificarFestivo(fechaObj);
  }

  @Get('festivos/:id')
  @ApiOperation({ 
    summary: 'Obtener un festivo por ID',
    description: 'Retorna un festivo específico por su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del festivo',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Festivo encontrado',
    schema: {
      example: {
        id: 1,
        fecha: '2024-12-25',
        nombre: 'Navidad',
        descripcion: 'Celebración de la navidad',
        activo: true,
        created_at: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Festivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  obtenerFestivoPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.obtenerFestivoPorId(id);
  }

  @Patch('festivos/:id')
  @ApiOperation({ 
    summary: 'Actualizar un festivo',
    description: 'Actualiza los datos de un festivo existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del festivo a actualizar',
    example: 1
  })
  @ApiBody({ 
    description: 'Datos a actualizar',
    examples: {
      actualizarNombre: {
        summary: 'Actualizar nombre',
        value: {
          nombre: 'Navidad Actualizada',
          descripcion: 'Nueva descripción del festivo'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Festivo actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        fecha: '2024-12-25',
        nombre: 'Navidad Actualizada',
        descripcion: 'Nueva descripción del festivo',
        activo: true,
        updated_at: '2024-01-15T11:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Festivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  actualizarFestivo(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarFestivoDto: any,
  ) {
    return this.tarifasService.actualizarFestivo(id, actualizarFestivoDto);
  }

  @Delete('festivos/:id')
  @ApiOperation({ 
    summary: 'Eliminar un festivo',
    description: 'Elimina permanentemente un festivo del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del festivo a eliminar',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Festivo eliminado exitosamente',
    schema: {
      example: {
        message: 'Festivo eliminado correctamente'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Festivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  eliminarFestivo(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.eliminarFestivo(id);
  }

  // Endpoint para calcular precios
  @Post('calcular-precio')
  @ApiOperation({ 
    summary: 'Calcular precio de un viaje',
    description: 'Calcula el precio de un viaje basado en origen, destino, fecha y condiciones'
  })
  @ApiBody({ 
    type: CalcularPrecioDto,
    description: 'Datos para calcular el precio',
    examples: {
      viajeNormal: {
        summary: 'Viaje Normal',
        value: {
          origen: 'Santa Teresa 2227, Morón',
          destino: 'Uruguay 900, Morón',
          fecha: '2024-01-15',
          hora: '14:30',
          tipo_servicio: 'normal',
          zona: 'moron'
        }
      },
      viajeFestivo: {
        summary: 'Viaje en Festivo',
        value: {
          origen: 'Av. Corrientes 123, Buenos Aires',
          destino: 'Plaza de Mayo, Buenos Aires',
          fecha: '2024-12-25',
          hora: '10:00',
          tipo_servicio: 'normal',
          zona: 'buenos_aires'
        }
      },
      viajeNocturno: {
        summary: 'Viaje Nocturno',
        value: {
          origen: 'Palermo, Buenos Aires',
          destino: 'Recoleta, Buenos Aires',
          fecha: '2024-01-15',
          hora: '23:30',
          tipo_servicio: 'normal',
          zona: 'buenos_aires'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Precio calculado exitosamente',
    schema: {
      example: {
        precio: 9.25,
        distancia_km: 3.376,
        tiempo_estimado_minutos: 9.78,
        tarifa_por_km: 1.25,
        costo_base: 5.00,
        tarifa_aplicada: 'Tarifa Normal',
        es_festivo: false,
        dia_semana: 2,
        hora: '14:30',
        tipo_servicio: 'normal',
        zona: 'moron',
        origen: 'Santa Teresa 2227, Morón',
        destino: 'Uruguay 900, Morón',
        metodo_calculo_distancia: 'google'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  @ApiResponse({ status: 404, description: 'No se encontró tarifa aplicable' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  calcularPrecio(@Body() calcularPrecioDto: CalcularPrecioDto) {
    return this.tarifasService.calcularPrecio(calcularPrecioDto);
  }

  // Endpoints para geolocalización
  @Get('geolocalizacion/validar')
  @ApiOperation({ 
    summary: 'Validar si una dirección es válida',
    description: 'Verifica si una dirección puede ser geocodificada correctamente'
  })
  @ApiQuery({ 
    name: 'direccion', 
    description: 'Dirección a validar',
    example: 'Av. Corrientes 123, Buenos Aires'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Resultado de validación',
    schema: {
      example: true
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dirección no válida',
    schema: {
      example: false
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  validarDireccion(@Query('direccion') direccion: string) {
    return this.tarifasService.validarDireccion(direccion);
  }

  @Get('geolocalizacion/informacion')
  @ApiOperation({ 
    summary: 'Obtener información detallada de una dirección',
    description: 'Retorna información completa de una dirección incluyendo coordenadas y detalles'
  })
  @ApiQuery({ 
    name: 'direccion', 
    description: 'Dirección a consultar',
    example: 'Av. Corrientes 123, Buenos Aires'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Información de la dirección',
    schema: {
      example: {
        direccion: 'Av. Corrientes 123, Buenos Aires, Argentina',
        coordenadas: {
          lat: -34.6037,
          lng: -58.3816
        },
        detalles: {
          country: 'Argentina',
          state: 'Buenos Aires',
          city: 'Buenos Aires',
          postcode: '1043',
          road: 'Avenida Corrientes',
          house_number: '123'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Dirección no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  obtenerInformacionDireccion(@Query('direccion') direccion: string) {
    return this.tarifasService.obtenerInformacionDireccion(direccion);
  }
} 