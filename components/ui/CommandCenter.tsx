import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  Activity, 
  ShieldCheck, 
  Database, 
  Terminal,
  BarChart3,
  Cpu
} from "lucide-react"

const CommandCenter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className="space-y-8 animate-in fade-in duration-1000"
    {...props}
  />
))
CommandCenter.displayName = "CommandCenter"

const CommandCenterHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    subtitle?: string
    systemStatus?: string
  }
>(({ className, title, subtitle, systemStatus, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-md overflow-hidden bg-foreground text-background border border-border p-8 lg:p-12",
      className
    )}
    {...props}
  >
    <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[120px] rounded-full" />
    <div className="relative z-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-background/10 border border-background/20 text-[10px] font-bold uppercase tracking-[0.2em] text-background/80">
          <Activity className="h-3 w-3 text-success" /> 
          System Synchronized: {new Date().toISOString().split('T')[0]}
        </div>
        {systemStatus && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-[10px] font-mono font-bold text-success uppercase tracking-widest">
              {systemStatus}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
          {title.split(' ').map((word, i, arr) => (
            <React.Fragment key={i}>
              {i === arr.length - 1 ? (
                <span className="text-primary">{word}</span>
              ) : (
                word + ' '
              )}
            </React.Fragment>
          ))}
        </h1>
        {subtitle && (
          <p className="text-background/60 max-w-2xl text-sm font-medium leading-relaxed uppercase tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  </div>
))
CommandCenterHeader.displayName = "CommandCenterHeader"

const CommandCenterGrid = React.forwardRef<
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
      className={cn("grid gap-6", gridCols[cols], className)}
      {...props}
    />
  )
})
CommandCenterGrid.displayName = "CommandCenterGrid"

const TacticalMetric = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label: string
    value: string | number
    total?: string | number
    icon?: React.ReactNode
    trend?: string
  }
>(({ className, label, value, total, icon, trend, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 bg-background border border-border rounded-md group hover:border-primary/50 transition-all",
      className
    )}
    {...props}
  >
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      <div className="p-2 rounded-sm bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <div className="text-4xl font-black font-mono tracking-tighter text-foreground">
        {value}
        {total && <span className="text-xl text-muted-foreground font-light ml-1">/ {total}</span>}
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-3 w-3 text-success" />
        <span className="text-[10px] font-mono font-bold text-success uppercase tracking-widest">Verified Endpoint</span>
      </div>
    </div>
  </div>
))
TacticalMetric.displayName = "TacticalMetric"

const IntelligenceModule = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    subtitle?: string
    icon?: React.ReactNode
  }
>(({ className, title, subtitle, icon, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-background border border-border rounded-md overflow-hidden flex flex-col",
      className
    )}
    {...props}
  >
    <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
      <div>
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          {icon} {title}
        </h3>
        {subtitle && <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">{subtitle}</p>}
      </div>
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
))
IntelligenceModule.displayName = "IntelligenceModule"

const CommandCenterSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    subtitle?: string
    action?: { label: string; href: string }
  }
>(({ className, title, subtitle, action, children, ...props }, ref) => (
  <section ref={ref} className={cn("space-y-6 pt-12", className)} {...props}>
    <div className="flex items-end justify-between border-b border-border pb-4">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{subtitle}</p>
        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">{title}</h2>
      </div>
      {action && (
        <a 
          href={action.href} 
          className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1.5"
        >
          {action.label} <Activity className="h-3 w-3" />
        </a>
      )}
    </div>
    <div>
      {children}
    </div>
  </section>
))
CommandCenterSection.displayName = "CommandCenterSection"

const SystemTerminal = () => (
  <div className="p-6 bg-foreground text-background space-y-4 rounded-md font-mono text-[10px]">
    <div className="flex items-center justify-between border-b border-background/10 pb-2">
      <span className="flex items-center gap-2"><Terminal className="h-3 w-3" /> SYSTEM_LOG</span>
      <span className="text-primary">ONLINE</span>
    </div>
    <div className="space-y-1 opacity-80">
      <p className="flex justify-between"><span>{">"} INITIALIZING_CORE_MATRIX</span> <span className="text-success">[OK]</span></p>
      <p className="flex justify-between"><span>{">"} SYNCING_LOK_SABHA_RECORDS</span> <span className="text-success">[OK]</span></p>
      <p className="flex justify-between"><span>{">"} SYNCING_RAJYA_SABHA_RECORDS</span> <span className="text-success">[OK]</span></p>
      <p className="flex justify-between"><span>{">"} MAPPING_TERRITORIAL_UNITS</span> <span className="text-success">[OK]</span></p>
      <p className="flex justify-between"><span>{">"} VERIFYING_AFFIDAVIT_INTEGRITY</span> <span className="text-success">[OK]</span></p>
    </div>
    <div className="pt-2 border-t border-background/10 flex items-center gap-2">
      <Cpu className="h-3 w-3 text-primary" />
      <span className="font-bold tracking-[0.2em] uppercase">Processor: SD-CORE-V6</span>
    </div>
  </div>
)

export {
  CommandCenter,
  CommandCenterHeader,
  CommandCenterGrid,
  TacticalMetric,
  IntelligenceModule,
  CommandCenterSection,
  SystemTerminal
}
