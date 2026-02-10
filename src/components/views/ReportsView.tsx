// src/components/views/ReportsView.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, AlertCircle, TrendingUp, Building2, Loader2, PieChart, MapPin, Shield, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Toaster } from '@/components/ui/toaster';
import { Badge } from '@/components/ui/badge';

interface Direccion {
  id: number;
  nombre: string;
  codigo: string;
}

interface VistaPrevia {
  total_proyectos: number;
  presupuesto_total: number;
  beneficiarios_total: number;
  obras_por_estado: Record<string, number>;
  fecha_corte: string;
}

// Mapeo de secciones a tipos de reporte
const SECCIONES_REPORTES = [
  {
    id: 'ejecutivo',
    nombre: 'Panel Ejecutivo',
    descripcion: 'Resumen ejecutivo con KPIs y métricas clave para dirección',
    icon: TrendingUp,
    color: 'bg-pink-50',
    iconColor: 'text-pink-600',
    endpoint: 'ejecutivo',
    tags: ['KPIs', 'Métricas', 'Dashboard']
  },
  {
    id: 'cartera',
    nombre: 'Cartera de Proyectos',
    descripcion: 'Listado completo de todos los proyectos con estado y avance',
    icon: Building2,
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    endpoint: 'cartera',
    tags: ['Inventario', 'Estado', 'Avance']
  },
  {
    id: 'presupuesto',
    nombre: 'Ejecución Presupuestal',
    descripcion: 'Análisis financiero detallado de presupuesto vs ejecutado',
    icon: PieChart,
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    endpoint: 'presupuesto',
    tags: ['Financiero', 'Presupuesto', 'Ejecución']
  },
  {
    id: 'riesgos',
    nombre: 'Gestión de Riesgos',
    descripcion: 'Proyectos críticos, alertas y análisis de viabilidad',
    icon: AlertCircle,
    color: 'bg-red-50',
    iconColor: 'text-red-600',
    endpoint: 'riesgos',
    tags: ['Riesgos', 'Alertas', 'Viabilidad']
  },
  {
    id: 'territorial',
    nombre: 'Impacto Territorial',
    descripcion: 'Distribución geográfica y análisis de impacto por zona',
    icon: MapPin,
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    endpoint: 'territorial',
    tags: ['Geográfico', 'Ubicación', 'Impacto']
  },
  {
    id: 'transparencia',
    nombre: 'Transparencia',
    descripcion: 'Información pública, contratistas y datos abiertos',
    icon: Shield,
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    endpoint: 'transparencia',
    tags: ['Público', 'Contratos', 'Datos']
  }
];

