import { NextRequest, NextResponse } from 'next/server';
import { getExchangeRates } from '@/lib/exchangeRateService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const base = searchParams.get('base') || 'TRY';
    
    const data = await getExchangeRates();
    
    const response = {
      success: true,
      source: data.source,
      dataQuality: data.dataQuality,
      reliability: data.reliability,
      base: base,
      timestamp: data.timestamp,
      lastUpdate: data.lastUpdate,
      rates: data.rates,
    };
    
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (error) {
    console.error('API error:', error);
    return new NextResponse(JSON.stringify({ success: false, error: 'API error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}
