import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Conductor } from './entities/conductor.entity';
import { ConductorPosicion } from './entities/conductor-posicion.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { CrearConductorDto } from './dto/crear-conductor.dto';
import { ActualizarConductorDto } from './dto/actualizar-conductor.dto';
import { SolicitarActivacionDto } from './dto/solicitar-activacion.dto';
import { ActivarCuentaDto } from './dto/activar-cuenta.dto';
import { OlvidePasswordDto } from './dto/olvide-password.dto';
import { CambiarPasswordCodigoDto } from './dto/cambiar-password-codigo.dto';
import { GuardarCoordenadasDto } from './dto/guardar-coordenadas.dto';
import { PenalizarConductorDto } from './dto/penalizar-conductor.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ConductoresService {
  constructor(
    @InjectRepository(Conductor)
    private readonly conductoresRepository: Repository<Conductor>,
    @InjectRepository(ConductorPosicion)
    private readonly conductorPosicionRepository: Repository<ConductorPosicion>,
    @InjectRepository(Empresa)
    private readonly empresasRepository: Repository<Empresa>,
    private readonly emailService: EmailService,
  ) {}

  async registrar(dto: CrearConductorDto): Promise<Conductor> {
    const empresa = await this.empresasRepository.findOne({ where: { id: dto.idProveedor } });
    if (!empresa) {
      throw new NotFoundException('No se ha encontrado una empresa con ese id');
    }
    try {
      const existeDni = await this.conductoresRepository.findOne({ where: { dni: dto.dni } });
      if (existeDni) {
        throw new BadRequestException('El DNI ya está asociado a un conductor');
      }
      const existeEmail = await this.conductoresRepository.findOne({ where: { email: dto.email } });
      if (existeEmail) {
        throw new BadRequestException('El email ya está asociado a un conductor');
      }
      // Hashear la contraseña antes de guardar
      const salt = await bcrypt.genSalt(10);
      dto.password = await bcrypt.hash(dto.password, salt);
      const conductor = this.conductoresRepository.create({
        ...dto,
        created_at: new Date(),
      });
      return await this.conductoresRepository.save(conductor);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla conductores no existe en la base de datos.');
      }
      throw error;
    }
  }

  async actualizar(id: number, dto: ActualizarConductorDto): Promise<Conductor> {
    try {
      const conductor = await this.conductoresRepository.findOne({ where: { id } });
      if (!conductor) throw new NotFoundException('Conductor no encontrado');
      Object.assign(conductor, dto, { updated_at: new Date() });
      return await this.conductoresRepository.save(conductor);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla conductores no existe en la base de datos.');
      }
      throw error;
    }
  }

  async getLista(): Promise<Conductor[]> {
    try {
      return await this.conductoresRepository.find();
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla conductores no existe en la base de datos.');
      }
      throw error;
    }
  }

  async getByDni(dni: string): Promise<Conductor> {
    try {
      const conductor = await this.conductoresRepository.findOne({ where: { dni } });
      if (!conductor) throw new NotFoundException('Conductor no encontrado');
      return conductor;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla conductores no existe en la base de datos.');
      }
      throw error;
    }
  }

  async cambiarPassword(id: number, password: string) {
    const conductor = await this.conductoresRepository.findOne({ where: { id } });
    if (!conductor) {
      throw new NotFoundException('No se encontró el conductor');
    }
    const salt = await bcrypt.genSalt(10);
    conductor.password = await bcrypt.hash(password, salt);
    await this.conductoresRepository.save(conductor);
    const respuesta = { success: true, message: 'Contraseña actualizada correctamente' };
    console.log('Respuesta cambiar_password:', respuesta);
    return respuesta;
  }

  // Métodos para sistema de activación por email
  async solicitarActivacion(dto: SolicitarActivacionDto) {
    // Validar que el DTO tenga el email
    if (!dto || !dto.email) {
      throw new BadRequestException('El email es requerido');
    }

    console.log(`🔍 Buscando conductor con email: ${dto.email}`);

    const conductor = await this.conductoresRepository.findOne({ 
      where: { 
        email: dto.email
      } 
    });

    if (!conductor) {
      console.log(`❌ No se encontró conductor con email: ${dto.email}`);
      throw new NotFoundException('No se encontró un conductor con ese email');
    }

    console.log(`✅ Conductor encontrado: ${conductor.nombre} ${conductor.apellidos}`);

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔢 Código generado: ${codigo}`);
    
    // Establecer expiración (15 minutos)
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 15);

    // Guardar código en la base de datos
    conductor.codigoActivacion = codigo;
    conductor.codigoActivacionExpiracion = expiracion;
    await this.conductoresRepository.save(conductor);
    console.log(`💾 Código guardado en base de datos`);

    // Enviar email con el código
    console.log(`📧 Intentando enviar email a: ${conductor.email}`);
    const emailEnviado = await this.emailService.enviarCodigoActivacion(
      conductor.email,
      codigo,
      conductor.nombre
    );

    if (!emailEnviado) {
      console.log(`❌ Falló el envío de email a: ${conductor.email}`);
      throw new InternalServerErrorException('Error al enviar el email de activación');
    }

    console.log(`✅ Email enviado exitosamente a: ${conductor.email}`);
    return {
      message: 'Código de activación enviado al email',
      expiracion: expiracion
    };
  }

  async activarCuenta(dto: ActivarCuentaDto) {
    // Validar que el DTO tenga los datos requeridos
    if (!dto || !dto.email) {
      throw new BadRequestException('El email es requerido');
    }
    if (!dto.codigo) {
      throw new BadRequestException('El código es requerido');
    }

    const conductor = await this.conductoresRepository.findOne({ 
      where: { email: dto.email } 
    });

    if (!conductor) {
      throw new NotFoundException('No se encontró un conductor con ese email');
    }

    // Verificar que el código coincida
    if (conductor.codigoActivacion !== dto.codigo) {
      throw new BadRequestException('Código de activación incorrecto');
    }

    // Verificar que no haya expirado
    if (conductor.codigoActivacionExpiracion && conductor.codigoActivacionExpiracion < new Date()) {
      throw new BadRequestException('Código de activación expirado');
    }

    // Activar cuenta (mantener la contraseña original)
    conductor.activo = true;
    conductor.emailVerificado = true;
    conductor.codigoActivacion = undefined;
    conductor.codigoActivacionExpiracion = undefined;
    conductor.updated_at = new Date();

    await this.conductoresRepository.save(conductor);

    // Enviar email de confirmación
    await this.emailService.enviarConfirmacionActivacion(
      conductor.email,
      conductor.nombre
    );

    return {
      message: 'Cuenta activada correctamente',
      success: true
    };
  }

  async verificarCodigo(email: string, codigo: string) {
    const conductor = await this.conductoresRepository.findOne({ 
      where: { email } 
    });

    if (!conductor) {
      throw new NotFoundException('No se encontró un conductor con ese email');
    }

    if (conductor.codigoActivacion !== codigo) {
      return { valido: false, message: 'Código incorrecto' };
    }

    if (conductor.codigoActivacionExpiracion && conductor.codigoActivacionExpiracion < new Date()) {
      return { valido: false, message: 'Código expirado' };
    }

    return { valido: true, message: 'Código válido' };
  }

  // Métodos para recuperación de contraseña
  async olvidePassword(dto: OlvidePasswordDto) {
    // Validar que el DTO tenga el email
    if (!dto || !dto.email) {
      throw new BadRequestException('El email es requerido');
    }

    const conductor = await this.conductoresRepository.findOne({ 
      where: { email: dto.email } 
    });

    if (!conductor) {
      throw new NotFoundException('No se encontró un conductor con ese email');
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Establecer expiración (15 minutos)
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 15);

    // Guardar código en la base de datos
    conductor.codigoActivacion = codigo;
    conductor.codigoActivacionExpiracion = expiracion;
    await this.conductoresRepository.save(conductor);

    // Enviar email con el código
    const emailEnviado = await this.emailService.enviarCodigoRecuperacion(
      conductor.email,
      codigo,
      conductor.nombre
    );

    if (!emailEnviado) {
      throw new InternalServerErrorException('Error al enviar el email de recuperación');
    }

    return {
      message: 'Código de recuperación enviado al email',
      expiracion: expiracion
    };
  }

  async cambiarPasswordConCodigo(dto: CambiarPasswordCodigoDto) {
    // Validar que el DTO tenga los datos requeridos
    if (!dto || !dto.email) {
      throw new BadRequestException('El email es requerido');
    }
    if (!dto.codigo) {
      throw new BadRequestException('El código es requerido');
    }
    if (!dto.nuevaPassword) {
      throw new BadRequestException('La nueva contraseña es requerida');
    }

    const conductor = await this.conductoresRepository.findOne({ 
      where: { email: dto.email } 
    });

    if (!conductor) {
      throw new NotFoundException('No se encontró un conductor con ese email');
    }

    // Verificar que el código coincida
    if (conductor.codigoActivacion !== dto.codigo) {
      throw new BadRequestException('Código de recuperación incorrecto');
    }

    // Verificar que no haya expirado
    if (conductor.codigoActivacionExpiracion && conductor.codigoActivacionExpiracion < new Date()) {
      throw new BadRequestException('Código de recuperación expirado');
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const nuevaPasswordHash = await bcrypt.hash(dto.nuevaPassword, salt);

    // Cambiar contraseña y limpiar código
    conductor.password = nuevaPasswordHash;
    conductor.codigoActivacion = undefined;
    conductor.codigoActivacionExpiracion = undefined;
    conductor.updated_at = new Date();

    await this.conductoresRepository.save(conductor);

    // Enviar email de confirmación
    await this.emailService.enviarConfirmacionCambioPassword(
      conductor.email,
      conductor.nombre
    );

    return {
      message: 'Contraseña cambiada correctamente',
      success: true
    };
  }

  async guardarCoordenadas(dto: GuardarCoordenadasDto): Promise<ConductorPosicion> {
    // Verificar que el conductor existe
    const conductor = await this.conductoresRepository.findOne({ 
      where: { id: dto.conductorId } 
    });

    if (!conductor) {
      throw new NotFoundException('No se encontró un conductor con ese ID');
    }

    // Buscar si ya existe una posición para este conductor
    let posicion = await this.conductorPosicionRepository.findOne({ 
      where: { conductorId: dto.conductorId } 
    });

    const now = new Date();

    if (posicion) {
      // Actualizar posición existente
      posicion.lat = dto.lat || '';
      posicion.lon = dto.lon || '';
      posicion.updated_at = now;
    } else {
      // Crear nueva posición
      posicion = this.conductorPosicionRepository.create({
        conductorId: dto.conductorId,
        lat: dto.lat || '',
        lon: dto.lon || '',
        created_at: now,
        updated_at: now
      });
    }

    return await this.conductorPosicionRepository.save(posicion);
  }

  async obtenerPosicionesConductores(): Promise<any[]> {
    // Obtener todas las posiciones con información del conductor
    const posiciones = await this.conductorPosicionRepository
      .createQueryBuilder('posicion')
      .leftJoinAndSelect('posicion.conductor', 'conductor')
      .select([
        'posicion.id',
        'posicion.lat',
        'posicion.lon',
        'posicion.updated_at',
        'conductor.id',
        'conductor.nombre',
        'conductor.apellidos',
        'conductor.telefono',
        'conductor.activo',
        'conductor.estado',
        'conductor.marcaCoche',
        'conductor.modeloCoche',
        'conductor.matricula'
      ])
      .where('posicion.lat != :emptyLat', { emptyLat: '' })
      .andWhere('posicion.lon != :emptyLon', { emptyLon: '' })
      .andWhere('conductor.activo = :activo', { activo: true })
      .orderBy('posicion.updated_at', 'DESC')
      .getMany();

    // Transformar los datos para el frontend
    return posiciones.map(posicion => ({
      id: posicion.id,
      conductorId: posicion.conductor.id,
      lat: parseFloat(posicion.lat),
      lon: parseFloat(posicion.lon),
      updated_at: posicion.updated_at,
      conductor: {
        id: posicion.conductor.id,
        nombre: posicion.conductor.nombre,
        apellidos: posicion.conductor.apellidos,
        telefono: posicion.conductor.telefono,
        activo: posicion.conductor.activo,
        estado: posicion.conductor.estado,
        vehiculo: {
          marca: posicion.conductor.marcaCoche,
          modelo: posicion.conductor.modeloCoche,
          matricula: posicion.conductor.matricula
        }
      }
    }));
  }

  async obtenerPosicionConductor(conductorId: number): Promise<any> {
    const posicion = await this.conductorPosicionRepository
      .createQueryBuilder('posicion')
      .leftJoinAndSelect('posicion.conductor', 'conductor')
      .select([
        'posicion.id',
        'posicion.lat',
        'posicion.lon',
        'posicion.updated_at',
        'conductor.id',
        'conductor.nombre',
        'conductor.apellidos',
        'conductor.telefono',
        'conductor.activo',
        'conductor.estado',
        'conductor.marcaCoche',
        'conductor.modeloCoche',
        'conductor.matricula'
      ])
      .where('posicion.conductorId = :conductorId', { conductorId })
      .andWhere('posicion.lat != :emptyLat', { emptyLat: '' })
      .andWhere('posicion.lon != :emptyLon', { emptyLon: '' })
      .getOne();

    if (!posicion) {
      throw new NotFoundException('No se encontró posición para este conductor');
    }

    return {
      id: posicion.id,
      conductorId: posicion.conductor.id,
      lat: parseFloat(posicion.lat),
      lon: parseFloat(posicion.lon),
      updated_at: posicion.updated_at,
      conductor: {
        id: posicion.conductor.id,
        nombre: posicion.conductor.nombre,
        apellidos: posicion.conductor.apellidos,
        telefono: posicion.conductor.telefono,
        activo: posicion.conductor.activo,
        estado: posicion.conductor.estado,
        vehiculo: {
          marca: posicion.conductor.marcaCoche,
          modelo: posicion.conductor.modeloCoche,
          matricula: posicion.conductor.matricula
        }
             }
     };
   }

  async penalizarConductor(dto: PenalizarConductorDto): Promise<any> {
    // Verificar que el conductor existe
    const conductor = await this.conductoresRepository.findOne({ 
      where: { id: dto.conductorId } 
    });

    if (!conductor) {
      throw new NotFoundException('No se encontró un conductor con ese ID');
    }

    // Calcular duración de penalización según tipo
    const duracionMinutos = dto.tipo === 'manual' ? 5 : 20;
    const penalizacionHasta = new Date();
    penalizacionHasta.setMinutes(penalizacionHasta.getMinutes() + duracionMinutos);

    // Actualizar conductor con penalización
    conductor.ultimaPenalizacion = penalizacionHasta;
    conductor.updated_at = new Date();

    await this.conductoresRepository.save(conductor);

    return {
      message: `Conductor penalizado por ${duracionMinutos} minutos`,
      conductorId: conductor.id,
      nombre: conductor.nombre,
      apellidos: conductor.apellidos,
      tipo: dto.tipo,
      duracionMinutos,
      penalizacionHasta,
      motivo: dto.motivo || 'Sin motivo especificado'
    };
  }

  async verificarPenalizacion(conductorId: number): Promise<any> {
    const conductor = await this.conductoresRepository.findOne({ 
      where: { id: conductorId } 
    });

    if (!conductor) {
      throw new NotFoundException('No se encontró un conductor con ese ID');
    }

    const ahora = new Date();
    const penalizado = conductor.ultimaPenalizacion && conductor.ultimaPenalizacion > ahora;

    return {
      conductorId: conductor.id,
      nombre: conductor.nombre,
      apellidos: conductor.apellidos,
      penalizado,
      ultimaPenalizacion: conductor.ultimaPenalizacion,
      tiempoRestante: penalizado && conductor.ultimaPenalizacion ? Math.ceil((conductor.ultimaPenalizacion.getTime() - ahora.getTime()) / 60000) : 0
    };
  }

  async obtenerConductoresDisponibles(): Promise<Conductor[]> {
    const ahora = new Date();
    
    return await this.conductoresRepository
      .createQueryBuilder('conductor')
      .where('conductor.activo = :activo', { activo: true })
      .andWhere('conductor.estado = :estado', { estado: 10 }) // Disponible
      .andWhere('(conductor.ultimaPenalizacion IS NULL OR conductor.ultimaPenalizacion < :ahora)', { ahora })
      .orderBy('conductor.nombre', 'ASC')
      .getMany();
  }

  async penalizarPorRechazo(conductorId: number, motivo?: string): Promise<any> {
    return this.penalizarConductor({
      conductorId,
      tipo: 'automatica',
      motivo: motivo || 'Rechazo de servicio'
    });
  }
} 