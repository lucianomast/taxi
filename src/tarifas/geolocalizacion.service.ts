import { Injectable, Logger } from '@nestjs/common';

interface Coordenadas {
  lat: number;
  lng: number;
}

interface DistanciaResultado {
  distancia_km: number;
  tiempo_minutos: number;
  metodo: 'google' | 'haversine' | 'google_coordenadas' | 'haversine_coordenadas';
  origen: string;
  destino: string;
}

@Injectable()
export class GeolocalizacionService {
  private readonly logger = new Logger(GeolocalizacionService.name);

  /**
   * Calcula la distancia entre dos puntos usando Google Distance Matrix API
   * con fallback a fórmula de Haversine
   */
  async calcularDistancia(origen: string, destino: string): Promise<DistanciaResultado> {
    this.logger.log(`🚀 Iniciando cálculo de distancia: ${origen} → ${destino}`);
    
    try {
      // Intentar con Google Distance Matrix primero
      this.logger.log('📍 Intentando cálculo con Google Distance Matrix...');
      const resultadoGoogle = await this.calcularDistanciaGoogle(origen, destino);
      if (resultadoGoogle) {
        this.logger.log('✅ Cálculo exitoso con Google Distance Matrix');
        return {
          ...resultadoGoogle,
          metodo: 'google'
        };
      }
    } catch (error) {
      this.logger.warn(`⚠️ Error con Google Distance Matrix: ${error.message}`);
    }

    // Fallback a Haversine
    try {
      this.logger.log('📍 Intentando cálculo con Haversine (OpenStreetMap)...');
      const resultadoHaversine = await this.calcularDistanciaHaversine(origen, destino);
      this.logger.log('✅ Cálculo exitoso con Haversine');
      return {
        ...resultadoHaversine,
        metodo: 'haversine'
      };
    } catch (error) {
      this.logger.error(`❌ Error con cálculo Haversine: ${error.message}`);
      throw new Error('No se pudo calcular la distancia');
    }
  }

  /**
   * NUEVO MÉTODO: Calcula distancia usando coordenadas obtenidas con nuestro sistema de geocodificación
   */
  async calcularDistanciaConCoordenadas(origen: string, destino: string): Promise<DistanciaResultado> {
    this.logger.log(`🚀 Iniciando cálculo de distancia con coordenadas: ${origen} → ${destino}`);
    
    // 1. Obtener coordenadas usando nuestro sistema de geocodificación
    this.logger.log('📍 Obteniendo coordenadas del origen...');
    const coordenadasOrigen = await this.obtenerCoordenadasConNuestroSistema(origen);
    this.logger.log(`✅ Coordenadas origen: ${coordenadasOrigen.lat}, ${coordenadasOrigen.lng}`);
    
    this.logger.log('📍 Obteniendo coordenadas del destino...');
    const coordenadasDestino = await this.obtenerCoordenadasConNuestroSistema(destino);
    this.logger.log(`✅ Coordenadas destino: ${coordenadasDestino.lat}, ${coordenadasDestino.lng}`);
    
    try {
      // 2. Intentar calcular distancia con Google usando coordenadas
      this.logger.log('📍 Intentando cálculo con Google usando coordenadas...');
      const resultadoGoogle = await this.calcularDistanciaGoogleConCoordenadas(coordenadasOrigen, coordenadasDestino);
      if (resultadoGoogle) {
        this.logger.log('✅ Cálculo exitoso con Google usando coordenadas');
        return {
          ...resultadoGoogle,
          metodo: 'google_coordenadas'
        };
      }
    } catch (error) {
      this.logger.warn(`⚠️ Error con Google usando coordenadas: ${error.message}`);
    }

    // 3. Fallback a Haversine con coordenadas ya obtenidas
    try {
      this.logger.log('📍 Calculando distancia con fórmula de Haversine...');
      const distancia = this.calcularDistanciaHaversineEntreCoordenadas(coordenadasOrigen, coordenadasDestino);
      const tiempoEstimado = distancia * 2; // 2 minutos por km
      
      this.logger.log(`✅ Cálculo exitoso con Haversine: ${distancia.toFixed(2)} km`);
      
      return {
        distancia_km: distancia,
        tiempo_minutos: tiempoEstimado,
        metodo: 'haversine_coordenadas',
        origen,
        destino
      };
    } catch (error) {
      this.logger.error(`❌ Error con cálculo Haversine: ${error.message}`);
      throw new Error('No se pudo calcular la distancia');
    }
  }

