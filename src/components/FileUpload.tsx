
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef } from "react";

interface FileUploadProps {
  onFileLoaded: (content: string, fileName: string) => void;
}

const FileUpload = ({ onFileLoaded }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoaded(content, file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
      <input
        type="file"
        accept=".md,.markdown"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      <Upload className="h-10 w-10 text-gray-400 mb-2" />
      
      <p className="mb-2 text-sm text-gray-500">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      
      <p className="text-xs text-gray-500">
        Markdown files only (.md, .markdown)
      </p>
      
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={() => fileInputRef.current?.click()}
      >
        Select File
      </Button>
    </div>
  );
};

export default FileUpload;
