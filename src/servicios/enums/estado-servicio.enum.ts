export enum EstadoServicio {
  RESERVA = 7,
  ASIGNADO = 10,
  CONFIRMADO = 15,
  EN_RUTA = 20,
  EN_PUERTA = 25,
  CON_CLIENTE = 30,
  FINALIZADO = 40,
  CANCELADO = 90
}

export const ESTADO_SERVICIO_DESCRIPCION = {
  [EstadoServicio.RESERVA]: 'Reserva',
  [EstadoServicio.ASIGNADO]: 'Asignado',
  [EstadoServicio.CONFIRMADO]: 'Confirmado',
  [EstadoServicio.EN_RUTA]: 'En ruta',
  [EstadoServicio.EN_PUERTA]: 'En puerta',
  [EstadoServicio.CON_CLIENTE]: 'Con cliente',
  [EstadoServicio.FINALIZADO]: 'Finalizado',
  [EstadoServicio.CANCELADO]: 'Cancelado'
};

export const ESTADO_SERVICIO_VALORES = [
  { valor: 7, descripcion: 'Reserva' },
  { valor: 10, descripcion: 'Asignado' },
  { valor: 15, descripcion: 'Confirmado' },
  { valor: 20, descripcion: 'En ruta' },
  { valor: 25, descripcion: 'En puerta' },
  { valor: 30, descripcion: 'Con cliente' },
  { valor: 40, descripcion: 'Finalizado' },
  { valor: 90, descripcion: 'Cancelado' }
];
