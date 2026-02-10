# Proyecto\POA_Reporte\backend/poa/admin.py
from django.contrib import admin
from .models import Obra, Direccion

@admin.register(Obra)
class ObraAdmin(admin.ModelAdmin):
    list_display = ('id_excel', 'programa', 'presupuesto_modificado', 'urgencia')
    search_fields = ('programa',)


@admin.register(Direccion)
class DireccionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'activa', 'descripcion')
    search_fields = ('nombre', 'codigo')