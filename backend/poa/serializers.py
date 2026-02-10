# # Proyecto\POA_Reporte\backend\poa\serializers.py
from rest_framework import serializers
from .models import Obra, Direccion, ReporteConfig, ReporteGenerado


class ObraSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Obra con campos calculados y transformaciones.
    """
    # Campos calculados
    semaforo = serializers.SerializerMethodField()
    presupuesto_final = serializers.SerializerMethodField()
    monto_ejecutado = serializers.SerializerMethodField()

    # Campos de Texto para Escalas
    urgencia = serializers.SerializerMethodField()
    impacto_social = serializers.SerializerMethodField()
    alineacion_estrategica = serializers.SerializerMethodField()
    complejidad_tecnica = serializers.SerializerMethodField()
    riesgo_nivel = serializers.SerializerMethodField()

    # Datos numéricos crudos
    urgencia_num = serializers.IntegerField(source='urgencia', read_only=True)
    riesgo_nivel_num = serializers.IntegerField(
        source='riesgo_nivel', read_only=True
    )
    viabilidad_ejecucion_num = serializers.IntegerField(
        source='viabilidad_ejecucion', read_only=True
    )

    # Viabilidades como semáforos
    viabilidad_tecnica = serializers.CharField(
        source='viabilidad_tecnica_semaforo', read_only=True
    )
    viabilidad_presupuestal = serializers.CharField(
        source='viabilidad_presupuestal_semaforo', read_only=True
    )
    viabilidad_juridica = serializers.CharField(
        source='viabilidad_juridica_semaforo', read_only=True
    )
    viabilidad_temporal = serializers.CharField(
        source='viabilidad_temporal_semaforo', read_only=True
    )
    viabilidad_administrativa = serializers.CharField(
        source='viabilidad_administrativa_semaforo', read_only=True
    )

    class Meta:
        """Configuración del Meta para ObraSerializer."""
        model = Obra
        fields = '__all__'

    def get_presupuesto_final(self, obj):
        """Calcula el presupuesto final según documentación."""
        if obj.presupuesto_modificado and obj.presupuesto_modificado > 0:
            return obj.presupuesto_modificado
        return obj.anteproyecto_total or 0

    def get_monto_ejecutado(self, obj):
        """Calcula el monto ejecutado basado en avance financiero."""
        presupuesto = self.get_presupuesto_final(obj)
        return presupuesto * (obj.avance_financiero_pct / 100.0)

    def get_semaforo(self, obj):
        """Determina el semáforo según riesgo y avance."""
        if obj.riesgo_nivel >= 4:
            return "ROJO"
        if obj.avance_fisico_pct < 20 and obj.urgencia >= 4:
            return "ROJO"
        if obj.riesgo_nivel == 3:
            return "AMARILLO"
        return "VERDE"

    def _to_text(self, valor):
        """Convierte valores numéricos a texto descriptivo."""
        textos = {
            1: "1 - Muy Bajo",
            2: "2 - Bajo",
            3: "3 - Regular",
            4: "4 - Alto",
            5: "5 - Muy Alto"
        }
        return textos.get(valor, f"{valor} - Definido")

    def get_urgencia(self, obj):
        """Obtiene urgencia como texto."""
        return self._to_text(obj.urgencia)

    def get_impacto_social(self, obj):
        """Obtiene impacto social como texto."""
        return self._to_text(obj.impacto_social)

    def get_alineacion_estrategica(self, obj):
        """Obtiene alineación estratégica como texto."""
        return self._to_text(obj.alineacion_estrategica)

    def get_complejidad_tecnica(self, obj):
        """Obtiene complejidad técnica como texto."""
        return self._to_text(obj.complejidad_tecnica)

    def get_riesgo_nivel(self, obj):
        """Obtiene nivel de riesgo como texto."""
        return self._to_text(obj.riesgo_nivel)


class DireccionSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Direccion.
    """

    class Meta:
        """Configuración del Meta para DireccionSerializer."""
        model = Direccion
        fields = ['id', 'nombre', 'codigo', 'descripcion']


class ReporteConfigSerializer(serializers.ModelSerializer):
    """
    Serializer para configuración de reportes.
    """
    direcciones_info = DireccionSerializer(
        source='direcciones', many=True, read_only=True
    )

    class Meta:
        """Configuración del Meta para ReporteConfigSerializer."""
        model = ReporteConfig
        fields = [
            'id', 'nombre', 'tipo_reporte', 'periodo', 'fecha_corte',
            'direcciones', 'direcciones_info', 'incluir_todas_direcciones',
            'incluir_graficos', 'incluir_anexos', 'formato_salida',
            'creado_en', 'actualizado_en'
        ]
        read_only_fields = ['creado_en', 'actualizado_en']


class GenerarReporteSerializer(serializers.Serializer):
    """Serializer para validar datos de generación de reportes"""
    nombre_reporte = serializers.CharField(max_length=200, required=False)
    tipo_reporte = serializers.ChoiceField(
        choices=[
            'ejecutivo', 
            'cartera', 
            'presupuesto', 
            'riesgos', 
            'territorial'
        ],
        required=True
    )
    periodo = serializers.ChoiceField(
        choices=['semanal', 'mensual', 'trimestral', 'anual'],
        required=True
    )
    fecha_corte = serializers.DateField(required=True)
    direcciones = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        allow_empty=True
    )
    incluir_todas_direcciones = serializers.BooleanField(default=True)
    formato = serializers.ChoiceField(
        choices=['pdf', 'excel', 'ambos'],
        default='pdf'
    )
    incluir_graficos = serializers.BooleanField(default=True)
    incluir_anexos = serializers.BooleanField(default=False)
    
    def validate_fecha_corte(self, value):
        """Validar que la fecha de corte no sea futura"""
        if value > date.today():
            raise serializers.ValidationError(
                "La fecha de corte no puede ser posterior a hoy"
            )
        return value

class ReporteGeneradoSerializer(serializers.ModelSerializer):
    """
    Serializer para reportes ya generados.
    """
    configuracion_info = ReporteConfigSerializer(
        source='configuracion', read_only=True
    )

    class Meta:
        """Configuración del Meta para ReporteGeneradoSerializer."""
        model = ReporteGenerado
        fields = [
            'id', 'nombre_archivo', 'configuracion', 'configuracion_info',
            'total_proyectos', 'presupuesto_total', 'beneficiarios_total',
            'fecha_generacion', 'archivo_pdf', 'archivo_excel'
        ]
        read_only_fields = fields
