import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8081',
    credentials: true,
  });
  app.setGlobalPrefix('api'); // Prefijo global para la API

  // Descripción general y flujo visual en Markdown
  const swaggerDescription = `
# API Taxi - Documentación

Esta API permite gestionar un sistema de viajes tipo Uber, con los siguientes roles y flujos principales:

## Roles
- **Cliente:** Puede registrarse, solicitar servicios, ver su historial.
- **Conductor:** Puede registrarse, recibir notificaciones de viajes, actualizar su estado.
- **Admin:** Gestiona empresas, conductores y clientes.

## Flujo típico de uso

1. **Registro de usuario**
   - El cliente se registra usando "/clientes/registrar".
   - El conductor se registra usando "/conductores/registrar".

2. **Login**
   - El usuario inicia sesión usando "/auth/login".

3. **Solicitar un servicio**
   - El cliente crea un servicio usando "/servicios/crear".

4. **Asignación y notificación**
   - El sistema asigna un conductor y puede enviar una notificación usando "/notificaciones/enviar".

5. **Seguimiento y finalización**
   - El conductor y el cliente pueden consultar el estado del servicio.
   - Al finalizar, se puede generar una factura usando "/facturacion/crear".

## Diagrama de flujo visual

\`\`\`mermaid
flowchart TD
    Cliente((Cliente))
    Conductor((Conductor))
    Admin((Admin))
    subgraph Registro
        Cliente -- "/clientes/registrar" --> API
        Conductor -- "/conductores/registrar" --> API
    end
    Cliente -- "/auth/login" --> API
    Conductor -- "/auth/login" --> API
    Cliente -- "/servicios/crear" --> API
    API -- "Asigna conductor" --> Conductor
    API -- "/notificaciones/enviar" --> Conductor
    Conductor -- "Actualiza estado" --> API
    Cliente -- "Consulta estado" --> API
    API -- "/facturacion/crear" --> Admin
\`\`\`

## Probar la API

- Usa los endpoints de cada sección para simular el flujo completo.
- Todos los endpoints tienen ejemplos de request y response editables.
- Puedes probar el login, crear clientes, conductores, servicios, empresas, facturación y notificaciones.
`;

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Taxi')
    .setDescription(swaggerDescription)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
