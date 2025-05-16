import React, { useContext, useState } from "react";

interface ITooltipContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const TooltipContext = React.createContext<ITooltipContextProps | null>(null);

interface ITooltipProps {
  children: React.ReactNode;
}
function Tooltip({ children }: ITooltipProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative group">{children}</div>
    </TooltipContext.Provider>
  );
}

interface ITooltipTriggerProps {
  shouldTrigger?: boolean;
  children: React.ReactNode;
}
function TooltipTrigger({ shouldTrigger = true, children }: ITooltipTriggerProps) {
  const context = useContext<ITooltipContextProps | null>(TooltipContext);

  if (!context) {
    throw new Error("TooltipTrigger must be used within a Tooltip");
  }

  if (!shouldTrigger) return children;

  const { setOpen } = context;

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
    </div>
  );
}
Tooltip.Trigger = TooltipTrigger;

interface ITooltipContentProps {
  content: string;
}
function TooltipContent({ content }: ITooltipContentProps) {
  const context = useContext<ITooltipContextProps | null>(TooltipContext);

  if (!context) {
    throw new Error("TooltipContent must be used within a Tooltip");
  }

  const { open } = context;

  if (!open) return null;

  return (
    <div className="absolute left-1/2 z-10 -translate-x-1/2 bottom-full mb-3 hidden group-hover:block w-max bg-neutral-800 text-white text-xs font-normal rounded-lg px-2 py-1">
      {content}

      <div className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-800" />
    </div>
  );
}
Tooltip.Content = TooltipContent;

export default Tooltip;
