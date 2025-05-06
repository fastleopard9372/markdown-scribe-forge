
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import ValidationPanel from "@/components/ValidationPanel";
import { getDefaultRules, ValidationRule } from "@/utils/validationUtils";
import { exportMarkdown, exportTypeScript } from "@/utils/conversionUtils";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [markdown, setMarkdown] = useState("");
  const [fileName, setFileName] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [hasContent, setHasContent] = useState(false);

  // Initialize validation rules
  useEffect(() => {
    const savedRules = localStorage.getItem('validationRules');
    if (savedRules) {
      setValidationRules(JSON.parse(savedRules));
    } else {
      const defaultRules = getDefaultRules();
      setValidationRules(defaultRules);
      localStorage.setItem('validationRules', JSON.stringify(defaultRules));
    }
  }, []);

  const handleFileLoaded = (content: string, name: string) => {
    setMarkdown(content);
    setFileName(name);
    setHasContent(true);
    setCurrentSlideIndex(0);
    
    toast({
      title: "File loaded successfully",
      description: `Loaded ${name} with ${content.split("---").length} slides`,
    });
  };

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  const handleExportMarkdown = () => {
    if (!hasContent) {
      toast({
        title: "No content to export",
        description: "Please upload or create content first.",
        variant: "destructive",
      });
      return;
    }
    
    exportMarkdown(markdown, fileName || "lesson.md");
    toast({
      title: "Markdown exported",
      description: "Your file has been downloaded",
    });
  };

  const handleExportTypeScript = () => {
    if (!hasContent) {
      toast({
        title: "No content to export",
        description: "Please upload or create content first.",
        variant: "destructive",
      });
      return;
    }
    
    exportTypeScript(markdown, fileName || "lesson.md");
    toast({
      title: "TypeScript exported",
      description: "Your TypeScript file has been downloaded",
    });
  };

  const handleRulesChange = (newRules: ValidationRule[]) => {
    setValidationRules(newRules);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onExportMarkdown={handleExportMarkdown} 
        onExportTypeScript={handleExportTypeScript} 
      />
      
      <main className="flex-1 p-4 md:p-6">
        {!hasContent ? (
          <div className="max-w-lg mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4 text-center">
              Welcome to Markdown Scribe Forge
            </h2>
            <p className="text-gray-500 mb-6 text-center">
              Upload a markdown file to get started with your lesson content
            </p>
            <FileUpload onFileLoaded={handleFileLoaded} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-6">
              <Editor 
                markdown={markdown} 
                validationRules={validationRules} 
                onMarkdownChange={handleMarkdownChange}
              />
              <ValidationPanel 
                markdown={markdown} 
                validationRules={validationRules}
                onNavigateToSlide={setCurrentSlideIndex}
              />
            </div>
            <div>
              <Preview 
                markdown={markdown} 
                currentSlideIndex={currentSlideIndex}
                onSlideChange={setCurrentSlideIndex}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
