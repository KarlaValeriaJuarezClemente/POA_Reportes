// src/lib/api.ts
import { Project, ProjectStatus, Priority, Viability, Direccion } from './mockData';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/obras/';

export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error conectando con Django');
    
    const data = await response.json();
    
    // Si Django pagina los resultados (results), úsalos. Si es array directo, úsalo.
    const results = Array.isArray(data) ? data : data.results || [];

    return results.map((obra: any) => {
      // Presupuesto final según documentación: usar presupuesto_modificado si existe, sino anteproyecto_total
      const presupuestoFinal = Number(obra.presupuesto_final || obra.presupuesto_modificado || obra.anteproyecto_total || 0);
      
      // Beneficiarios: limpiar y multiplicar por 1000 si viene en miles (Col AK = poblacion_objetivo_num)
      // Si el valor original contiene "mil" o es un número pequeño (< 1000), multiplicar por 1000
      let beneficiarios = 0;
      if (obra.poblacion_objetivo_num) {
        const beneficiariosStr = String(obra.poblacion_objetivo_num).replace(/[^\d.]/g, '');
        const valor = parseFloat(beneficiariosStr);
        // Si el valor original contiene "mil" o es menor a 1000, asumimos que está en miles
        const contieneMil = String(obra.poblacion_objetivo_num || '').toLowerCase().includes('mil');
        beneficiarios = (contieneMil || valor < 1000) ? valor * 1000 : valor;
      } else if (obra.beneficiarios_directos) {
        const beneficiariosStr = String(obra.beneficiarios_directos).replace(/[^\d.]/g, '');
        beneficiarios = parseFloat(beneficiariosStr) || 0;
      }
      
      // Calcular estado basado en viabilidades y fechas (según documentación)
      const status = calculateStatus(
        obra.viabilidad_tecnica,
        obra.viabilidad_presupuestal,
        obra.viabilidad_juridica,
        obra.viabilidad_temporal,
        obra.viabilidad_administrativa,
        obra.riesgo_nivel_num || obra.riesgo_nivel,
        obra.fecha_inicio_prog,
        obra.fecha_termino_prog,
        obra.avance_fisico_pct
      );
      
      return {
        id: `OBRA-${obra.id}`, 
        
        nombre: obra.programa || 'Sin nombre',
        descripcion: obra.descripcion || obra.observaciones || 'Sin descripción',
        direccion: obra.area_responsable || 'Dirección General',
        responsable: obra.responsable_operativo || 'No asignado',
        
        // Presupuesto y ejecutado
        presupuesto: presupuestoFinal,
        ejecutado: Number(obra.monto_ejecutado || 0),
        avance: Number(obra.avance_fisico_pct || 0),
        
        // Mapeos
        status: status,
        prioridad: mapPriority(obra.urgencia_num, obra.urgencia),
        viabilidad: mapViability(obra.viabilidad_ejecucion_num),
        
        // Fechas
        fechaInicio: obra.fecha_inicio_prog || new Date().toISOString(),
        fechaFin: obra.fecha_termino_prog || new Date().toISOString(),
        
        // Datos adicionales para cálculos
        beneficiarios: Math.round(beneficiarios),
        ubicacion: obra.ubicacion_especifica || 'Múltiples ubicaciones',
        zona: 'multiple',
        // Objetivos: usar solucion_ofrece o beneficio_ciudadania (según documentación: "Impacto")
        objetivos: obra.solucion_ofrece 
          ? obra.solucion_ofrece.split('\n').filter((o: string) => o.trim())
          : obra.beneficio_ciudadania 
            ? [obra.beneficio_ciudadania]
            : [],
        // Riesgos: usar problemas_identificados
        riesgos: obra.problemas_identificados
          ? obra.problemas_identificados.split('\n').filter((r: string) => r.trim())
          : [],
        // Indicadores técnicos: crear desde avance físico y financiero (según documentación: "Técnico")
        indicadores: [
          {
            nombre: 'Avance Físico',
            actual: Number(obra.avance_fisico_pct || 0),
            meta: 100,
            unidad: '%'
          },
          {
            nombre: 'Avance Financiero',
            actual: Number(obra.avance_financiero_pct || 0),
            meta: 100,
            unidad: '%'
          }
        ],
        
        // Campos adicionales para viabilidades
        viabilidades: {
          tecnica: obra.viabilidad_tecnica,
          presupuestal: obra.viabilidad_presupuestal,
          juridica: obra.viabilidad_juridica,
          temporal: obra.viabilidad_temporal,
          administrativa: obra.viabilidad_administrativa
        },
        riesgoNivel: obra.riesgo_nivel_num || obra.riesgo_nivel || 1
      };
    });
  } catch (error) {
    console.error("Fallo al cargar proyectos:", error);
    return [];
  }
}

