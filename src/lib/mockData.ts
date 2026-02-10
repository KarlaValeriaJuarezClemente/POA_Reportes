export type ProjectStatus = 'en_ejecucion' | 'planificado' | 'completado' | 'retrasado' | 'en_riesgo';
export type Priority = 'critica' | 'alta' | 'media' | 'baja';
export type Viability = 'alta' | 'media' | 'baja';

export interface Direccion {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
}

export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  responsable: string;
  presupuesto: number;
  ejecutado: number;
  status: ProjectStatus;
  prioridad: Priority;
  viabilidad: Viability;
  fechaInicio: string;
  fechaFin: string;
  beneficiarios: number;
  ubicacion: string;
  zona: string;
  objetivos: string[];
  riesgos: string[];
  avance: number;
  indicadores: {
    nombre: string;
    meta: number;
    actual: number;
    unidad: string;
  }[];
  // Campos adicionales para cálculos según documentación
  viabilidades?: {
    tecnica?: string;
    presupuestal?: string;
    juridica?: string;
    temporal?: string;
    administrativa?: string;
  };
  riesgoNivel?: number;
}

export const mockProjects: Project[] = [
  {
    id: 'PRY-001',
    nombre: 'Rehabilitación de Red de Agua Potable Zona Norte',
    descripcion: 'Mejoramiento integral del sistema de distribución de agua potable en colonias de la zona norte.',
    direccion: 'Dirección de Obras Públicas',
    responsable: 'Ing. María González',
    presupuesto: 15000000,
    ejecutado: 8500000,
    status: 'completado',
    prioridad: 'critica',
    viabilidad: 'alta',
    fechaInicio: '2024-01-15',
    fechaFin: '2024-08-30',
    beneficiarios: 45000,
    ubicacion: 'Zona Norte',
    zona: 'norte',
    objetivos: ['Reducir pérdidas de agua en 30%', 'Mejorar presión en 50 colonias', 'Renovar 15km de tubería'],
    riesgos: ['Retrasos por permisos', 'Incremento en costos de materiales'],
    avance: 57,
    indicadores: [
      { nombre: 'Km de tubería instalada', meta: 15, actual: 8.5, unidad: 'km' },
      { nombre: 'Colonias beneficiadas', meta: 50, actual: 28, unidad: 'colonias' },
    ]
  },
  {
    id: 'PRY-002',
    nombre: 'Construcción de Centro Comunitario Cultural',
    descripcion: 'Edificación de centro cultural con biblioteca, auditorio y espacios para talleres.',
    direccion: 'Dirección de Desarrollo Social',
    responsable: 'Arq. Roberto Méndez',
    presupuesto: 8500000,
    ejecutado: 8200000,
    status: 'completado',
    prioridad: 'alta',
    viabilidad: 'alta',
    fechaInicio: '2023-06-01',
    fechaFin: '2024-03-15',
    beneficiarios: 25000,
    ubicacion: 'Centro Histórico',
    zona: 'centro',
    objetivos: ['Crear espacio cultural accesible', 'Fomentar actividades artísticas', 'Biblioteca con 5000 títulos'],
    riesgos: [],
    avance: 100,
    indicadores: [
      { nombre: 'Metros construidos', meta: 2500, actual: 2500, unidad: 'm²' },
      { nombre: 'Capacidad auditorio', meta: 300, actual: 300, unidad: 'personas' },
    ]
  },
  {
    id: 'PRY-003',
    nombre: 'Programa de Pavimentación Integral',
    descripcion: 'Rehabilitación y construcción de pavimento en vialidades principales.',
    direccion: 'Dirección de Obras Públicas',
    responsable: 'Ing. Carlos Ramírez',
    presupuesto: 25000000,
    ejecutado: 5000000,
    status: 'retrasado',
    prioridad: 'alta',
    viabilidad: 'media',
    fechaInicio: '2024-02-01',
    fechaFin: '2024-12-31',
    beneficiarios: 120000,
    ubicacion: 'Múltiples zonas',
    zona: 'multiple',
    objetivos: ['Pavimentar 30km de calles', 'Mejorar conectividad urbana', 'Reducir baches en 80%'],
    riesgos: ['Temporada de lluvias', 'Retrasos en licitaciones', 'Conflictos con vecinos'],
    avance: 20,
    indicadores: [
      { nombre: 'Km pavimentados', meta: 30, actual: 6, unidad: 'km' },
      { nombre: 'Calles intervenidas', meta: 45, actual: 9, unidad: 'calles' },
    ]
  },
  {
    id: 'PRY-004',
    nombre: 'Sistema de Alumbrado LED Eficiente',
    descripcion: 'Sustitución de luminarias tradicionales por tecnología LED en toda la ciudad.',
    direccion: 'Dirección de Servicios Públicos',
    responsable: 'Ing. Laura Sánchez',
    presupuesto: 12000000,
    ejecutado: 3600000,
    status: 'en_ejecucion',
    prioridad: 'media',
    viabilidad: 'alta',
    fechaInicio: '2024-03-01',
    fechaFin: '2024-11-30',
    beneficiarios: 200000,
    ubicacion: 'Toda la ciudad',
    zona: 'multiple',
    objetivos: ['Instalar 8000 luminarias LED', 'Reducir consumo energético 40%', 'Mejorar seguridad nocturna'],
    riesgos: ['Importación de equipos', 'Fluctuación del dólar'],
    avance: 30,
    indicadores: [
      { nombre: 'Luminarias instaladas', meta: 8000, actual: 2400, unidad: 'unidades' },
      { nombre: 'Ahorro energético', meta: 40, actual: 12, unidad: '%' },
    ]
  },
  {
    id: 'PRY-005',
    nombre: 'Parque Ecológico Metropolitano',
    descripcion: 'Desarrollo de área verde con espacios recreativos, deportivos y de conservación.',
    direccion: 'Dirección de Medio Ambiente',
    responsable: 'Biól. Ana Torres',
    presupuesto: 18000000,
    ejecutado: 2000000,
    status: 'en_riesgo',
    prioridad: 'media',
    viabilidad: 'baja',
    fechaInicio: '2024-04-01',
    fechaFin: '2025-06-30',
    beneficiarios: 80000,
    ubicacion: 'Zona Sur',
    zona: 'sur',
    objetivos: ['Crear 50 hectáreas de área verde', 'Instalar 10km de senderos', 'Plantar 5000 árboles'],
    riesgos: ['Conflictos de uso de suelo', 'Presupuesto insuficiente', 'Oposición vecinal'],
    avance: 11,
    indicadores: [
      { nombre: 'Hectáreas desarrolladas', meta: 50, actual: 5.5, unidad: 'ha' },
      { nombre: 'Árboles plantados', meta: 5000, actual: 550, unidad: 'árboles' },
    ]
  },
  {
    id: 'PRY-006',
    nombre: 'Digitalización de Trámites Ciudadanos',
    descripcion: 'Implementación de plataforma digital para trámites y servicios municipales.',
    direccion: 'Dirección de Innovación',
    responsable: 'Lic. Fernando Ortiz',
    presupuesto: 5000000,
    ejecutado: 4500000,
    status: 'en_ejecucion',
    prioridad: 'alta',
    viabilidad: 'alta',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-06-30',
    beneficiarios: 300000,
    ubicacion: 'Virtual',
    zona: 'virtual',
    objetivos: ['Digitalizar 50 trámites', 'Reducir tiempos 60%', 'Disponibilidad 24/7'],
    riesgos: ['Resistencia al cambio', 'Brecha digital ciudadana'],
    avance: 90,
    indicadores: [
      { nombre: 'Trámites digitalizados', meta: 50, actual: 45, unidad: 'trámites' },
      { nombre: 'Usuarios registrados', meta: 50000, actual: 42000, unidad: 'usuarios' },
    ]
  },
  {
    id: 'PRY-007',
    nombre: 'Mercado Municipal Sustentable',
    descripcion: 'Remodelación integral del mercado central con enfoque en sustentabilidad.',
    direccion: 'Dirección de Desarrollo Económico',
    responsable: 'Arq. Patricia López',
    presupuesto: 10000000,
    ejecutado: 0,
    status: 'planificado',
    prioridad: 'media',
    viabilidad: 'media',
    fechaInicio: '2024-07-01',
    fechaFin: '2025-03-31',
    beneficiarios: 15000,
    ubicacion: 'Centro Histórico',
    zona: 'centro',
    objetivos: ['Renovar 200 locales', 'Instalar sistema de reciclaje', 'Mejorar accesibilidad'],
    riesgos: ['Reubicación temporal de locatarios', 'Complejidad estructural'],
    avance: 0,
    indicadores: [
      { nombre: 'Locales renovados', meta: 200, actual: 0, unidad: 'locales' },
      { nombre: 'Paneles solares', meta: 150, actual: 0, unidad: 'paneles' },
    ]
  },
  {
    id: 'PRY-008',
    nombre: 'Red de Ciclovías Urbanas',
    descripcion: 'Construcción de red de ciclovías conectando principales puntos de la ciudad.',
    direccion: 'Dirección de Movilidad',
    responsable: 'Ing. Diego Herrera',
    presupuesto: 7500000,
    ejecutado: 3750000,
    status: 'en_ejecucion',
    prioridad: 'baja',
    viabilidad: 'alta',
    fechaInicio: '2024-02-15',
    fechaFin: '2024-10-31',
    beneficiarios: 60000,
    ubicacion: 'Corredores principales',
    zona: 'multiple',
    objetivos: ['Construir 25km de ciclovía', 'Instalar 30 estaciones de bici', 'Señalización completa'],
    riesgos: ['Coordinación con obras viales', 'Vandalismo'],
    avance: 50,
    indicadores: [
      { nombre: 'Km de ciclovía', meta: 25, actual: 12.5, unidad: 'km' },
      { nombre: 'Estaciones instaladas', meta: 30, actual: 15, unidad: 'estaciones' },
    ]
  },
];

