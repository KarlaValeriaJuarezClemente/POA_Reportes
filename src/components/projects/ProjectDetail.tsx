import { Project, getStatusLabel, getPriorityLabel, formatCurrency, formatNumber } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  X, Calendar, MapPin, User, DollarSign, Users, Target, 
  AlertTriangle, CheckCircle, TrendingUp, Building2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const viabilityColors = {
    alta: 'bg-success/20 text-success border-success/30',
    media: 'bg-warning/20 text-warning border-warning/30',
    baja: 'bg-danger/20 text-danger border-danger/30',
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={project.status as any}>{getStatusLabel(project.status)}</Badge>
                <Badge variant={project.prioridad === 'critica' ? 'critical' : project.prioridad === 'alta' ? 'high' : 'medium'}>
                  Prioridad {getPriorityLabel(project.prioridad)}
                </Badge>
                <span className={cn("text-xs font-medium px-2 py-1 rounded-full border", viabilityColors[project.viabilidad])}>
                  Viabilidad {project.viabilidad.charAt(0).toUpperCase() + project.viabilidad.slice(1)}
                </span>
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold">{project.nombre}</h2>
              <p className="text-muted-foreground">{project.descripcion}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Building2 className="h-4 w-4" />
                <span className="text-xs">Dirección</span>
              </div>
              <p className="font-medium text-sm">{project.direccion}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                <span className="text-xs">Responsable</span>
              </div>
              <p className="font-medium text-sm">{project.responsable}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">Ubicación</span>
              </div>
              <p className="font-medium text-sm">{project.ubicacion}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs">Beneficiarios</span>
              </div>
              <p className="font-medium text-sm">{formatNumber(project.beneficiarios)}</p>
            </div>
          </div>

          {/* Progress & Budget */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Avance del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-display font-bold">{project.avance}%</span>
                    <span className="text-sm text-muted-foreground">completado</span>
                  </div>
                  <Progress value={project.avance} className="h-3" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Inicio: {new Date(project.fechaInicio).toLocaleDateString('es-MX')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Fin: {new Date(project.fechaFin).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-success" />
                  Presupuesto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-display font-bold">{formatCurrency(project.ejecutado)}</span>
                    <span className="text-sm text-muted-foreground">de {formatCurrency(project.presupuesto)}</span>
                  </div>
                  <Progress value={(project.ejecutado / project.presupuesto) * 100} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {((project.ejecutado / project.presupuesto) * 100).toFixed(1)}% del presupuesto ejecutado
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Objectives */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {project.objetivos.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span className="text-sm">{obj}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Indicators */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Indicadores de Desempeño</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {project.indicadores.map((ind, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">{ind.nombre}</p>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-2xl font-bold">{ind.actual}</span>
                      <span className="text-sm text-muted-foreground">/ {ind.meta} {ind.unidad}</span>
                    </div>
                    <Progress value={(ind.actual / ind.meta) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risks */}
          {project.riesgos.length > 0 && (
            <Card className="border-warning/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-4 w-4" />
                  Riesgos Identificados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.riesgos.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-warning">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
