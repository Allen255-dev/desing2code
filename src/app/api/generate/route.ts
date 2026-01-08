import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, language, description } = await request.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Use gemini-flash-latest which acts as an alias for the latest stable 1.5 Flash
    // Using v1beta as confirmed in diagnostics
    const model = genAI.getGenerativeModel(
      { model: "gemini-flash-latest" },
      { apiVersion: 'v1beta' }
    );

    // Handle base64 image data
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.includes(',') ? imageBase64.split(',')[0].split(':')[1].split(';')[0] : 'image/png';

    const prompt = `You are an expert frontend developer. Generate clean, production-ready ${language} code based on the provided design. Use Tailwind CSS for styling. 
    
    The target language/framework is: ${language}
    Description of the design: ${description}
    
    Please provide only the requested code block.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const generatedCode = response.text() || '';

    // Clean up code markers if present
    const cleanedCode = generatedCode.replace(/^```[\w]*\n/, '').replace(/\n```$/, '');

    return NextResponse.json({ code: cleanedCode });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate code' },
      { status: 500 }
    );
  }
}