import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  try {
    const { params: pathParams } = await params;
    const [type, ...rest] = pathParams || ['poster'];
    
    // Handle actor avatars
    if (type === 'actor') {
      const name = rest.join(' ') || 'Unknown Actor';
      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const colors = [
        '#E97451', // Lagos Orange
        '#FFD700', // Nollywood Gold
        '#10B981', // Success Green
        '#6366F1', // Primary
        '#EC4899', // Pink
        '#8B5CF6', // Purple
      ];
      const bgColor = colors[Math.abs(name.charCodeAt(0)) % colors.length];
      
      const svg = `
        <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="${bgColor}"/>
          <text x="150" y="165" font-family="Arial, sans-serif" font-size="100" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text>
        </svg>
      `;
      
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }
    
    // Handle movie posters
    if (type === 'movie') {
      const title = rest.join(' ') || 'Movie Title';
      const [widthStr, heightStr] = (pathParams[pathParams.length - 1] || '300x450').split('x');
      const width = parseInt(widthStr) || 300;
      const height = parseInt(heightStr) || 450;
      
      const genres = ['Drama', 'Comedy', 'Action', 'Romance', 'Thriller'];
      const genre = genres[Math.abs(title.charCodeAt(0)) % genres.length];
      
      const colors = [
        { bg: '#1a1a2e', accent: '#E97451' },
        { bg: '#0f3460', accent: '#FFD700' },
        { bg: '#16213e', accent: '#10B981' },
        { bg: '#22223b', accent: '#EC4899' },
        { bg: '#1b1b2f', accent: '#8B5CF6' },
      ];
      const colorScheme = colors[Math.abs(title.charCodeAt(0)) % colors.length];
      
      const svg = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:${colorScheme.bg};stop-opacity:1" />
              <stop offset="100%" style="stop-color:#000;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#grad)"/>
          <text x="${width/2}" y="${height/3}" font-family="Arial Black, sans-serif" font-size="${width/10}" font-weight="900" fill="${colorScheme.accent}" text-anchor="middle" dominant-baseline="middle">${title.toUpperCase()}</text>
          <text x="${width/2}" y="${height/2.5}" font-family="Arial, sans-serif" font-size="${width/20}" fill="white" text-anchor="middle" opacity="0.8">${genre}</text>
          <rect x="${width/4}" y="${height - 60}" width="${width/2}" height="2" fill="${colorScheme.accent}"/>
          <text x="${width/2}" y="${height - 30}" font-family="Arial, sans-serif" font-size="${width/25}" fill="white" text-anchor="middle" opacity="0.6">A NOLLYWOOD FILM</text>
        </svg>
      `;
      
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }
    
    // Default placeholder (original functionality)
    const [widthStr, heightStr] = (pathParams[0]?.split('x') || ['400', '600']);
    const width = parseInt(widthStr) || 400;
    const height = parseInt(heightStr) || 600;
    
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#1a1a1a"/>
        <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="20" fill="#666" text-anchor="middle" dominant-baseline="middle">${width} x ${height}</text>
      </svg>
    `;
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate placeholder' },
      { status: 500 }
    );
  }
} 