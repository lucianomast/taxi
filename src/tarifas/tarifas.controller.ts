import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TarifasService } from './tarifas.service';
import { CrearTarifaDto } from './dto/crear-tarifa.dto';
import { ActualizarTarifaDto } from './dto/actualizar-tarifa.dto';
import { CalcularPrecioDto } from './dto/calcular-precio.dto';

@ApiTags('Tarifas')
@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  // Endpoints para Tarifas
  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarifa' })
  @ApiResponse({ status: 201, description: 'Tarifa creada exitosamente' })
  crear(@Body() crearTarifaDto: CrearTarifaDto) {
    return this.tarifasService.crear(crearTarifaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tarifas' })
  @ApiResponse({ status: 200, description: 'Lista de tarifas' })
  obtenerTodas() {
    return this.tarifasService.obtenerTodas();
  }

  @Get('activas')
  @ApiOperation({ summary: 'Obtener tarifas activas' })
  @ApiResponse({ status: 200, description: 'Lista de tarifas activas' })
  obtenerActivas() {
    return this.tarifasService.obtenerActivas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarifa por ID' })
  @ApiResponse({ status: 200, description: 'Tarifa encontrada' })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarifa' })
  @ApiResponse({ status: 200, description: 'Tarifa actualizada exitosamente' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarTarifaDto: ActualizarTarifaDto,
  ) {
    return this.tarifasService.actualizar(id, actualizarTarifaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarifa' })
  @ApiResponse({ status: 200, description: 'Tarifa eliminada exitosamente' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.eliminar(id);
  }

  // Endpoints para Festivos
  @Post('festivos')
  @ApiOperation({ summary: 'Crear un nuevo festivo' })
  @ApiResponse({ status: 201, description: 'Festivo creado exitosamente' })
  crearFestivo(@Body() crearFestivoDto: any) {
    return this.tarifasService.crearFestivo(crearFestivoDto);
  }

  @Get('festivos/todos')
  @ApiOperation({ summary: 'Obtener todos los festivos' })
  @ApiResponse({ status: 200, description: 'Lista de festivos' })
  obtenerFestivos() {
    return this.tarifasService.obtenerFestivos();
  }

  @Get('festivos/anio/:anio')
  @ApiOperation({ summary: 'Obtener festivos por año' })
  @ApiResponse({ status: 200, description: 'Lista de festivos del año' })
  obtenerFestivosPorAnio(@Param('anio') anio: number) {
    return this.tarifasService.obtenerFestivosPorAnio(anio);
  }

  @Get('festivos/verificar')
  @ApiOperation({ summary: 'Verificar si una fecha es festiva' })
  @ApiResponse({ status: 200, description: 'Información del festivo' })
  verificarFestivo(@Query('fecha') fecha: string) {
    const fechaObj = new Date(fecha);
    return this.tarifasService.verificarFestivo(fechaObj);
  }

  @Get('festivos/:id')
  @ApiOperation({ summary: 'Obtener un festivo por ID' })
  @ApiResponse({ status: 200, description: 'Festivo encontrado' })
  obtenerFestivoPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.obtenerFestivoPorId(id);
  }

  @Patch('festivos/:id')
  @ApiOperation({ summary: 'Actualizar un festivo' })
  @ApiResponse({ status: 200, description: 'Festivo actualizado exitosamente' })
  actualizarFestivo(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarFestivoDto: any,
  ) {
    return this.tarifasService.actualizarFestivo(id, actualizarFestivoDto);
  }

  @Delete('festivos/:id')
  @ApiOperation({ summary: 'Eliminar un festivo' })
  @ApiResponse({ status: 200, description: 'Festivo eliminado exitosamente' })
  eliminarFestivo(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.eliminarFestivo(id);
  }

  // Endpoint para calcular precios
  @Post('calcular-precio')
  @ApiOperation({ summary: 'Calcular precio de un viaje' })
  @ApiResponse({ status: 200, description: 'Precio calculado exitosamente' })
  calcularPrecio(@Body() calcularPrecioDto: CalcularPrecioDto) {
    return this.tarifasService.calcularPrecio(calcularPrecioDto);
  }
} 