  /**
   * NUEVO MÉTODO: Calcula distancia usando coordenadas proporcionadas por el frontend
   */
  async calcularDistanciaConCoordenadasFrontend(
    origen: string, 
    destino: string, 
    origenLat: string, 
    origenLon: string, 
    destinoLat: string, 
    destinoLon: string
  ): Promise<DistanciaResultado> {
    this.logger.log(`🚀 Iniciando cálculo de distancia con coordenadas del frontend: ${origen} → ${destino}`);
    
    // Convertir coordenadas de string a number
    const coordenadasOrigen: Coordenadas = {
      lat: parseFloat(origenLat),
      lng: parseFloat(origenLon)
    };
    
    const coordenadasDestino: Coordenadas = {
      lat: parseFloat(destinoLat),
      lng: parseFloat(destinoLon)
    };
    
    this.logger.log(`✅ Coordenadas origen del frontend: ${coordenadasOrigen.lat}, ${coordenadasOrigen.lng}`);
    this.logger.log(`✅ Coordenadas destino del frontend: ${coordenadasDestino.lat}, ${coordenadasDestino.lng}`);
    
    try {
      // 1. Intentar calcular distancia con Google usando coordenadas del frontend
      this.logger.log('📍 Intentando cálculo con Google usando coordenadas del frontend...');
      const resultadoGoogle = await this.calcularDistanciaGoogleConCoordenadas(coordenadasOrigen, coordenadasDestino);
      if (resultadoGoogle) {
        this.logger.log('✅ Cálculo exitoso con Google usando coordenadas del frontend');
        return {
          ...resultadoGoogle,
          metodo: 'google_coordenadas'
        };
      }
    } catch (error) {
      this.logger.warn(`⚠️ Error con Google usando coordenadas del frontend: ${error.message}`);
    }

    // 2. Fallback a Haversine con coordenadas del frontend
    try {
      this.logger.log('📍 Calculando distancia con fórmula de Haversine usando coordenadas del frontend...');
      const distancia = this.calcularDistanciaHaversineEntreCoordenadas(coordenadasOrigen, coordenadasDestino);
      const tiempoEstimado = distancia * 2; // 2 minutos por km
      
      this.logger.log(`✅ Cálculo exitoso con Haversine: ${distancia.toFixed(2)} km`);
      
      return {
        distancia_km: distancia,
        tiempo_minutos: tiempoEstimado,
        metodo: 'haversine_coordenadas',
        origen,
        destino
      };
    } catch (error) {
      this.logger.error(`❌ Error con cálculo Haversine usando coordenadas del frontend: ${error.message}`);
      throw new Error('No se pudo calcular la distancia con las coordenadas proporcionadas');
    }
  }

  /**
   * Obtiene coordenadas usando nuestro sistema de geocodificación (node-geocoder)
   */
  private async obtenerCoordenadasConNuestroSistema(direccion: string): Promise<Coordenadas> {
    try {
      const NodeGeocoder = require('node-geocoder');
      const options: any = {
        provider: 'openstreetmap',
        formatter: null,
        httpAdapter: 'https',
        extra: {
          'User-Agent': 'TaxiApp/1.0 (https://tu-app.com; contacto@tu-app.com)'
        }
      };

      const geocoder = NodeGeocoder(options);
      const results = await geocoder.geocode(direccion);
      
      if (!results || results.length === 0) {
        throw new Error(`No se encontraron coordenadas para: ${direccion}`);
      }

      const result = results[0];
      
      if (!result.latitude || !result.longitude) {
        throw new Error(`Coordenadas incompletas para: ${direccion}`);
      }
      
      return {
        lat: result.latitude,
        lng: result.longitude
      };
    } catch (error) {
      this.logger.error(`Error obteniendo coordenadas para ${direccion}: ${error.message}`);
      throw new Error(`Error al obtener coordenadas para: ${direccion}`);
    }
  }

