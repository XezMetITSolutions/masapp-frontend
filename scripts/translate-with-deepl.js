const deepl = require('deepl-node');
const fs = require('fs');
const path = require('path');

// DeepL API key
const DEEPL_API_KEY = '57d297fb-b5e5-492d-bebc-6cca1dfb8fa6:fx';
const translator = new deepl.Translator(DEEPL_API_KEY);

// Mevcut çevirileri oku
const translationsPath = path.join(__dirname, '../src/data/translations.ts');
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

// Çeviri objesini extract et
const translationsMatch = translationsContent.match(/export const translations: \{ \[key: string\]: \{ en: string; de: string; tr: string \} \} = \{([\s\S]*?)\};/);
if (!translationsMatch) {
  console.error('Translations object not found!');
  process.exit(1);
}

// Türkçe metinleri extract et
const turkishTexts = [];
const translationEntries = translationsMatch[1];

// Regex ile Türkçe metinleri bul
const textMatches = translationEntries.match(/'([^']+)': \{[\s\S]*?\}/g);
if (textMatches) {
  textMatches.forEach(match => {
    const textMatch = match.match(/'([^']+)'/);
    if (textMatch) {
      turkishTexts.push(textMatch[1]);
    }
  });
}

console.log(`Found ${turkishTexts.length} Turkish texts to translate`);

async function translateTexts() {
  const translatedTexts = {};
  
  for (const text of turkishTexts) {
    try {
      console.log(`Translating: "${text}"`);
      
      // İngilizce çeviri
      const enResult = await translator.translateText(text, 'tr', 'en-US');
      const enTranslation = enResult.text;
      
      // Almanca çeviri
      const deResult = await translator.translateText(text, 'tr', 'de');
      const deTranslation = deResult.text;
      
      translatedTexts[text] = {
        en: enTranslation,
        de: deTranslation,
        tr: text
      };
      
      console.log(`✓ EN: "${enTranslation}"`);
      console.log(`✓ DE: "${deTranslation}"`);
      console.log('---');
      
      // Rate limiting için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error translating "${text}":`, error.message);
      // Hata durumunda orijinal metni kullan
      translatedTexts[text] = {
        en: text,
        de: text,
        tr: text
      };
    }
  }
  
  return translatedTexts;
}

async function updateTranslationsFile(translatedTexts) {
  // Yeni çevirileri formatla
  let newTranslationsContent = '// Pre-defined translations for static export\n';
  newTranslationsContent += 'export const translations: { [key: string]: { en: string; de: string; tr: string } } = {\n';
  
  Object.entries(translatedTexts).forEach(([key, translations], index) => {
    newTranslationsContent += `  '${key}': {\n`;
    newTranslationsContent += `    en: '${translations.en.replace(/'/g, "\\'")}',\n`;
    newTranslationsContent += `    de: '${translations.de.replace(/'/g, "\\'")}',\n`;
    newTranslationsContent += `    tr: '${translations.tr.replace(/'/g, "\\'")}'\n`;
    newTranslationsContent += `  }${index < Object.keys(translatedTexts).length - 1 ? ',' : ''}\n`;
  });
  
  newTranslationsContent += '};\n';
  
  // Dosyayı güncelle
  const updatedContent = translationsContent.replace(
    /\/\/ Pre-defined translations for static export[\s\S]*?export const translations: \{ \[key: string\]: \{ en: string; de: string; tr: string \} \} = \{[\s\S]*?\};/,
    newTranslationsContent
  );
  
  fs.writeFileSync(translationsPath, updatedContent);
  console.log('✓ Translations file updated successfully!');
}

async function main() {
  try {
    console.log('Starting DeepL translation...');
    const translatedTexts = await translateTexts();
    await updateTranslationsFile(translatedTexts);
    console.log('Translation completed successfully!');
  } catch (error) {
    console.error('Translation failed:', error);
    process.exit(1);
  }
}

main();

