// /app/api/upload/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { apiError, apiSuccess } from '@/helpers/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'furniture-products';

    if (!file) {
      return apiError({message:'No file provided'}, 400)
    }

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary directly from buffer
    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      transformation: [
        { width: 1200, height: 800, crop: 'fill' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
      resource_type: 'auto',
    });

    return apiSuccess({message: 'File uploaded successfully', url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes}, 201)

  } catch (error: any) {
    console.error('Upload error:', error); 
    // More detailed error response
     return apiError({message:'File upload failed'}, 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'No publicId provided' },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}