// Función para calcular estado según documentación (basado en viabilidades y fechas)
function calculateStatus(
  viabilidadTecnica: string | null | undefined,
  viabilidadPresupuestal: string | null | undefined,
  viabilidadJuridica: string | null | undefined,
  viabilidadTemporal: string | null | undefined,
  viabilidadAdministrativa: string | null | undefined,
  riesgoNivel: number | null | undefined,
  fechaInicio: string | null | undefined,
  fechaFin: string | null | undefined,
  avanceFisico: number | null | undefined
): ProjectStatus {
  const viabilidades = [
    viabilidadTecnica,
    viabilidadPresupuestal,
    viabilidadJuridica,
    viabilidadTemporal,
    viabilidadAdministrativa
  ].map(v => (v || '').toUpperCase());
  
  const todasVerde = viabilidades.every(v => v === 'VERDE');
  const algunaAmarillo = viabilidades.some(v => v === 'AMARILLO');
  const algunaRojo = viabilidades.some(v => v === 'ROJO');
  
  const ahora = new Date();
  let inicio: Date | null = null;
  let fin: Date | null = null;
  
  try {
    if (fechaInicio) {
      inicio = new Date(fechaInicio);
      if (isNaN(inicio.getTime())) inicio = null;
    }
  } catch {
    inicio = null;
  }
  
  try {
    if (fechaFin) {
      fin = new Date(fechaFin);
      if (isNaN(fin.getTime())) fin = null;
    }
  } catch {
    fin = null;
  }
  
  const esFuturo = inicio && inicio > ahora;
  const estaCompletado = fin && fin < ahora && (avanceFisico || 0) >= 100;
  
  // En Riesgo: al menos una viabilidad en rojo o riesgo > 3
  if (algunaRojo || (riesgoNivel && riesgoNivel > 3)) {
    return 'en_riesgo';
  }
  
  // Completado: todas verdes y fecha fin pasada con avance 100%
  if (todasVerde && estaCompletado) {
    return 'completado';
  }
  
  // Ejecución: todas verdes y fechas válidas
  if (todasVerde && inicio && fin && !esFuturo) {
    return 'en_ejecucion';
  }
  
  // Retraso: alguna amarilla o riesgo 1-3
  if (algunaAmarillo || (riesgoNivel && riesgoNivel >= 1 && riesgoNivel <= 3)) {
    return 'retrasado';
  }
  
  // Planificado: fechas futuras
  if (esFuturo) {
    return 'planificado';
  }
  
  // Default
  return 'planificado';
}

// Función legacy (mantenida por compatibilidad)
function mapStatus(semaforo: string): ProjectStatus {
  const s = (semaforo || '').toUpperCase();
  if (s === 'ROJO') return 'en_riesgo';
  if (s === 'AMARILLO') return 'retrasado';
  if (s === 'VERDE') return 'en_ejecucion';
  if (s === 'AZUL' || s === 'COMPLETADO') return 'completado';
  return 'planificado';
}

function mapPriority(valNum: number, valStr: string): Priority {
  let num = valNum;
  if (!num && valStr) {
    const match = valStr.match(/\d+/);
    if (match) num = parseInt(match[0]);
  }
  
  if (num >= 5) return 'critica';
  if (num === 4) return 'alta';
  if (num === 3) return 'media';
  return 'baja';
}

function mapViability(num: number): Viability {
  if (num >= 4) return 'alta';
  if (num === 3) return 'media';
  return 'baja';
}


// Funciones para reportes
export async function fetchDirecciones(): Promise<Direccion[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/direcciones/');
    if (!response.ok) throw new Error('Error al cargar direcciones');
    return await response.json();
  } catch (error) {
    console.error('Error fetching direcciones:', error);
    return [];
  }
}

