import { Wifi, WifiOff } from "lucide-react";
import { useSocket } from "../../hooks/useSocket";

export default function ConnectionStatus({ className = "" }) {
  const { isConnected } = useSocket();
  return (
    <div className={`flex items-center gap-1.5 text-xs ${isConnected ? "text-arena-accent" : "text-arena-muted"} ${className}`}>
      {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      <span>{isConnected ? "Live" : "Offline"}</span>
    </div>
  );
}
