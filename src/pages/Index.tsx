// Proyecto\POA_Reporte\backend\scr\pages\Index
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ReportsView } from '@/components/views/ReportsView';

type View = 'dashboard' | 'projects' | 'risks' | 'territory' | 'timeline' | 'transparency' | 'reports' | 'settings';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('reports');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Total Proyectos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">89</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-3xl font-bold text-green-600 mt-2">52</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Atrasados</p>
                <p className="text-3xl font-bold text-red-600 mt-2">15</p>
              </div>
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Cartera de Proyectos</h1>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Vista de proyectos en desarrollo...</p>
            </div>
          </div>
        );
      
      case 'risks':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Riesgos</h1>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Vista de riesgos en desarrollo...</p>
            </div>
          </div>
        );
      
      case 'territory':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Impacto Territorial</h1>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Vista territorial en desarrollo...</p>
            </div>
          </div>
        );
      
      case 'timeline':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Línea de Tiempo</h1>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Vista de timeline en desarrollo...</p>
            </div>
          </div>
        );
      
      case 'transparency':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Transparencia</h1>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Vista de transparencia en desarrollo...</p>
            </div>
          </div>
        );
      
      case 'reports':
        return <ReportsView />;
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Vista de configuración en desarrollo...</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Selecciona una opción del menú lateral</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Index;