import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  Fingerprint, 
  Database, 
  History, 
  ShieldCheck, 
  FileText,
  ChevronRight,
  ExternalLink
} from "lucide-react"

const Dossier = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-12 animate-in fade-in duration-1000", className)}
    {...props}
  />
))
Dossier.displayName = "Dossier"

const DossierHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    subtitle?: string
    id?: string
    status?: string
    badge?: string
  }
>(({ className, title, subtitle, id, status, badge, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b border-border pb-8", className)}
    {...props}
  >
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Fingerprint className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
            {badge || "Official Intelligence Dossier"}
          </span>
        </div>
        <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none break-words">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="flex flex-col items-end gap-2">
        {id && (
          <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-sm border border-border">
            REC_ID: {id}
          </div>
        )}
        {status && (
          <div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-success/5 border border-success/20">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-success uppercase tracking-widest">
              Status: {status}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
))
DossierHeader.displayName = "DossierHeader"

const DossierSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    icon?: React.ReactNode
    description?: string
  }
>(({ className, title, icon, description, children, ...props }, ref) => (
  <section ref={ref} className={cn("space-y-6", className)} {...props}>
    {(title || icon) && (
      <div className="flex items-center gap-4 border-b border-border/50 pb-4">
        {icon && (
          <div className="h-8 w-8 rounded-sm bg-muted border border-border flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
        )}
        <div>
          {title && (
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {description}
            </p>
          )}
        </div>
      </div>
    )}
    <div className="pt-2">
      {children}
    </div>
  </section>
))
DossierSection.displayName = "DossierSection"

const DossierGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { cols?: 2 | 3 | 4 }
>(({ className, cols = 3, ...props }, ref) => {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }
  return (
    <div
      ref={ref}
      className={cn("grid gap-4", gridCols[cols], className)}
      {...props}
    />
  )
})
DossierGrid.displayName = "DossierGrid"

const DossierCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string
    value: React.ReactNode
    subValue?: string
    icon?: React.ReactNode
    trend?: 'neutral' | 'positive' | 'negative'
  }
>(({ className, label, value, subValue, icon, trend, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-5 bg-muted/20 border border-border rounded-md relative overflow-hidden group transition-all hover:bg-muted/30",
      trend === 'positive' && "border-l-4 border-l-success",
      trend === 'negative' && "border-l-4 border-l-destructive",
      className
    )}
    {...props}
  >
    <div className="relative z-10 space-y-1">
      {label && (
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
      )}
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-black text-foreground tracking-tighter font-mono">
          {value}
        </div>
        {icon && (
          <div className="opacity-30 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
        )}
      </div>
      {subValue && (
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
          {subValue}
        </p>
      )}
    </div>
  </div>
))
DossierCard.displayName = "DossierCard"

const DossierField = ({ 
  label, 
  value, 
  mono = false 
}: { 
  label: string; 
  value: React.ReactNode; 
  mono?: boolean 
}) => (
  <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0 group">
    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
      {label}
    </span>
    <span className={cn(
      "text-[11px] font-black uppercase text-right",
      mono ? "font-mono tracking-tighter" : "tracking-tight"
    )}>
      {value || "NOT_DECLARED"}
    </span>
  </div>
)

const DossierFooter = ({ slug }: { slug: string }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 pb-16 border-t border-border mt-12">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2.5">
        <History className="h-3.5 w-3.5 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Last Synchronization</span>
          <span className="text-[10px] font-mono font-black">{new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</span>
        </div>
      </div>
      <div className="flex items-center gap-2.5 border-l border-border pl-8">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Data Pedigree</span>
          <span className="text-[10px] font-mono font-black text-success uppercase">Validated_SD_V5</span>
        </div>
      </div>
    </div>
    <div className="px-4 py-2 bg-foreground text-background rounded-sm flex items-center gap-4">
      <p className="text-[9px] font-mono font-bold tracking-[0.4em] uppercase whitespace-nowrap">
        END_OF_DOSSIER_{slug.toUpperCase()}
      </p>
      <div className="h-3 w-[1px] bg-background/20" />
      <Database className="h-3 w-3 opacity-50" />
    </div>
  </div>
)

export {
  Dossier,
  DossierHeader,
  DossierSection,
  DossierGrid,
  DossierCard,
  DossierField,
  DossierFooter
}
