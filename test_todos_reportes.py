# backend/test_todos_reportes.py
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

secciones = [
    'ejecutivo',
    'cartera', 
    'presupuesto',
    'riesgos',
    'territorial',
    'transparencia'
]

formatos = ['pdf', 'excel', 'ambos']

def test_reporte(seccion, formato):
    print(f"\n🔍 Probando: {seccion.upper()} - {formato.upper()}")
    
    payload = {
        'tipo_reporte': seccion,
        'fecha_corte': '2024-02-09',
        'formato': formato,
        'periodo': 'mensual'
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/reportes/generar/",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            
            if 'pdf' in content_type:
                with open(f"test_{seccion}.pdf", 'wb') as f:
                    f.write(response.content)
                print(f"✅ PDF generado: test_{seccion}.pdf")
                
            elif 'excel' in content_type or 'sheet' in content_type:
                with open(f"test_{seccion}.xlsx", 'wb') as f:
                    f.write(response.content)
                print(f"✅ Excel generado: test_{seccion}.xlsx")
                
            elif 'zip' in content_type:
                with open(f"test_{seccion}.zip", 'wb') as f:
                    f.write(response.content)
                print(f"✅ ZIP generado: test_{seccion}.zip")
                
            elif 'json' in content_type:
                data = response.json()
                print(f"✅ Respuesta JSON: {data.get('message', 'Éxito')}")
                
            else:
                print(f"⚠️ Tipo desconocido: {content_type}")
        else:
            print(f"❌ Error {response.status_code}: {response.text[:100]}")
            
    except Exception as e:
        print(f"❌ Error en solicitud: {e}")

# Probar todos
for seccion in secciones:
    for formato in formatos:
        test_reporte(seccion, formato)

print("\n Todas las pruebas completadas!")