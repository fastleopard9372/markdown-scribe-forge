
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import AdminPanel from "./AdminPanel";

interface HeaderProps {
  onExportMarkdown: () => void;
  onExportTypeScript: () => void;
}

const Header = ({ onExportMarkdown, onExportTypeScript }: HeaderProps) => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-primary">Markdown Scribe Forge</h1>
        <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">v1.0</span>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          onClick={onExportMarkdown}
          className="text-sm"
        >
          Export .md
        </Button>
        <Button 
          onClick={onExportTypeScript}
          className="text-sm"
        >
          Export .ts
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowAdminPanel(true)}
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </header>
  );
};

export default Header;
