
// Split markdown content into slides based on horizontal rules
export const splitMarkdownIntoSlides = (markdown: string): string[] => {
  const slideDelimiter = /^---+$/gm;
  const slides = markdown.split(slideDelimiter);
  
  // Filter out empty slides and trim whitespace
  return slides
    .map(slide => slide.trim())
    .filter(slide => slide.length > 0);
};

// Parse slide content to extract components (headings, paragraphs, etc.)
export const parseSlideComponents = (slideContent: string) => {
  const components = {
    title: '',
    headings: [] as string[],
    paragraphs: [] as string[],
    lists: [] as string[],
    codeBlocks: [] as string[]
  };

  // Extract title (h1)
  const titleMatch = slideContent.match(/^# (.+)$/m);
  if (titleMatch) {
    components.title = titleMatch[1].trim();
  }

  // Extract headings (h2, h3, etc.)
  const headingMatches = slideContent.matchAll(/^#{2,6} (.+)$/gm);
  for (const match of headingMatches) {
    components.headings.push(match[0].trim());
  }

  // Extract paragraphs
  const paragraphMatches = slideContent.matchAll(/^(?!#|```|>|\s*[-*+]|\s*\d+\.)[^\n]+$/gm);
  for (const match of paragraphMatches) {
    components.paragraphs.push(match[0].trim());
  }

  // Extract lists
  const listBlockRegex = /(?:^(?:\s*[-*+]|\s*\d+\.)[^\n]+$(?:\n(?:\s+[^\n]+$))*)+/gm;
  const listMatches = slideContent.matchAll(listBlockRegex);
  for (const match of listMatches) {
    components.lists.push(match[0].trim());
  }

  // Extract code blocks
  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeMatches = slideContent.matchAll(codeBlockRegex);
  for (const match of codeMatches) {
    components.codeBlocks.push(match[0].trim());
  }

  return components;
};

// Simple markdown to HTML conversion (basic implementation)
export const markdownToHtml = (markdown: string): string => {
  let html = markdown;
  
  // Convert headings
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  
  // Convert paragraphs
  html = html.replace(/^(?!<h[1-6]|<ul|<ol|<blockquote|<pre)[^\n]+$/gm, '<p>$&</p>');
  
  // Convert bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert lists
  // This is a simplified implementation, would need more sophisticated parsing for nested lists
  html = html.replace(/^(\s*)?- (.+)$/gm, '<ul><li>$2</li></ul>');
  html = html.replace(/^(\s*)?(\d+)\. (.+)$/gm, '<ol><li>$3</li></ol>');
  
  // Convert code blocks
  html = html.replace(/```(.+?)```/gs, '<pre><code>$1</code></pre>');
  
  // Convert inline code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  
  // Convert blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  return html;
};

// Convert markdown content to TypeScript format
export const markdownToTypeScript = (markdown: string, fileName: string): string => {
  const slides = splitMarkdownIntoSlides(markdown);
  
  let tsContent = `// Generated from ${fileName}\n\n`;
  tsContent += `export const lessonContent = {\n`;
  tsContent += `  title: "Untitled Lesson",\n`;
  tsContent += `  description: "Generated lesson content",\n`;
  tsContent += `  slides: [\n`;
  
  slides.forEach((slide, index) => {
    const slideComponents = parseSlideComponents(slide);
    
    tsContent += `    {\n`;
    tsContent += `      id: "${index + 1}",\n`;
    tsContent += `      title: "${slideComponents.title.replace(/"/g, '\\"')}",\n`;
    tsContent += `      content: \`${slide.replace(/`/g, '\\`')}\`,\n`;
    tsContent += `    },\n`;
  });
  
  tsContent += `  ],\n`;
  tsContent += `};\n`;
  
  return tsContent;
};
