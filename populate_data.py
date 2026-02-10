# backend/populate_data.py
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.core.settings')
django.setup()

from backend.poa.models import Direccion, Obra
from datetime import date

def crear_direcciones():
    """Crea las direcciones si no existen"""
    direcciones = [
        {'nombre': 'Obras Públicas', 'codigo': 'OP', 'descripcion': 'Dirección de Obras Públicas'},
        {'nombre': 'Desarrollo Social', 'codigo': 'DS', 'descripcion': 'Dirección de Desarrollo Social'},
        {'nombre': 'Servicios Públicos', 'codigo': 'SP', 'descripcion': 'Dirección de Servicios Públicos'},
        {'nombre': 'Medio Ambiente', 'codigo': 'MA', 'descripcion': 'Dirección de Medio Ambiente'},
        {'nombre': 'Innovación', 'codigo': 'IN', 'descripcion': 'Dirección de Innovación'},
        {'nombre': 'Desarrollo Económico', 'codigo': 'DE', 'descripcion': 'Dirección de Desarrollo Económico'},
        {'nombre': 'Movilidad', 'codigo': 'MO', 'descripcion': 'Dirección de Movilidad'},
    ]
    
    creadas = 0
    for data in direcciones:
        obj, created = Direccion.objects.get_or_create(**data)
        if created:
            creadas += 1
            print(f"✅ Creada: {data['nombre']}")
        else:
            print(f"✓ Ya existe: {data['nombre']}")
    
    print(f"\nTotal direcciones: {Direccion.objects.count()}")
    return creadas

def crear_obras_ejemplo():
    """Crea algunas obras de ejemplo si no hay datos"""
    if Obra.objects.count() > 0:
        print(f"Ya existen {Obra.objects.count()} obras")
        return
    
    obras_ejemplo = [
        {
            'programa': 'Rehabilitación de Red de Agua Potable',
            'area_responsable': 'Obras Públicas',
            'presupuesto_modificado': 15000000,
            'anteproyecto_total': 15000000,
            'avance_fisico_pct': 75.5,
            'estatus_general': 'En ejecución',
            'fecha_inicio_prog': date(2024, 1, 15),
            'fecha_termino_prog': date(2024, 12, 31),
        },
        {
            'programa': 'Construcción de Centro Comunitario',
            'area_responsable': 'Desarrollo Social',
            'presupuesto_modificado': 8500000,
            'anteproyecto_total': 8500000,
            'avance_fisico_pct': 100.0,
            'estatus_general': 'Completado',
            'fecha_inicio_prog': date(2023, 6, 1),
            'fecha_termino_prog': date(2024, 3, 15),
        },
    ]
    
    for data in obras_ejemplo:
        Obra.objects.create(**data)
        print(f"✅ Creada obra: {data['programa'][:30]}...")
    
    print(f"\nTotal obras: {Obra.objects.count()}")

if __name__ == "__main__":
    print("POBLANDO BASE DE DATOS CON DATOS DE PRUEBA")
    print("="*50)
    
    creadas_dir = crear_direcciones()
    crear_obras_ejemplo()
    
    print("\n" + "="*50)
    print("✅ DATOS CREADOS EXITOSAMENTE")
    print(f"• Direcciones: {Direccion.objects.count()}")
    print(f"• Obras: {Obra.objects.count()}")
