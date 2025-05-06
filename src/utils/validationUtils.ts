
export interface ValidationRule {
  id: string;
  name: string;
  type: 'length' | 'format' | 'structure';
  description: string;
  validator: (content: string) => boolean;
  errorClass: string;
  active: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  slideIndex: number;
  rule: ValidationRule;
  message: string;
  position?: {
    start: number;
    end: number;
  };
}

// Default validation rules
export const getDefaultRules = (): ValidationRule[] => [
  {
    id: 'slide-length',
    name: 'Slide Length',
    type: 'length',
    description: 'Slides should not exceed 1000 characters',
    validator: (content: string) => content.length <= 1000,
    errorClass: 'error-length',
    active: true
  },
  {
    id: 'heading-format',
    name: 'Heading Format',
    type: 'format',
    description: 'Headings should use title case',
    validator: (content: string) => {
      const headingRegex = /^#{1,6} (.+)$/gm;
      const headings = Array.from(content.matchAll(headingRegex));
      
      for (const heading of headings) {
        const headingText = heading[1];
        // Simple check for title case: first letter of each word is uppercase
        const words = headingText.split(' ');
        for (const word of words) {
          // Skip small words (articles, conjunctions)
          if (word.length <= 3 && !words[0]) continue;
          if (word.length > 0 && word[0] !== word[0].toUpperCase()) {
            return false;
          }
        }
      }
      
      return true;
    },
    errorClass: 'error-format',
    active: true
  },
  {
    id: 'paragraph-length',
    name: 'Paragraph Length',
    type: 'length',
    description: 'Paragraphs should not exceed 200 characters',
    validator: (content: string) => {
      const paragraphRegex = /^(?!#|```|>|\s*[-*+]|\s*\d+\.)[^\n]+$/gm;
      const paragraphs = Array.from(content.matchAll(paragraphRegex));
      
      for (const paragraph of paragraphs) {
        if (paragraph[0].length > 200) {
          return false;
        }
      }
      
      return true;
    },
    errorClass: 'error-length',
    active: true
  },
  {
    id: 'slide-structure',
    name: 'Slide Structure',
    type: 'structure',
    description: 'Each slide should have a title (h1 or h2)',
    validator: (content: string) => {
      return /^#{1,2} .+$/m.test(content);
    },
    errorClass: 'error-structure',
    active: true
  }
];

// Validate slide content against rules
export const validateSlide = (
  slideContent: string, 
  rules: ValidationRule[],
  slideIndex: number
): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: []
  };
  
  const activeRules = rules.filter(rule => rule.active);
  
  for (const rule of activeRules) {
    if (!rule.validator(slideContent)) {
      result.valid = false;
      result.errors.push({
        slideIndex,
        rule,
        message: rule.description
      });
    }
  }
  
  return result;
};

// Validate entire document
export const validateDocument = (
  slides: string[],
  rules: ValidationRule[]
): ValidationResult[] => {
  return slides.map((slide, index) => 
    validateSlide(slide, rules, index)
  );
};
