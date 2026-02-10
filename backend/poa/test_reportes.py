# Proyecto\POA_Reporte\backend\poa\test_reportes.py
import os
import django
import json
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Test URLs
BASE_URL = 'http://127.0.0.1:8000'

print("🧪 Probando endpoints de reportes...")

# 1. Probar endpoint de direcciones
print("\n1. Probando /api/direcciones/")
print(f"URL: {BASE_URL}/api/direcciones/")
print("Esperado: Lista de direcciones (JSON)")

# 2. Probar vista previa
print("\n2. Probando /api/reportes/vista_previa/")
fecha_hoy = datetime.now().strftime('%Y-%m-%d')
url_vista_previa = f"{BASE_URL}/api/reportes/vista_previa/?fecha_corte={fecha_hoy}"
print(f"URL: {url_vista_previa}")
print("Esperado: JSON con estadísticas")

# 3. Probar generación de reporte
print("\n3. Probando /api/reportes/generar/")
payload = {
    "tipo_reporte": "ejecutivo",
    "periodo": "mensual",
    "fecha_corte": fecha_hoy,
    "formato": "pdf",
    "direcciones": [],
    "incluir_graficos": True,
    "nombre_reporte": "Test Reporte"
}
print(f"URL: {BASE_URL}/api/reportes/generar/")
print(f"Payload: {json.dumps(payload, indent=2)}")
print("Esperado: Archivo PDF descargable")

print("\n📋 Instrucciones:")
print("1. Inicia el servidor: python manage.py runserver")
print("2. Abre http://127.0.0.1:8000/api/direcciones/ en el navegador")
print("3. Deberías ver una lista JSON de direcciones")
print("4. Prueba el frontend React, ahora debería funcionar")