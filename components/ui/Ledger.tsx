import * as React from "react"
import { cn } from "@/lib/utils"
import { Database, Filter as FilterIcon, LayoutGrid, List } from "lucide-react"

const Ledger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-6 animate-in fade-in duration-700", className)}
    {...props}
  />
))
Ledger.displayName = "Ledger"

const LedgerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    subtitle?: string
    badge?: React.ReactNode
    icon?: React.ReactNode
    stats?: { label: string; value: string | number }[]
  }
>(({ className, title, subtitle, badge, icon, stats, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8",
      className
    )}
    {...props}
  >
    <div className="space-y-2">
      {badge && (
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {icon} {badge}
        </div>
      )}
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
        {title.split(' ').map((word, i, arr) => (
          <React.Fragment key={i}>
            {i === arr.length - 1 ? (
              <span className="text-muted-foreground font-light">{word}</span>
            ) : (
              word + ' '
            )}
          </React.Fragment>
        ))}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </div>
    {stats && stats.length > 0 && (
      <div className="flex gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="px-4 py-3 bg-muted/30 border border-border rounded-md min-w-[140px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-black font-mono tracking-tighter text-foreground">
              {typeof stat.value === 'number' ? stat.value.toLocaleString("en-IN") : stat.value}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
))
LedgerHeader.displayName = "LedgerHeader"

const LedgerControls = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-muted/30 p-4 rounded-md border border-border",
      className
    )}
    {...props}
  />
))
LedgerControls.displayName = "LedgerControls"

const LedgerFilterGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { label?: string }
>(({ className, label, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-wrap gap-2 items-center", className)} {...props}>
    {label && (
      <div className="flex items-center gap-2 mr-2 border-r border-border pr-4">
        <FilterIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
    )}
    {children}
  </div>
))
LedgerFilterGroup.displayName = "LedgerFilterGroup"

const LedgerViewToggle = ({ 
  view, 
  onViewChange 
}: { 
  view: 'grid' | 'table', 
  onViewChange: (view: 'grid' | 'table') => void 
}) => (
  <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-sm">
    <button
      onClick={() => onViewChange('grid')}
      className={cn(
        "p-1.5 rounded-sm transition-all",
        view === 'grid' ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <LayoutGrid className="h-3.5 w-3.5" />
    </button>
    <button
      onClick={() => onViewChange('table')}
      className={cn(
        "p-1.5 rounded-sm transition-all",
        view === 'table' ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <List className="h-3.5 w-3.5" />
    </button>
  </div>
)

const LedgerSort = ({
  options,
  value,
  onChange
}: {
  options: { label: string; value: string }[],
  value: string,
  onChange: (value: string) => void
}) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Sort By</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-background border border-border rounded-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 focus:ring-1 focus:ring-primary outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
)

const LedgerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-h-[400px]", className)} {...props} />
))
LedgerContent.displayName = "LedgerContent"

const LedgerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    page?: number
    total?: number
    label?: string
  }
>(({ className, page, total, label, children, ...props }, ref) => (
  <div ref={ref} className={cn("pt-8 border-t border-border", className)} {...props}>
    {children}
    {(page !== undefined || total !== undefined) && (
      <p className="text-center text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mt-8 opacity-50">
        {label || "End of Ledger"} 
        {page !== undefined && ` Page ${page}`} 
        {total !== undefined && ` // ${total.toLocaleString("en-IN")} Total Records`}
      </p>
    )}
    <div className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-border/30">
      <div className="flex items-center gap-2 text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
        <Database className="h-2.5 w-2.5" />
        <span>Status: Verified Ledger</span>
      </div>
      <div className="flex items-center gap-2 text-[8px] font-mono text-muted-foreground uppercase tracking-widest border-l border-border/30 pl-6">
        <span>Protocol: SD-REG-V2</span>
      </div>
    </div>
  </div>
))
LedgerFooter.displayName = "LedgerFooter"

export {
  Ledger,
  LedgerHeader,
  LedgerControls,
  LedgerFilterGroup,
  LedgerViewToggle,
  LedgerSort,
  LedgerContent,
  LedgerFooter,
}
