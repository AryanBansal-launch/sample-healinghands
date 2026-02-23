import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch(
      'https://stag-azure-na-app.csnonprod.com/launch-api/manage/deploy/69988d67568d29753cfce086',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.text();

    return NextResponse.json({
      success: true,
      status: response.status,
      response: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
