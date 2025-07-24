import fs from 'fs';
import path from 'path';

export function getMarkdownContent(filePath: string): string {
  try {
    const fullPath = path.join(process.cwd(), 'content', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading markdown file: ${filePath}`, error);
    return '# Content not found\n\nThe requested content could not be loaded.';
  }
}

export interface MarkdownProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownProps) {
  // Simple markdown-to-HTML conversion for demo purposes
  // In a real app, you'd use a proper markdown parser like 'marked' or 'remark'
  const html = content
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-100">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-3 mt-6 text-gray-700 dark:text-gray-200">$1</h3>')
    .replace(/^\*\*(.*)\*\*/gim, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
    .replace(/^\* (.*$)/gim, '<li class="mb-2 text-gray-600 dark:text-gray-300">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="mb-2 text-gray-600 dark:text-gray-300">$1</li>')
    .replace(/^---$/gim, '<hr class="my-8 border-gray-300 dark:border-gray-600">')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-600 dark:text-gray-300">')
    .replace(/🎯|💰|🚀|📈/g, '<span class="text-2xl mr-2">$&</span>');

  return (
    <div 
      className="prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: `<p class="mb-4 text-gray-600 dark:text-gray-300">${html}</p>` }}
    />
  );
}