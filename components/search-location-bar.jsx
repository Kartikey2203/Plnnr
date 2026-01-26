import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchLocationBar() {
  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/10 w-full max-w-md">
       <div className="flex items-center gap-2 flex-1 border-r border-white/10 pr-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          className="bg-transparent border-none h-auto p-0 focus-visible:ring-0 placeholder:text-muted-foreground text-sm"
          placeholder="Search events..." 
        />
      </div>
      <div className="flex items-center gap-2 pl-2">
        <MapPin className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium">Bangalore</span>
      </div>
    </div>
  );
}
