# Proyecto\POA_Reporte\backend\poa\models.py
from django.db import models
from django.conf import settings


class Obra(models.Model):
    # --- Identificadores y Clasificación (Cols 0-6) ---
    id_excel = models.IntegerField(null=True)            # col 0: id
    programa = models.TextField(null=True, blank=True)   # col 1
    area_responsable = models.CharField(max_length=255, null=True, blank=True) # col 2
    eje_institucional = models.CharField(max_length=255, null=True, blank=True) # col 3
    tipo_recurso = models.CharField(max_length=255, null=True, blank=True)      # col 4
    concentrado_programas = models.CharField(max_length=255, null=True, blank=True) # col 5
    capitulo_gasto = models.CharField(max_length=100, null=True, blank=True)    # col 6

    # --- Financieros y Metas (Cols 7-14) ---
    presupuesto_modificado = models.FloatField(default=0)  # col 7
    anteproyecto_total = models.FloatField(default=0)      # col 8
    meta_2025 = models.FloatField(default=0)               # col 9
    meta_2026 = models.FloatField(default=0)               # col 10
    unidad_medida = models.CharField(max_length=100, null=True, blank=True) # col 11
    costo_unitario = models.FloatField(default=0)          # col 12
    proyecto_2025_presupuesto = models.FloatField(null=True, blank=True) # col 13
    multianualidad = models.CharField(max_length=50, null=True, blank=True) # col 14

    # --- Características de la Obra (Cols 15-18) ---
    tipo_obra = models.CharField(max_length=255, null=True, blank=True)          # col 15
    alcance_territorial = models.TextField(null=True, blank=True)                # col 16
    fuente_financiamiento = models.CharField(max_length=255, null=True, blank=True) # col 17
    etapa_desarrollo = models.CharField(max_length=255, null=True, blank=True)   # col 18

    # --- Escalas 1-5 (Cols 19-27) - Guardamos NUMEROS ---
    complejidad_tecnica = models.IntegerField(default=1)    # col 19
    impacto_social = models.IntegerField(default=1)         # col 20
    alineacion_estrategica = models.IntegerField(default=1) # col 21
    impacto_social_nivel = models.IntegerField(default=1)   # col 22
    urgencia = models.IntegerField(default=1)               # col 23
    viabilidad_ejecucion = models.IntegerField(default=1)   # col 24
    recursos_disponibles = models.IntegerField(default=1)   # col 25
    riesgo_nivel = models.IntegerField(default=1)           # col 26
    dependencias_nivel = models.IntegerField(default=1)     # col 27

    # --- Semáforos y Viabilidad (Cols 28-33) ---
    puntuacion_final = models.FloatField(null=True, blank=True) # col 28
    viabilidad_tecnica_semaforo = models.CharField(max_length=50, null=True, blank=True)       # col 29
    viabilidad_presupuestal_semaforo = models.CharField(max_length=50, null=True, blank=True)  # col 30
    viabilidad_juridica_semaforo = models.CharField(max_length=50, null=True, blank=True)      # col 31
    viabilidad_temporal_semaforo = models.CharField(max_length=50, null=True, blank=True)      # col 32
    viabilidad_administrativa_semaforo = models.CharField(max_length=50, null=True, blank=True)# col 33

    # --- Ubicación y Beneficiarios (Cols 34-37) ---
    alcaldias = models.TextField(null=True, blank=True)            # col 34
    ubicacion_especifica = models.TextField(null=True, blank=True) # col 35
    beneficiarios_directos = models.CharField(max_length=255, null=True, blank=True) # col 36
    poblacion_objetivo_num = models.CharField(max_length=255, null=True, blank=True) # col 37

    # --- Fechas (Cols 38-42) ---
    fecha_inicio_prog = models.DateField(null=True, blank=True)   # col 38
    fecha_termino_prog = models.DateField(null=True, blank=True)  # col 39
    duracion_meses = models.CharField(max_length=100, null=True, blank=True) # col 40
    fecha_inicio_real = models.DateField(null=True, blank=True)   # col 41
    fecha_termino_real = models.DateField(null=True, blank=True)  # col 42

    # --- Avances y Estatus (Cols 43-47) ---
    avance_fisico_pct = models.FloatField(default=0)      # col 43
    avance_financiero_pct = models.FloatField(default=0)  # col 44
    estatus_general = models.CharField(max_length=255, null=True, blank=True) # col 45
    permisos_requeridos = models.TextField(null=True, blank=True) # col 46
    estatus_permisos = models.TextField(null=True, blank=True)    # col 47

    # --- Detalles Adicionales (Cols 48-66) ---
    requisitos_especificos = models.TextField(null=True, blank=True) # col 48
    responsable_operativo = models.CharField(max_length=255, null=True, blank=True) # col 49
    contratista = models.CharField(max_length=255, null=True, blank=True) # col 50
    observaciones = models.TextField(null=True, blank=True)       # col 51
    problemas_identificados = models.TextField(null=True, blank=True) # col 52
    acciones_correctivas = models.TextField(null=True, blank=True) # col 53
    ultima_actualizacion = models.DateField(null=True, blank=True) # col 54
    problema_resuelve = models.TextField(null=True, blank=True)   # col 55
    solucion_ofrece = models.TextField(null=True, blank=True)     # col 56
    beneficio_ciudadania = models.TextField(null=True, blank=True) # col 57
    dato_destacable = models.TextField(null=True, blank=True)     # col 58
    alineacion_gobierno = models.TextField(null=True, blank=True) # col 59
    poblacion_perfil = models.TextField(null=True, blank=True)    # col 60
    
    # Comunicacion
    relevancia_comunicacional = models.TextField(null=True, blank=True) # col 61
    hitos_comunicacionales = models.TextField(null=True, blank=True)    # col 62
    mensajes_clave = models.TextField(null=True, blank=True)            # col 63
    estrategia_comunicacion = models.TextField(null=True, blank=True)   # col 64
    control_captura = models.TextField(null=True, blank=True)           # col 65
    control_notas = models.TextField(null=True, blank=True)             # col 66

    def __str__(self):
        return str(self.programa)[:50]
    
    
