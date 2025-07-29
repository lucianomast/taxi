import { Injectable, Logger } from '@nestjs/common';

interface Coordenadas {
  lat: number;
  lng: number;
}

interface DistanciaResultado {
  distancia_km: number;
  tiempo_minutos: number;
  metodo: 'google' | 'haversine';
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
    try {
      // Intentar con Google Distance Matrix primero
      const resultadoGoogle = await this.calcularDistanciaGoogle(origen, destino);
      if (resultadoGoogle) {
        return {
          ...resultadoGoogle,
          metodo: 'google'
        };
      }
    } catch (error) {
      this.logger.warn(`Error con Google Distance Matrix: ${error.message}`);
    }

    // Fallback a Haversine
    try {
      const resultadoHaversine = await this.calcularDistanciaHaversine(origen, destino);
      return {
        ...resultadoHaversine,
        metodo: 'haversine'
      };
    } catch (error) {
      this.logger.error(`Error con cálculo Haversine: ${error.message}`);
      throw new Error('No se pudo calcular la distancia');
    }
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

    const response = await fetch(url.toString());
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

    const response = await fetch(url.toString());
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