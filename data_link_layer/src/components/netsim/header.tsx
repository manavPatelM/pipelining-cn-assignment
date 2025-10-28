import { Wifi } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Wifi className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold text-lg">NetSim</span>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <p className="text-muted-foreground">Data Link Layer Simulator</p>
        </nav>
      </div>
    </header>
  );
}
