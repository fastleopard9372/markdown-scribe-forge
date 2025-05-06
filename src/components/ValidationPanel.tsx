
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  validateDocument, 
  ValidationResult, 
  ValidationRule
} from "@/utils/validationUtils";
import { splitMarkdownIntoSlides } from "@/utils/markdownUtils";

interface ValidationPanelProps {
  markdown: string;
  validationRules: ValidationRule[];
  onNavigateToSlide: (index: number) => void;
}

const ValidationPanel = ({ 
  markdown, 
  validationRules,
  onNavigateToSlide
}: ValidationPanelProps) => {
  const slides = splitMarkdownIntoSlides(markdown);
  const results = validateDocument(slides, validationRules);
  
  const errorCount = results.reduce(
    (count, result) => count + result.errors.length, 
    0
  );
  
  const validSlideCount = results.filter(result => result.valid).length;
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Document Validation</h3>
          <div className="flex items-center space-x-2">
            <Badge variant={errorCount === 0 ? "default" : "destructive"}>
              {errorCount} {errorCount === 1 ? 'Error' : 'Errors'}
            </Badge>
            <Badge variant="outline">
              {validSlideCount}/{slides.length} Slides Valid
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-h-[200px] overflow-y-auto p-4">
        {results.map((result, slideIndex) => (
          <div 
            key={slideIndex} 
            className={`p-3 mb-2 rounded-md ${
              result.valid 
                ? 'bg-green-50 border border-green-100' 
                : 'bg-orange-50 border border-orange-100'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                Slide {slideIndex + 1}
              </span>
              <div className="flex space-x-2">
                {!result.valid && (
                  <Badge variant="outline" className="text-orange-700 bg-orange-50">
                    {result.errors.length} {result.errors.length === 1 ? 'Issue' : 'Issues'}
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => onNavigateToSlide(slideIndex)}
                >
                  View
                </Button>
              </div>
            </div>
            
            {!result.valid && (
              <ul className="list-disc pl-5 text-sm space-y-1">
                {result.errors.map((error, errorIndex) => (
                  <li key={errorIndex} className="text-sm">
                    <span className="font-medium">{error.rule.name}:</span> {error.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationPanel;
