import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = 'https://instagram-scraper-api2.p.rapidapi.com/v1.2/posts?username_or_id_or_url=printitonline';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '55ed6b1d93msh2c6801645d22136p1a2532jsn27a6df294160',
            'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
        },
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        // Extract image URLs
        const imageUrls = data?.data?.items?.map((ele: any) => ele?.image_versions?.items[0]?.url);
        if (!imageUrls) {
            return NextResponse.json({ error: 'No images found' }, { status: 404 });
        }

        // Fetch each image and convert it to base64
        const base64Images = await Promise.all(
            imageUrls.map(async (imageUrl: string) => {
                const imageResponse = await fetch(imageUrl);
                const buffer = await imageResponse.arrayBuffer();
                return `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
            })
        );

        return NextResponse.json({ images: base64Images });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error fetching Instagram data' }, { status: 500 });
    }
}