export const direcciones = [
  'Dirección de Obras Públicas',
  'Dirección de Desarrollo Social',
  'Dirección de Servicios Públicos',
  'Dirección de Medio Ambiente',
  'Dirección de Innovación',
  'Dirección de Desarrollo Económico',
  'Dirección de Movilidad',
];

export const zonas = [
  { id: 'norte', nombre: 'Zona Norte', poblacion: 85000 },
  { id: 'sur', nombre: 'Zona Sur', poblacion: 72000 },
  { id: 'centro', nombre: 'Centro Histórico', poblacion: 45000 },
  { id: 'oriente', nombre: 'Zona Oriente', poblacion: 63000 },
  { id: 'poniente', nombre: 'Zona Poniente', poblacion: 55000 },
];

export const getStatusLabel = (status: ProjectStatus): string => {
  const labels: Record<ProjectStatus, string> = {
    en_ejecucion: 'En Ejecución',
    planificado: 'Planificado',
    completado: 'Completado',
    retrasado: 'Retrasado',
    en_riesgo: 'En Riesgo',
  };
  return labels[status];
};

export const getPriorityLabel = (priority: Priority): string => {
  const labels: Record<Priority, string> = {
    critica: 'Crítica',
    alta: 'Alta',
    media: 'Media',
    baja: 'Baja',
  };
  return labels[priority];
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-MX').format(num);
};
