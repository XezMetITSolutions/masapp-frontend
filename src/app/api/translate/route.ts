import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let text = '';
  try {
    const body = await request.json();
    text = body.text || '';
    const targetLanguage = body.targetLanguage || 'en';

    // Demo: Simple translation simulation
    const translatedText = `${text} [translated to ${targetLanguage}]`;

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      translatedText: text, 
      error: 'Translation failed' 
    }, { status: 200 });
  }
}