export async function getVistaPrevia(filtros: {
  fecha_corte: string;
  direcciones: number[];
}): Promise<any> {
  try {
    const params = new URLSearchParams();
    params.append('fecha_corte', filtros.fecha_corte);
    filtros.direcciones.forEach(id => params.append('direcciones[]', id.toString()));
    
    const response = await fetch(`http://127.0.0.1:8000/api/reportes/vista_previa/?${params}`);
    if (!response.ok) throw new Error('Error al cargar vista previa');
    return await response.json();
  } catch (error) {
    console.error('Error fetching vista previa:', error);
    return null;
  }
}

export async function generarReporte(config: {
  tipo_reporte: string;
  periodo: string;
  fecha_corte: string;
  direcciones: number[];
  formato: string;
  nombre_reporte?: string;
  incluir_todas_direcciones?: boolean;
}): Promise<{ success: boolean; urls?: { pdf?: string; excel?: string }; error?: string }> {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/reportes/generar/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) throw new Error('Error al generar reporte');
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generando reporte:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}


// FUNCIONES PARA REPORTES

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Instancia de axios para reportes
const reportesApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
reportesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Direcciones para reportes
export interface DireccionReporte {
  id: number;
  nombre: string;
  codigo: string;
  responsable?: string;
  telefono?: string;
  email?: string;
  activa: boolean;
}

// Interfaces para reportes
export interface VistaPreviaReporte {
  total_proyectos: number;
  presupuesto_total: number;
  beneficiarios_total: number;
  obras_por_estado: Record<string, number>;
  fecha_corte: string;
  ultima_actualizacion?: string;
}

export interface ReporteConfig {
  tipo_reporte: string;
  fecha_corte: string;
  direcciones: number[];
  formato: 'pdf' | 'excel' | 'ambos';
  incluir_graficos?: boolean;
  nombre_reporte?: string;
  incluir_todas_direcciones?: boolean;
  periodo?: string;
}

// Funciones de API para reportes
export const reportesAPI = {
  // Obtener direcciones para reportes
  getDirecciones: async (): Promise<DireccionReporte[]> => {
    try {
      const response = await reportesApi.get('/direcciones/');
      return response.data;
    } catch (error) {
      console.error('Error fetching direcciones:', error);
      return [];
    }
  },

  // Obtener vista previa del reporte
  getVistaPrevia: async (fechaCorte: string, direcciones?: number[]): Promise<VistaPreviaReporte | null> => {
    try {
      const params = new URLSearchParams();
      params.append('fecha_corte', fechaCorte);
      
      if (direcciones && direcciones.length > 0) {
        direcciones.forEach(id => {
          params.append('direcciones', id.toString());
        });
      }
      
      const response = await reportesApi.get(`/reportes/vista_previa/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vista previa:', error);
      return null;
    }
  },

  // Generar reporte (versión mejorada para manejar archivos)
  generarReporte: async (config: ReporteConfig): Promise<Blob | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/generar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Verificar tipo de contenido
      const contentType = response.headers.get('content-type');
      
      // Si es un archivo (PDF, Excel, ZIP), retornar Blob
      if (contentType?.includes('application/pdf') || 
          contentType?.includes('application/vnd.openxmlformats') ||
          contentType?.includes('application/zip')) {
        
        return await response.blob();
      } else {
        // Si no es archivo, intentar parsear como JSON
        const result = await response.json();
        throw new Error(`Respuesta inesperada: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error('Error generando reporte:', error);
      throw error; // Re-lanzar para manejo en el componente
    }
  },

  // Función auxiliar para descargar archivo
  descargarArchivo: (blob: Blob, nombreArchivo: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Función para obtener datos de reportes rápidos
  getReporteRapido: async (tipo: string, fechaCorte: string) => {
    try {
      const config: ReporteConfig = {
        tipo_reporte: tipo,
        fecha_corte: fechaCorte,
        direcciones: [],
        formato: 'pdf',
        incluir_todas_direcciones: true,
        nombre_reporte: `Reporte_${tipo}_${fechaCorte}.pdf`
      };
      
      return await reportesAPI.generarReporte(config);
    } catch (error) {
      console.error(`Error generando reporte rápido ${tipo}:`, error);
      return null;
    }
  }
};