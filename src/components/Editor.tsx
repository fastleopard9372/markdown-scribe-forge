
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { validateSlide } from "@/utils/validationUtils";
import { splitMarkdownIntoSlides } from "@/utils/markdownUtils";
import type { ValidationRule } from "@/utils/validationUtils";

interface EditorProps {
  markdown: string;
  validationRules: ValidationRule[];
  onMarkdownChange: (newMarkdown: string) => void;
}

const Editor = ({ markdown, validationRules, onMarkdownChange }: EditorProps) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editingSlide, setEditingSlide] = useState("");

  // Initialize slides when markdown changes
  useEffect(() => {
    const newSlides = splitMarkdownIntoSlides(markdown);
    setSlides(newSlides);
    if (newSlides.length > 0) {
      setEditingSlide(newSlides[currentSlideIndex]);
    }
  }, [markdown]);

  // Update the current slide content when navigating
  useEffect(() => {
    if (slides.length > 0) {
      setEditingSlide(slides[currentSlideIndex]);
    }
  }, [currentSlideIndex, slides]);

  const handleSlideChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSlideContent = event.target.value;
    setEditingSlide(newSlideContent);
    
    // Update the slides array
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = newSlideContent;
    setSlides(newSlides);
    
    // Reconstruct the full markdown
    const newMarkdown = newSlides.join("\n---\n");
    onMarkdownChange(newMarkdown);
  };

  const navigateSlide = (direction: "prev" | "next") => {
    if (direction === "prev" && currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (direction === "next" && currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Validate current slide
  const validationResult = validateSlide(
    editingSlide, 
    validationRules, 
    currentSlideIndex
  );

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="editor" className="w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateSlide("prev")}
              disabled={currentSlideIndex === 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateSlide("next")}
              disabled={currentSlideIndex === slides.length - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="editor" className="flex-1 flex flex-col">
          <textarea
            className="w-full h-full p-4 font-mono text-sm border rounded-md resize-none markdown-editor"
            value={editingSlide}
            onChange={handleSlideChange}
            placeholder="Enter your markdown content here..."
          />
        </TabsContent>

        <TabsContent value="validation" className="flex-1">
          <div className="border rounded-md p-4 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
            
            {validationResult.valid ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-md">
                Slide passes all validation checks.
              </div>
            ) : (
              <div>
                <div className="bg-orange-50 text-orange-700 p-3 rounded-md mb-4">
                  Found {validationResult.errors.length} validation issue(s).
                </div>
                
                <ul className="space-y-2">
                  {validationResult.errors.map((error, index) => (
                    <li 
                      key={index} 
                      className={`p-3 rounded-md ${error.rule.errorClass}`}
                    >
                      <span className="font-semibold">{error.rule.name}:</span> {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Editor;
