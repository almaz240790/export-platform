import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, value, onValueChange, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2", className)}
      {...props}
    />
  )
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, active, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const isActive = active || (context?.value === value);
    
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive
            ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
            : "hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white",
          className
        )}
        onClick={() => context?.onValueChange?.(value)}
        {...props}
      />
    );
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (value !== context?.value) return null;
    
    return (
      <div
        ref={ref}
        className={cn("mt-2 focus-visible:outline-none", className)}
        {...props}
      />
    );
  }
)
TabsContent.displayName = "TabsContent"

// Create a context for tabs
interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

interface TabsProviderProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const TabsProvider: React.FC<TabsProviderProps> = ({ children, value, onValueChange }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      {children}
    </TabsContext.Provider>
  );
};

// Wrap the Tabs component with the provider
const TabsWithProvider = React.forwardRef<HTMLDivElement, TabsProps>(
  (props, ref) => {
    const { value, onValueChange, ...rest } = props;
    return (
      <TabsProvider value={value} onValueChange={onValueChange}>
        <Tabs ref={ref} {...rest} />
      </TabsProvider>
    );
  }
);
TabsWithProvider.displayName = "Tabs";

export { TabsWithProvider as Tabs, TabsList, TabsTrigger, TabsContent } 