export function ReportsView() {
  // Estados básicos
  const [tipoReporte, setTipoReporte] = useState<string>('ejecutivo');
  const [periodo, setPeriodo] = useState<string>('mensual');
  const [fechaCorte, setFechaCorte] = useState<Date>(new Date());
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<string>('todas');
  const [formato, setFormato] = useState<'pdf' | 'excel' | 'ambos'>('pdf');
  const [incluirGraficos, setIncluirGraficos] = useState<boolean>(true);
  
  // Estados de carga
  const [vistaPrevia, setVistaPrevia] = useState<VistaPrevia | null>(null);
  const [generando, setGenerando] = useState<boolean>(false);
  const [cargandoVistaPrevia, setCargandoVistaPrevia] = useState<boolean>(false);
  const [cargandoDirecciones, setCargandoDirecciones] = useState<boolean>(false);
  
  const { toast } = useToast();
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Formateador de fecha para día/mes/año
  const formatFecha = (date: Date): string => {
    return format(date, 'dd/MM/yyyy');
  };

  // Formateador de fecha para API (yyyy-MM-dd)
  const formatFechaAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Formateador de fecha legible (ej: "15 de febrero de 2024")
  const formatFechaLegible = (date: Date): string => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  useEffect(() => {
    cargarDirecciones();
  }, []);

  useEffect(() => {
    if (fechaCorte) {
      actualizarVistaPrevia();
    }
  }, [fechaCorte, direccionSeleccionada]);

  const cargarDirecciones = async () => {
    setCargandoDirecciones(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/direcciones/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setDirecciones(data.data || data);
      
    } catch (error) {
      console.error('Error cargando direcciones:', error);
      // Datos de ejemplo
      setDirecciones([
        { id: 1, nombre: 'Obras Públicas', codigo: 'OP' },
        { id: 2, nombre: 'Desarrollo Social', codigo: 'DS' },
        { id: 3, nombre: 'Servicios Públicos', codigo: 'SP' },
        { id: 4, nombre: 'Medio Ambiente', codigo: 'MA' },
        { id: 5, nombre: 'Innovación', codigo: 'IN' },
        { id: 6, nombre: 'Desarrollo Económico', codigo: 'DE' },
        { id: 7, nombre: 'Movilidad', codigo: 'MO' },
      ]);
    } finally {
      setCargandoDirecciones(false);
    }
  };

  const actualizarVistaPrevia = async () => {
    if (!fechaCorte) return;
    
    setCargandoVistaPrevia(true);
    try {
      const params = new URLSearchParams({
        fecha_corte: formatFechaAPI(fechaCorte)
      });
      
      const response = await fetch(
        `${API_BASE_URL}/api/reportes/vista_previa/?${params}`
      );
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setVistaPrevia(data);
    } catch (error) {
      console.error('Error en vista previa:', error);
      // Datos de ejemplo
      setVistaPrevia({
        total_proyectos: 15,
        presupuesto_total: 25000000,
        beneficiarios_total: 5000,
        obras_por_estado: { 'En progreso': 8, 'Completado': 5, 'Pendiente': 2 },
        fecha_corte: formatFechaAPI(fechaCorte)
      });
    } finally {
      setCargandoVistaPrevia(false);
    }
  };

  // Función para descargar archivo
  const descargarArchivo = async (blob: Blob, nombreArchivo: string) => {
    // Para Excel, asegurar tipo MIME correcto
    if (nombreArchivo.endsWith('.xlsx') || nombreArchivo.endsWith('.xls')) {
      const excelBlob = new Blob([blob], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(excelBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } else {
      // Para otros tipos de archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    }
  };

  // Función principal para generar reportes
  const generarReporte = async (tipoReporteEspecifico?: string) => {
    if (!fechaCorte) {
      toast({ 
        title: '❌ Error', 
        description: 'Selecciona una fecha de corte', 
        variant: 'destructive' 
      });
      return;
    }

    setGenerando(true);
    
    try {
      const tipoFinal = tipoReporteEspecifico || tipoReporte;
      
      const payload = {
        tipo_reporte: tipoFinal,
        fecha_corte: formatFechaAPI(fechaCorte),
        formato: formato === 'ambos' ? 'pdf' : formato, // Para 'ambos' manejamos separado
        periodo: periodo,
        direcciones: direccionSeleccionada === 'todas' ? [] : [parseInt(direccionSeleccionada)],
        incluir_graficos: incluirGraficos,
        nombre_reporte: `Reporte_${tipoFinal}_${formatFecha(fechaCorte).replace(/\//g, '-')}`,
      };

      console.log('📤 Enviando solicitud:', payload);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_BASE_URL}/api/reportes/generar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      const contentDisposition = response.headers.get('content-disposition') || '';
      
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}`);
        } catch {
          throw new Error(`Error del servidor: ${response.status}`);
        }
      }

      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('El archivo recibido está vacío');
      }

      // Determinar tipo de archivo y nombre
      let extension = '';
      let tipoMIME = '';

      if (contentType.includes('application/pdf')) {
        extension = '.pdf';
        tipoMIME = 'application/pdf';
      } else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        extension = '.xlsx';
        tipoMIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else if (contentType.includes('application/vnd.ms-excel')) {
        extension = '.xls';
        tipoMIME = 'application/vnd.ms-excel';
      } else if (contentType.includes('application/zip')) {
        extension = '.zip';
        tipoMIME = 'application/zip';
      }

      const nombreArchivo = `reporte_${tipoFinal}_${formatFecha(fechaCorte).replace(/\//g, '-')}${extension}`;

      // Crear blob con tipo MIME específico
      const blobCorregido = new Blob([blob], { type: tipoMIME || contentType });

      await descargarArchivo(blobCorregido, nombreArchivo);

      // Toast según tipo
      if (tipoMIME.includes('pdf')) {
        toast({
          title: '✅ PDF generado',
          description: `Se descargó correctamente`,
        });
      } else if (tipoMIME.includes('excel') || tipoMIME.includes('spreadsheet')) {
        toast({
          title: '✅ Excel generado',
          description: `Archivo XLSX listo para abrir`,
        });
      } else if (tipoMIME.includes('zip')) {
        toast({
          title: '✅ ZIP generado',
          description: `Contiene PDF y Excel`,
        });
      }
      
    } catch (error: any) {
      console.error('❌ Error:', error);
      
      let mensajeError = error.message || 'Error desconocido';
      if (error.name === 'AbortError') {
        mensajeError = 'La solicitud tardó demasiado. Intenta nuevamente.';
      }
      
      toast({
        title: '❌ Error',
        description: mensajeError,
        variant: 'destructive',
      });
    } finally {
      setGenerando(false);
    }
  };

  // Función para generar ambos formatos separadamente
  const generarAmbosFormatos = async (tipo: string) => {
    setGenerando(true);
    
    try {
      toast({
        title: '⏳ Generando ambos formatos...',
        description: 'Esto puede tomar unos segundos',
      });
      
      // Primero PDF
      const payloadPDF = {
        tipo_reporte: tipo,
        fecha_corte: formatFechaAPI(fechaCorte),
        formato: 'pdf',
      };
      
      const responsePDF = await fetch(`${API_BASE_URL}/api/reportes/generar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadPDF),
      });
      
      if (responsePDF.ok) {
        const blobPDF = await responsePDF.blob();
        if (blobPDF.size > 0) {
          const nombrePDF = `reporte_${tipo}_${formatFecha(fechaCorte).replace(/\//g, '-')}.pdf`;
          await descargarArchivo(blobPDF, nombrePDF);
        }
      }
      
      // Esperar 1 segundo antes de Excel
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Luego Excel
      const payloadExcel = {
        tipo_reporte: tipo,
        fecha_corte: formatFechaAPI(fechaCorte),
        formato: 'excel',
      };
      
      const responseExcel = await fetch(`${API_BASE_URL}/api/reportes/generar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadExcel),
      });
      
      if (responseExcel.ok) {
        const blobExcel = await responseExcel.blob();
        if (blobExcel.size > 0) {
          const nombreExcel = `reporte_${tipo}_${formatFecha(fechaCorte).replace(/\//g, '-')}.xlsx`;
          await descargarArchivo(blobExcel, nombreExcel);
        }
      }
      
      toast({
        title: '✅ Ambos formatos generados',
        description: `PDF y Excel descargados - ${formatFecha(fechaCorte)}`,
      });
      
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: '❌ Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setGenerando(false);
    }
  };

  // Función unificada que maneja ambos formatos
  const generarReporteUnificado = async (tipoReporteEspecifico?: string) => {
    const tipoFinal = tipoReporteEspecifico || tipoReporte;
    
    if (formato === 'ambos') {
      await generarAmbosFormatos(tipoFinal);
    } else {
      await generarReporte(tipoFinal);
    }
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Obtener la sección activa
  const seccionActiva = SECCIONES_REPORTES.find(s => s.endpoint === tipoReporte);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <Toaster />
      
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Centro de Reportes</h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
          Genera informes ejecutivos en PDF y Excel
        </p>
        
        {/* Sección activa */}
        {seccionActiva && (
          <div className="mt-3 inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1">
            <div className={`p-1 rounded ${seccionActiva.color}`}>
              <seccionActiva.icon className={`h-3 w-3 ${seccionActiva.iconColor}`} />
            </div>
            <span className="text-xs font-medium text-gray-700">
              {seccionActiva.nombre}
            </span>
          </div>
        )}
      </div>

      {/* Controles principales */}
      <Card className="shadow-lg border-0 mb-6">
        <CardHeader className="bg-gradient-to-r from-[#9F2241]/10 to-[#7F1D3A]/10 border-b">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <FileText className="h-5 w-5 text-[#9F2241]" />
            <span>Configuración del Reporte</span>
          </CardTitle>
          <CardDescription>
            Personaliza los parámetros para generar tu reporte
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Fila 1: Fecha y Dirección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Fecha de Corte */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                Fecha de Corte
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !fechaCorte && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaCorte ? (
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{formatFecha(fechaCorte)}</span>
                        <span className="text-xs text-gray-500">
                          {formatFechaLegible(fechaCorte)}
                        </span>
                      </div>
                    ) : (
                      <span>Selecciona fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaCorte}
                    onSelect={(date) => date && setFechaCorte(date)}
                    initialFocus
                    locale={es}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label>Área/Dirección</Label>
              <Select 
                value={direccionSeleccionada} 
                onValueChange={setDireccionSeleccionada}
                disabled={cargandoDirecciones}
              >
                <SelectTrigger className="h-12">
                  {cargandoDirecciones ? (
                    <span className="text-gray-400">Cargando direcciones...</span>
                  ) : (
                    <SelectValue placeholder="Selecciona área" />
                  )}
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="todas">Todas las Direcciones</SelectItem>
                      {direcciones.map((dir) => (
                        <SelectItem key={dir.id} value={dir.id.toString()}>
                          {dir.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fila 2: Tipo, Período y Formato */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Tipo de Reporte */}
            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select value={tipoReporte} onValueChange={setTipoReporte}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {SECCIONES_REPORTES.map((seccion) => (
                    <SelectItem key={seccion.id} value={seccion.endpoint}>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${seccion.color}`}>
                          <seccion.icon className={`h-3 w-3 ${seccion.iconColor}`} />
                        </div>
                        <span>{seccion.nombre}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecciona período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Formato */}
            <div className="space-y-2">
              <Label>Formato de Salida</Label>
              <div className="flex gap-2">
                <Button
                  variant={formato === 'pdf' ? 'default' : 'outline'}
                  onClick={() => setFormato('pdf')}
                  className="flex-1 h-12"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant={formato === 'excel' ? 'default' : 'outline'}
                  onClick={() => setFormato('excel')}
                  className="flex-1 h-12"
                >
                  <span className="mr-2">📊</span>
                  Excel
                </Button>
                <Button
                  variant={formato === 'ambos' ? 'default' : 'outline'}
                  onClick={() => setFormato('ambos')}
                  className="flex-1 h-12"
                >
                  <span className="mr-2">📦</span>
                  Ambos
                </Button>
              </div>
            </div>
          </div>

          {/* Botón de acción principal */}
          <div className="mb-6">
            <Button
              onClick={() => generarReporteUnificado()}
              disabled={generando}
              className="w-full h-14 bg-gradient-to-r from-[#9F2241] to-[#7F1D3A] hover:from-[#8B1C3A] hover:to-[#6E162F] text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {generando ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Generando Reporte...
                </>
              ) : (
                <>
                  <Download className="mr-3 h-5 w-5" />
                  Generar Reporte {seccionActiva?.nombre}
                </>
              )}
            </Button>
            
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Fecha: {formatFecha(fechaCorte)}</span>
              <span>Formato: {formato.toUpperCase()}</span>
              <span>Período: {periodo}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección: Vista Previa */}
      <Card className="shadow-md border-0 mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
          <CardTitle className="flex items-center justify-between">
            <span className="text-gray-800">Vista Previa del Informe</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={actualizarVistaPrevia}
              disabled={cargandoVistaPrevia}
            >
              {cargandoVistaPrevia ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Actualizar"
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Resumen basado en los filtros seleccionados
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {cargandoVistaPrevia ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Proyectos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {vistaPrevia?.total_proyectos || 0}
                </p>
                <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</p>
                <p className="text-lg font-bold text-gray-900 mt-1 truncate">
                  {vistaPrevia ? formatCurrency(vistaPrevia.presupuesto_total) : '$0'}
                </p>
                <div className="h-1 w-12 bg-green-500 rounded-full mt-2"></div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiarios</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {vistaPrevia?.beneficiarios_total?.toLocaleString() || '0'}
                </p>
                <div className="h-1 w-12 bg-purple-500 rounded-full mt-2"></div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Corte</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatFecha(fechaCorte)}
                </p>
                <div className="text-xs text-gray-500 mt-1">
                  {formatFechaLegible(fechaCorte)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección: Generar por Área del Sistema */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Generar Reporte por Sección</h2>
            <p className="text-sm text-gray-600">Selecciona una sección específica del sistema</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {formatFecha(fechaCorte)} | {formato.toUpperCase()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECCIONES_REPORTES.map((seccion) => {
            const Icon = seccion.icon;
            const isActive = tipoReporte === seccion.endpoint;
            
            return (
              <Card 
                key={seccion.id} 
                className={cn(
                  "hover:shadow-lg transition-all duration-200 cursor-pointer border-2",
                  isActive ? "border-[#9F2241]" : "border-transparent hover:border-gray-200"
                )}
                onClick={() => setTipoReporte(seccion.endpoint)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${seccion.color}`}>
                        <Icon className={`h-5 w-5 ${seccion.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{seccion.nombre}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {seccion.tags.map((tag) => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div className="h-2 w-2 bg-[#9F2241] rounded-full"></div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{seccion.descripcion}</p>
                  
                  {/* BOTÓN SIMPLE que usa el formato global */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTipoReporte(seccion.endpoint);
                      generarReporteUnificado(seccion.endpoint);
                    }}
                    disabled={generando}
                    className={cn(
                      "w-full h-10",
                      isActive 
                        ? "bg-[#9F2241] text-white hover:bg-[#8B1C3A]" 
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    )}
                    size="sm"
                  >
                    {generando && tipoReporte === seccion.endpoint ? (
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3 mr-2" />
                    )}
                    Descargar
                  </Button>
                  
                  {/* Información del formato actual */}
                  <div className="mt-2 text-xs text-center text-gray-500">
                    Formato actual: <span className="font-medium">{formato.toUpperCase()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      {/* Sección: Configuración Avanzada */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Configuración Avanzada</CardTitle>
          <CardDescription>Opciones adicionales para personalizar tu reporte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Opciones de Visualización</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="graficos"
                checked={incluirGraficos}
                onCheckedChange={(checked) => setIncluirGraficos(checked as boolean)}
              />
              <Label htmlFor="graficos" className="text-sm">
                Incluir gráficos y visualizaciones
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="resumen" defaultChecked />
              <Label htmlFor="resumen" className="text-sm">
                Incluir resumen ejecutivo
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="anexos" />
              <Label htmlFor="anexos" className="text-sm">
                Incluir anexos y datos técnicos
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}