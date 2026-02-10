# # Proyecto\POA_Reporte\backend\poa\views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse, HttpResponse
from django.utils import timezone
from django.db.models import Sum, Avg, Count
from datetime import datetime, date
from collections import Counter
import zipfile
import os
import tempfile

from .models import Obra, Direccion
from .serializers import (
    ObraSerializer, DireccionSerializer,
    GenerarReporteSerializer
)
from .generador import GeneradorReportes, ConfiguracionReporte


class ObraViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Obra.objects.all()
    serializer_class = ObraSerializer


class DireccionViewSet(viewsets.ReadOnlyModelViewSet):
    """API para obtener direcciones disponibles"""
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    pagination_class = None


class ReporteViewSet(viewsets.ViewSet):
    """ViewSet para generación de reportes"""
    
    @action(detail=False, methods=['get'])
    def vista_previa(self, request):
        """Obtiene vista previa del reporte según filtros"""
        try:
            # Obtener parámetros
            fecha_corte_str = request.GET.get('fecha_corte')
            direcciones_ids = request.GET.getlist('direcciones[]')
            
            # Validar fecha de corte
            if fecha_corte_str:
                try:
                    fecha_corte = datetime.strptime(fecha_corte_str, '%Y-%m-%d').date()
                except ValueError:
                    return Response({
                        'error': 'Formato de fecha inválido. Use YYYY-MM-DD'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                fecha_corte = date.today()
            
            # Filtrar obras
            obras = Obra.objects.all()
            
            # Filtrar por direcciones si se especificaron
            if direcciones_ids:
                try:
                    direcciones_ids = [int(id) for id in direcciones_ids]
                    # Asumiendo que existe un campo 'direccion_id' o similar en Obra
                    # Ajusta según tu modelo
                    # obras = obras.filter(direccion_id__in=direcciones_ids)
                except (ValueError, TypeError):
                    pass
            
            # Filtrar por fecha
            obras = obras.filter(fecha_inicio_prog__lte=fecha_corte)
            
            # Calcular estadísticas
            estadisticas = self._calcular_estadisticas(obras)
            estadisticas['fecha_corte'] = fecha_corte.isoformat()
            
            return Response(estadisticas)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def generar(self, request):
        """Genera un reporte según configuración"""
        try:
            # Validar datos de entrada
            serializer = GenerarReporteSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'error': 'Datos inválidos',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            data = serializer.validated_data
            
            # Crear configuración usando la clase del generador
            config = ConfiguracionReporte(
                nombre=data.get('nombre_reporte', f"Reporte {data['tipo_reporte']}"),
                tipo_reporte=data['tipo_reporte'],
                periodo=data['periodo'],
                fecha_corte=data['fecha_corte'],
                formato_salida=data.get('formato', 'pdf'),
                incluir_graficos=data.get('incluir_graficos', True),
                incluir_anexos=data.get('incluir_anexos', False)
            )
            
            # Filtrar obras
            obras = Obra.objects.all()
            
            # Filtrar por direcciones si se especificaron
            if 'direcciones' in data and data['direcciones']:
                direcciones_ids = data['direcciones']
                # Ajusta según tu modelo - descomenta la línea siguiente si tienes campo direccion
                # obras = obras.filter(direccion_id__in=direcciones_ids)
            
            # Filtrar por fecha
            obras = obras.filter(fecha_inicio_prog__lte=config.fecha_corte)
            
            # Calcular estadísticas
            estadisticas = self._calcular_estadisticas(obras)
            
            # Generar reporte
            generador = GeneradorReportes()
            archivos_generados = {}
            
            if config.formato_salida in ['pdf', 'ambos']:
                archivo_pdf = generador.generar_pdf_reporte(obras, config, estadisticas)
                archivos_generados['pdf'] = archivo_pdf
            
            if config.formato_salida in ['excel', 'ambos']:
                archivo_excel = generador.generar_excel_reporte(obras, config, estadisticas)
                archivos_generados['excel'] = archivo_excel
            
            # Si se generan ambos formatos, crear ZIP
            if config.formato_salida == 'ambos':
                zip_path = tempfile.NamedTemporaryFile(suffix='.zip', delete=False).name
                with zipfile.ZipFile(zip_path, 'w') as zipf:
                    if 'pdf' in archivos_generados:
                        zipf.write(archivos_generados['pdf'], 
                                 f"{config.nombre}.pdf")
                    if 'excel' in archivos_generados:
                        zipf.write(archivos_generados['excel'], 
                                 f"{config.nombre}.xlsx")
                
                response = FileResponse(
                    open(zip_path, 'rb'),
                    content_type='application/zip'
                )
                response['Content-Disposition'] = f'attachment; filename="{config.nombre}.zip"'
                
                # Limpiar archivos temporales después de enviar respuesta
                for archivo in archivos_generados.values():
                    if os.path.exists(archivo):
                        try:
                            os.unlink(archivo)
                        except:
                            pass
                
                return response
            
            # Si es solo un formato
            elif config.formato_salida == 'pdf':
                response = FileResponse(
                    open(archivos_generados['pdf'], 'rb'),
                    content_type='application/pdf'
                )
                response['Content-Disposition'] = f'attachment; filename="{config.nombre}.pdf"'
                return response
            
            elif config.formato_salida == 'excel':
                response = FileResponse(
                    open(archivos_generados['excel'], 'rb'),
                    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
                response['Content-Disposition'] = f'attachment; filename="{config.nombre}.xlsx"'
                return response
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _calcular_estadisticas(self, obras):
        """Calcula estadísticas para el reporte"""
        # Totales básicos
        total_obras = obras.count()
        
        # Presupuesto
        presupuesto_total = obras.aggregate(
            total=Sum('presupuesto_modificado')
        )['total'] or 0
        
        # Si no hay presupuesto modificado, usar anteproyecto
        if presupuesto_total == 0:
            presupuesto_total = obras.aggregate(
                total=Sum('anteproyecto_total')
            )['total'] or 0
        
        presupuesto_promedio = presupuesto_total / total_obras if total_obras > 0 else 0
        
        # Beneficiarios - Convertir a entero si es string
        beneficiarios_total = 0
        for obra in obras:
            try:
                if obra.poblacion_objetivo_num:
                    if isinstance(obra.poblacion_objetivo_num, str):
                        # Eliminar comas y convertir
                        beneficiarios_total += int(obra.poblacion_objetivo_num.replace(',', ''))
                    else:
                        beneficiarios_total += int(obra.poblacion_objetivo_num)
            except (ValueError, TypeError):
                pass
        
        # Avances
        avance_promedio = obras.aggregate(
            promedio=Avg('avance_fisico_pct')
        )['promedio'] or 0
        
        # Distribución por estado
        obras_por_estado = dict(Counter(
            obras.exclude(estatus_general__isnull=True)
            .exclude(estatus_general='')
            .values_list('estatus_general', flat=True)
        ))
        
        # Distribución por área
        obras_por_area = dict(Counter(
            obras.exclude(area_responsable__isnull=True)
            .exclude(area_responsable='')
            .values_list('area_responsable', flat=True)
        ))
        
        # Obras activas
        obras_activas = obras.exclude(
            estatus_general__in=['Completado', 'Cancelado']
        ).count()
        
        # Presupuesto ejecutado
        presupuesto_ejecutado = 0
        for obra in obras:
            presupuesto = obra.presupuesto_modificado or obra.anteproyecto_total or 0
            avance_financiero = obra.avance_financiero_pct or 0
            presupuesto_ejecutado += presupuesto * (avance_financiero / 100)
        
        return {
            'total_obras': total_obras,
            'total_proyectos': total_obras,  # Alias
            'presupuesto_total': float(presupuesto_total),
            'presupuesto_promedio': float(presupuesto_promedio),
            'presupuesto_ejecutado': float(presupuesto_ejecutado),
            'beneficiarios_total': beneficiarios_total,
            'avance_promedio': float(avance_promedio),
            'obras_por_estado': obras_por_estado,
            'obras_por_area': obras_por_area,
            'obras_activas': obras_activas,
        }