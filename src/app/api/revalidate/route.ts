import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Expected secret token from environment variable or fallback key
    const expectedSecret = process.env.WEBHOOK_SECRET || 'otempoaqui-secret-key';

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Token secreto inválido.' }, { status: 401 });
    }

    // Revalidate all pages across the app layout (home, city pages, post details)
    revalidatePath('/', 'layout');

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'Revalidação de cache executada com sucesso!'
    });
  } catch (err: any) {
    return NextResponse.json({ message: 'Erro ao processar webhook.', error: err.message }, { status: 500 });
  }
}

// Allow GET requests as well for easy browser/cron testing
export async function GET(request: NextRequest) {
  return POST(request);
}
