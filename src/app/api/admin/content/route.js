import dbConnect from '@/lib/db';
import SiteContent from '@/models/SiteContent';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await dbConnect();
    let content = await SiteContent.findOne({ identifier: 'global_content' });
    
    // Create default if it doesn't exist
    if (!content) {
      content = await SiteContent.create({ identifier: 'global_content' });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    await dbConnect();
    
    let content = await SiteContent.findOne({ identifier: 'global_content' });
    if (!content) {
      content = new SiteContent({ identifier: 'global_content' });
    }
    
    // Merge updates
    if (data.visibility) content.visibility = { ...content.visibility, ...data.visibility };
    if (data.hero) content.hero = { ...content.hero, ...data.hero };
    if (data.parallaxCampaign) content.parallaxCampaign = { ...content.parallaxCampaign, ...data.parallaxCampaign };
    if (data.featuredLook) content.featuredLook = { ...content.featuredLook, ...data.featuredLook };
    if (data.lookbook) content.lookbook = { ...content.lookbook, ...data.lookbook };
    
    await content.save();
    
    // Bust the cache for the storefront
    revalidatePath('/');
    
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
