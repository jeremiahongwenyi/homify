import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/helpers/apiResponse";
import {imagesSchema} from "@/schemas/customOrder"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('data passed to api', body);
    
    const validity = imagesSchema.safeParse(body);
        console.log("field validity", validity);
    
        if (!validity.success) {
          const { fieldErrors } = validity.error.flatten();
          console.log('flattened error', validity.error.flatten());
          
          return apiError({message:"Some fields are missing", fieldErrors}, 400)
        }

    const { customOrderId, images } = validity.data;


    // If your Prisma model name/fields differ, rename here.
    const response = await prisma.customOrderImage.createMany({
      data: images.map((img) => ({
        customOrderId,
        imageUrl: img.imageUrl,
        publicId: img.publicId,
      })),
      skipDuplicates: true,
    });

    console.log('response form creating images in the db', response);

    return apiSuccess({message:"Images successfully saved"}, 201)
    
    
  } catch (error) {
    console.log('error in saving images to the db', error);
    
    return apiError({message: "We’re unable to save images right now. Please try again shortly."}, 500)
  }
}