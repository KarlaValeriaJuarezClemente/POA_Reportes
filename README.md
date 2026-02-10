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

### 4. Configurar y migrar base de datos
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
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

#### Terminal 1 - Backend (Django)
```bash
cd backend
python manage.py runserver
```

#### Terminal 2 - Frontend (React)
```bash
npm run dev
```

---
