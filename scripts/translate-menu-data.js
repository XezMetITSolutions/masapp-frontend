const deepl = require('deepl-node');
const fs = require('fs');
const path = require('path');

// DeepL API key
const DEEPL_API_KEY = '57d297fb-b5e5-492d-bebc-6cca1dfb8fa6:fx';
const translator = new deepl.Translator(DEEPL_API_KEY);

// Menu data path
const menuDataPath = path.join(__dirname, '../src/data/menu-data.ts');
const menuDataContent = fs.readFileSync(menuDataPath, 'utf8');

// Parse menu data
const menuDataMatch = menuDataContent.match(/export const menuData: MenuItem\[\] = \[([\s\S]*?)\];/);
if (!menuDataMatch) {
  console.error('Menu data not found!');
  process.exit(1);
}

// Extract menu items
const itemsText = menuDataMatch[1];
const items = [];

// Simple parser for menu items
const itemMatches = itemsText.match(/\{[^}]*\}/g);
if (itemMatches) {
  itemMatches.forEach(itemText => {
    try {
      // Extract basic properties
      const idMatch = itemText.match(/id:\s*'([^']+)'/);
      const enNameMatch = itemText.match(/en:\s*'([^']+)'/);
      const trNameMatch = itemText.match(/tr:\s*'([^']+)'/);
      const enDescMatch = itemText.match(/en:\s*'([^']+)',[\s\S]*?tr:\s*'([^']+)'/);
      
      if (idMatch && enNameMatch && trNameMatch) {
        items.push({
          id: idMatch[1],
          nameEn: enNameMatch[1],
          nameTr: trNameMatch[1],
          descriptionEn: enDescMatch ? enDescMatch[1] : '',
          descriptionTr: enDescMatch ? enDescMatch[2] : ''
        });
      }
    } catch (error) {
      console.log('Skipping item due to parse error:', error.message);
    }
  });
}

console.log(`Found ${items.length} menu items to translate\n`);

async function translateMenuItems() {
  const translations = [];
  
  for (const item of items) {
    try {
      console.log(`Translating: "${item.nameTr}"`);
      
      // Translate name
      const nameDeResult = await translator.translateText(item.nameTr, 'tr', 'de');
      const nameDe = nameDeResult.text;
      
      // Translate description if available
      let descriptionDe = '';
      if (item.descriptionTr) {
        const descDeResult = await translator.translateText(item.descriptionTr, 'tr', 'de');
        descriptionDe = descDeResult.text;
      }
      
      translations.push({
        id: item.id,
        nameDe,
        descriptionDe
      });
      
      console.log(`✓ Name DE: "${nameDe}"`);
      if (descriptionDe) {
        console.log(`✓ Desc DE: "${descriptionDe}"`);
      }
      console.log('---');
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error translating "${item.nameTr}":`, error.message);
      // Use English as fallback
      translations.push({
        id: item.id,
        nameDe: item.nameEn,
        descriptionDe: item.descriptionEn
      });
    }
  }
  
  return translations;
}

async function updateMenuData(translations) {
  let updatedContent = menuDataContent;
  
  // Add German translations to each item
  translations.forEach(translation => {
    // Update name object
    const namePattern = new RegExp(`(name:\\s*{[\\s\\S]*?en:\\s*'[^']*'[\\s\\S]*?tr:\\s*'[^']*')([\\s\\S]*?})`, 'g');
    updatedContent = updatedContent.replace(namePattern, (match, before, after) => {
      if (match.includes(translation.id)) {
        return before + `,\n      de: '${translation.nameDe}'` + after;
      }
      return match;
    });
    
    // Update description object
    const descPattern = new RegExp(`(description:\\s*{[\\s\\S]*?en:\\s*'[^']*'[\\s\\S]*?tr:\\s*'[^']*')([\\s\\S]*?})`, 'g');
    updatedContent = updatedContent.replace(descPattern, (match, before, after) => {
      if (match.includes(translation.id) && translation.descriptionDe) {
        return before + `,\n      de: '${translation.descriptionDe}'` + after;
      }
      return match;
    });
  });
  
  // Write updated content
  fs.writeFileSync(menuDataPath, updatedContent);
  console.log('✓ Menu data updated with German translations!');
}

async function main() {
  try {
    console.log('Starting menu data translation...');
    const translations = await translateMenuItems();
    await updateMenuData(translations);
    console.log('Translation completed successfully!');
  } catch (error) {
    console.error('Translation failed:', error);
    process.exit(1);
  }
}

main();


