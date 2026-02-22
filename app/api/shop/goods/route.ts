import { NextResponse } from 'next/server';

interface Product {
  id: string;
  category: 'favors' | 'appliances' | 'interior' | 'accessories';
  title: string;
  brand: string;
  thumbnailUrl: string;
  linkUrl: string;
  platform: 'COUPANG' | 'NAVER';
  benefit?: string;
  isRecommended?: boolean;
  originalPrice?: number;
  salePrice?: number;
}

const mockProducts: Product[] = [];

export async function GET() {
  return NextResponse.json(mockProducts);
}
