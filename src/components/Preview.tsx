
import { useEffect, useState } from "react";
import { splitMarkdownIntoSlides, markdownToHtml } from "@/utils/markdownUtils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PreviewProps {
  markdown: string;
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
}

const Preview = ({ markdown, currentSlideIndex, onSlideChange }: PreviewProps) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const newSlides = splitMarkdownIntoSlides(markdown);
    setSlides(newSlides);
  }, [markdown]);

  useEffect(() => {
    if (slides.length > 0) {
      const currentSlide = slides[currentSlideIndex];
      const html = markdownToHtml(currentSlide);
      setHtmlContent(html);
    }
  }, [slides, currentSlideIndex]);

  const navigateSlide = (direction: "prev" | "next") => {
    if (direction === "prev" && currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
    } else if (direction === "next" && currentSlideIndex < slides.length - 1) {
      onSlideChange(currentSlideIndex + 1);
    }
  };

  return (
    <div className="h-full flex flex-col border rounded-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Preview</h3>
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

      <div 
        className="flex-1 p-6 overflow-y-auto markdown-preview"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default Preview;
