# # Proyecto\POA_Reporte\backend\poa\urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import views_reports
from .views import ObraViewSet, DireccionViewSet, ReporteViewSet

# El router crea automÃ¡ticamente las URLs de la API
router = DefaultRouter()
router.register(r'obras', ObraViewSet, basename='obra')
router.register(r'direcciones', DireccionViewSet, basename='direccion')
router.register(r'reportes', ReporteViewSet, basename='reporte')

#urlpatterns = router.urls

#urlpatterns = [
#    path('', include(router.urls)),
#    path('admin/', admin.site.urls),
#    path('api/obras/', include('obras.urls')),
 #   path('reportes/vista_previa/', views_reports.reporte_vista_previa, name='vista_previa'),
 #   path('reportes/generar/', views_reports.generar_reporte_simple, name='generar_reporte'),
#]


router = DefaultRouter()
router.register(r'obras', ObraViewSet, basename='obra')
router.register(r'direcciones', DireccionViewSet, basename='direccion')
router.register(r'reportes', ReporteViewSet, basename='reporte')

urlpatterns = [
    path('', include(router.urls)),
]