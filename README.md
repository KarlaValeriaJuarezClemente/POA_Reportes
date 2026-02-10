#  Sistema de Reportes POA

Sistema para la generación de informes de obras públicas.
Arquitectura con Django (Backend) y React / Next.js (Frontend) .

---

##  Requisitos previos

- **Python 3.11+** (Backend Django)
- **Node.js 18+** (Frontend React)
- **pip** (Gestor de paquetes Python)
- **npm** (Gestor de paquetes Node.js)
- **Git** (Control de versiones)

---

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/KarlaValeriaJuarezClemente/POA_Reportes.git
cd POA_Reportes
```

### 2. Configurar entorno virtual Python
```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / Mac
source .venv/bin/activate
```

### 3. Instalar dependencias del Backend
```bash
pip install -r requirements.txt
```

### 4. Configurar y migrar base de datos (IMPORTANTE: en UNA MISMA terminal)
```bash
$env:PYTHONPATH = "$pwd"

# Navegar a la carpeta backend
cd backend

# Crear y aplicar migraciones
python manage.py makemigrations
python manage.py migrate

# NOTA: No cierres esta terminal hasta terminar la configuración
```

### 5. Instalar dependencias del Frontend
```bash
cd ..
npm install

# Instalar componentes UI necesarios
npx shadcn@latest init -y
npx shadcn@latest add toast button card label select calendar popover checkbox badge tooltip sonner dropdown-menu input
npm install date-fns @radix-ui/react-icons react-router-dom @tanstack/react-query
```

### 6. Para ejecutar el sistema
Abre DOS terminales de PowerShell:

#### Terminal 1 - Backend (Django)
```powershell
# Navegar a la carpeta del proyecto (ajusta la ruta según donde lo hayas clonado)
cd POA_Reportes

# Configurar PYTHONPATH para esta sesión
$env:PYTHONPATH = "$pwd"

# Navegar a backend y ejecutar servidor
cd backend
python manage.py runserver

# NO CIERRES ESTA TERMINAL mientras uses el sistema
```

#### Terminal 2 - Frontend (React)
```bash
# Navegar a la carpeta del proyecto
cd POA_Reportes

# Ejecutar servidor de desarrollo
npm run dev
```

---
