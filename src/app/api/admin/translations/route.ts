import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const translationsPath = join(process.cwd(), 'src', 'data', 'translations.ts');
    const translationsContent = readFileSync(translationsPath, 'utf8');
    
    // Extract translations object from the file
    const translationsRegex = /export const translations: { \[key: string\]: { en: string; de: string; tr: string } } = ({[\s\S]*?});/;
    const match = translationsContent.match(translationsRegex);
    
    if (!match) {
      return NextResponse.json({ error: 'Translations not found' }, { status: 404 });
    }
    
    const translationsObject = eval(`(${match[1]})`);
    
    return NextResponse.json({ translations: translationsObject });
  } catch (error) {
    console.error('Error reading translations:', error);
    return NextResponse.json({ error: 'Failed to read translations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { translations } = await request.json();
    
    if (!translations) {
      return NextResponse.json({ error: 'Translations data required' }, { status: 400 });
    }
    
    // Generate new translations.ts content
    let content = '// Pre-defined translations for static export\n';
    content += 'export const translations: { [key: string]: { en: string; de: string; tr: string } } = {\n';
    
    const translationKeys = Object.keys(translations);
    translationKeys.forEach((key, index) => {
      const translation = translations[key];
      content += `  '${key}': {\n`;
      content += `    en: '${translation.en.replace(/'/g, "\\'")}',\n`;
      content += `    de: '${translation.de.replace(/'/g, "\\'")}',\n`;
      content += `    tr: '${translation.tr.replace(/'/g, "\\'")}'\n`;
      content += `  }${index < translationKeys.length - 1 ? ',' : ''}\n`;
    });
    
    content += '};\n';
    
    // Write to translations.ts file
    const translationsPath = join(process.cwd(), 'src', 'data', 'translations.ts');
    writeFileSync(translationsPath, content, 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Translations updated successfully',
      count: translationKeys.length 
    });
  } catch (error) {
    console.error('Error updating translations:', error);
    return NextResponse.json({ error: 'Failed to update translations' }, { status: 500 });
  }
}
