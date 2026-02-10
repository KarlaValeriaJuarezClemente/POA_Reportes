import { Project, getStatusLabel, getPriorityLabel, formatCurrency } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, MapPin, User, DollarSign, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  delay?: number;
}

export function ProjectCard({ project, onClick, delay = 0 }: ProjectCardProps) {
  const viabilityColors = {
    alta: 'bg-success/20 text-success',
    media: 'bg-warning/20 text-warning',
    baja: 'bg-danger/20 text-danger',
  };

  return (
    <Card 
      className="cursor-pointer card-hover animate-slide-up overflow-hidden group"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className={cn(
        "h-1 w-full",
        project.status === 'completado' && "bg-success",
        project.status === 'en_ejecucion' && "bg-info",
        project.status === 'planificado' && "bg-muted-foreground",
        project.status === 'retrasado' && "bg-warning",
        project.status === 'en_riesgo' && "bg-danger",
      )} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={project.status as any} className="text-xs">
                {getStatusLabel(project.status)}
              </Badge>
              <Badge variant={project.prioridad === 'critica' ? 'critical' : project.prioridad === 'alta' ? 'high' : project.prioridad === 'media' ? 'medium' : 'low'} className="text-xs">
                {getPriorityLabel(project.prioridad)}
              </Badge>
            </div>
            <h3 className="font-display font-semibold text-base leading-tight group-hover:text-primary transition-colors">
              {project.nombre}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{project.descripcion}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">{project.responsable}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{project.ubicacion}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{new Date(project.fechaFin).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>{project.beneficiarios.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Avance</span>
            <span className="font-semibold">{project.avance}%</span>
          </div>
          <Progress value={project.avance} className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Presupuesto</p>
            <p className="font-semibold text-sm">{formatCurrency(project.presupuesto)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Viabilidad</p>
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", viabilityColors[project.viabilidad])}>
              {project.viabilidad.charAt(0).toUpperCase() + project.viabilidad.slice(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
