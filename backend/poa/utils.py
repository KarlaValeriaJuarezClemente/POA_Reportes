 # Proyecto\POA_Reporte\backend\poa\utils.py
import pandas as pd
import numpy as np
import re

# 1. Catálogo de Escalas
CATALOGO_ESCALAS = {
    "muy bajo": 1, "bajo": 2, "regular": 3, "medio": 3, "media": 3,
    "alto": 4, "alta": 4, "muy alto": 5, "muy alta": 5,
    "critico": 5, "critica": 5, "urgente": 5, "prioritario": 5,
    "rojo": 5, "amarillo": 3, "verde": 1
}

# 2. Limpieza de Dinero
def clean_money_vectorized(valor):
    if pd.isna(valor): return 0.0
    val_str = str(valor).replace('$', '').replace(',', '')
    try:
        return float(val_str)
    except:
        return 0.0

# 3. Limpieza de Porcentajes (ESTA ES LA QUE FALTABA)
def clean_percentage_vectorized(valor):
    if pd.isna(valor): return 0.0
    val_str = str(valor).replace('%', '').strip()
    try:
        return float(val_str)
    except:
        return 0.0

# 4. Interpretación de Escalas
def interpretar_escala_flexible(valor):
    """Devuelve el valor numérico (1-5)"""
    if pd.isna(valor): return 1
    val_str = str(valor).strip().lower()
    
    # Buscar número explícito
    match = re.search(r'\b([1-5])\b', val_str)
    if match: return int(match.group(1))
    
    # Buscar palabras clave
    for key, num in CATALOGO_ESCALAS.items():
        if key in val_str: return num
            
    return 1 # Default