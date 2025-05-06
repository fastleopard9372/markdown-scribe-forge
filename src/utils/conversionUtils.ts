
import { splitMarkdownIntoSlides } from './markdownUtils';

// Convert markdown content to TypeScript
export const convertToTypeScript = (
  markdown: string, 
  fileName: string
): string => {
  const slides = splitMarkdownIntoSlides(markdown);
  
  // Generate a safe title from the filename
  const fileNameWithoutExt = fileName.replace(/\.(md|markdown)$/, '');
  const titleCase = fileNameWithoutExt
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  let ts = `// Generated from ${fileName}\n\n`;
  ts += `export const lesson = {\n`;
  ts += `  id: "${Date.now()}",\n`;
  ts += `  title: "${titleCase}",\n`;
  ts += `  description: "Auto-generated from Markdown content",\n`;
  ts += `  slides: [\n`;
  
  slides.forEach((slide, index) => {
    // Extract a title from the slide if present
    const titleMatch = slide.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : `Slide ${index + 1}`;
    
    ts += `    {\n`;
    ts += `      id: "${index + 1}",\n`;
    ts += `      title: "${title.replace(/"/g, '\\"')}",\n`;
    ts += `      content: \`${slide.replace(/`/g, '\\`')}\`,\n`;
    ts += `    },\n`;
  });
  
  ts += `  ],\n`;
  ts += `};\n`;
  ts += `\nexport default lesson;\n`;
  
  return ts;
};

// Download content as a file
export const downloadFile = (
  content: string, 
  fileName: string, 
  contentType: string
): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export markdown content
export const exportMarkdown = (content: string, fileName: string): void => {
  const saveFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
  downloadFile(content, saveFileName, 'text/markdown');
};

// Export TypeScript content
export const exportTypeScript = (content: string, fileName: string): void => {
  const baseName = fileName.replace(/\.(md|markdown)$/, '');
  const saveFileName = `${baseName}.ts`;
  const tsContent = convertToTypeScript(content, fileName);
  downloadFile(tsContent, saveFileName, 'application/typescript');
};