class Direccion(models.Model):
    nombre = models.CharField(max_length=200)
    codigo = models.CharField(max_length=50, unique=True)
    activa = models.BooleanField(default=True)
    descripcion = models.TextField(blank=True, null=True) 
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"
    
    class Meta:
        verbose_name = "Dirección"
        verbose_name_plural = "Direcciones"
        

class ReporteConfig(models.Model):
    """Configuración guardada de reportes generados"""
    TIPO_REPORTE_CHOICES = [
        ('ejecutivo', 'Reporte Ejecutivo'),
        ('cartera', 'Cartera de Proyectos'),
        ('presupuesto', 'Ejecución Presupuestal'),
        ('riesgos', 'Análisis de Riesgos'),
        ('territorial', 'Impacto Territorial'),
    ]
    
    PERIODO_CHOICES = [
        ('semanal', 'Semanal'),
        ('mensual', 'Mensual'),
        ('trimestral', 'Trimestral'),
        ('anual', 'Anual'),
    ]
    
    nombre = models.CharField(max_length=200)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    tipo_reporte = models.CharField(max_length=50, choices=TIPO_REPORTE_CHOICES)
    periodo = models.CharField(max_length=50, choices=PERIODO_CHOICES)
    fecha_corte = models.DateField()
    
    # Filtros
    direcciones = models.ManyToManyField('Direccion', blank=True)
    incluir_todas_direcciones = models.BooleanField(default=True)
    
    # Configuración adicional
    incluir_graficos = models.BooleanField(default=True)
    incluir_anexos = models.BooleanField(default=False)
    formato_salida = models.CharField(max_length=20, choices=[
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('ambos', 'PDF y Excel')
    ], default='pdf')
    
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Configuración de Reporte"
        verbose_name_plural = "Configuraciones de Reportes"
        ordering = ['-creado_en']
    
    def __str__(self):
        return f"{self.nombre} - {self.get_tipo_reporte_display()}"

class ReporteGenerado(models.Model):
    """Reportes ya generados y almacenados"""
    configuracion = models.ForeignKey(ReporteConfig, on_delete=models.CASCADE)
    archivo_pdf = models.FileField(upload_to='reportes/pdf/%Y/%m/', null=True, blank=True)
    archivo_excel = models.FileField(upload_to='reportes/excel/%Y/%m/', null=True, blank=True)
    nombre_archivo = models.CharField(max_length=255)
    
    # Metadata del reporte
    total_proyectos = models.IntegerField(default=0)
    presupuesto_total = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    beneficiarios_total = models.BigIntegerField(default=0)
    resumen_json = models.JSONField(default=dict)  # Resumen estadístico
    
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    generado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    
    class Meta:
        verbose_name = "Reporte Generado"
        verbose_name_plural = "Reportes Generados"
        ordering = ['-fecha_generacion']
    
    def __str__(self):
        return f"{self.nombre_archivo} - {self.fecha_generacion.date()}"
    
    def get_download_url(self, formato='pdf'):
        if formato == 'pdf' and self.archivo_pdf:
            return self.archivo_pdf.url
        elif formato == 'excel' and self.archivo_excel:
            return self.archivo_excel.url
        return None