  /**
   * Calcula distancia usando Google Distance Matrix API con coordenadas
   */
  private async calcularDistanciaGoogleConCoordenadas(origen: Coordenadas, destino: Coordenadas): Promise<Omit<DistanciaResultado, 'metodo'> | null> {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      this.logger.warn('GOOGLE_API_KEY no configurada');
      return null;
    }

    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.append('origins', `${origen.lat},${origen.lng}`);
    url.searchParams.append('destinations', `${destino.lat},${destino.lng}`);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('units', 'metric');
    url.searchParams.append('mode', 'driving');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      this.logger.warn(`Google API error: ${data.status}`);
      return null;
    }

    const element = data.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      this.logger.warn(`Google API element error: ${element?.status}`);
      return null;
    }

    return {
      distancia_km: element.distance.value / 1000, // Convertir metros a kilómetros
      tiempo_minutos: element.duration.value / 60, // Convertir segundos a minutos
      origen: `${origen.lat},${origen.lng}`,
      destino: `${destino.lat},${destino.lng}`
    };
  }

  /**
   * Calcula distancia usando Google Distance Matrix API
   */
  private async calcularDistanciaGoogle(origen: string, destino: string): Promise<Omit<DistanciaResultado, 'metodo'> | null> {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      this.logger.warn('GOOGLE_API_KEY no configurada');
      return null;
    }

    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.append('origins', origen);
    url.searchParams.append('destinations', destino);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('units', 'metric');
    url.searchParams.append('mode', 'driving');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      this.logger.warn(`Google API error: ${data.status}`);
      return null;
    }

    const element = data.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      this.logger.warn(`Google API element error: ${element?.status}`);
      return null;
    }

    return {
      distancia_km: element.distance.value / 1000, // Convertir metros a kilómetros
      tiempo_minutos: element.duration.value / 60, // Convertir segundos a minutos
      origen,
      destino
    };
  }

  /**
   * Calcula distancia usando fórmula de Haversine
   */
  private async calcularDistanciaHaversine(origen: string, destino: string): Promise<Omit<DistanciaResultado, 'metodo'>> {
    // Primero convertir direcciones a coordenadas
    const origenCoords = await this.geocodificar(origen);
    const destinoCoords = await this.geocodificar(destino);

    const distancia = this.calcularDistanciaHaversineEntreCoordenadas(origenCoords, destinoCoords);
    
    // Estimación de tiempo (promedio 30 km/h en ciudad)
    const tiempoEstimado = distancia * 2; // 2 minutos por km

    return {
      distancia_km: distancia,
      tiempo_minutos: tiempoEstimado,
      origen,
      destino
    };
  }

  /**
   * Convierte dirección a coordenadas usando Nominatim (OpenStreetMap)
   */
  private async geocodificar(direccion: string): Promise<Coordenadas> {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('q', direccion);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'TaxiApp/1.0 (https://tu-app.com; contacto@tu-app.com)'
      }
    });
    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error(`No se pudo geocodificar la dirección: ${direccion}`);
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  }

  /**
   * Calcula distancia entre dos coordenadas usando fórmula de Haversine
   */
  private calcularDistanciaHaversineEntreCoordenadas(
    origen: Coordenadas,
    destino: Coordenadas
  ): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.toRadians(destino.lat - origen.lat);
    const dLng = this.toRadians(destino.lng - origen.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(origen.lat)) * Math.cos(this.toRadians(destino.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convierte grados a radianes
   */
  private toRadians(grados: number): number {
    return grados * (Math.PI / 180);
  }

  /**
   * Valida si una dirección es válida
   */
  async validarDireccion(direccion: string): Promise<boolean> {
    try {
      await this.geocodificar(direccion);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene información detallada de una dirección
   */
  async obtenerInformacionDireccion(direccion: string): Promise<any> {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('q', direccion);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '1');
    url.searchParams.append('addressdetails', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'TaxiApp/1.0 (https://tu-app.com; contacto@tu-app.com)'
      }
    });
    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error(`No se encontró información para: ${direccion}`);
    }

    return {
      direccion: data[0].display_name,
      coordenadas: {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      },
      detalles: data[0].address
    };
  }
} 