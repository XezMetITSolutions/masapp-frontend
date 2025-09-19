import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();

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