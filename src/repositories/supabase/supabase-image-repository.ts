import { supabase } from '@/lib/supabase'
import { Image, ImageRepository } from '../image-repository'

/**
 * `SupabaseImageRepository` class for managing image storage using Supabase.
 *
 * This class implements the `ImageRepository` interface, allowing images to be uploaded
 * to a Supabase storage bucket. The path returned by the `uploadImage` method is the path
 * within the bucket, excluding the `NEXT_PUBLIC_BUCKET` URL. This path can be stored
 * in the database for easy reference and retrieval.
 *
 * Example:
 * - If the bucket URL is stored in `NEXT_PUBLIC_BUCKET` as `https://example-bucket.s3.amazonaws.com`,
 *   and the image is uploaded to the `avatars` directory with the name `profile.jpg`,
 *   the path returned might be `/avatars/profile.jpg`.
 */
export class SupabaseImageRepository implements ImageRepository {
  async uploadImage(image: Image): Promise<string> {
    const { imageName, imageBuffer, filePath, overwrite } = image

    const fileName = filePath ? `/${filePath}/${imageName}` : `/${imageName}`

    const { data, error } = await supabase.storage
      .from('assets-public/images')
      .upload(fileName, imageBuffer, {
        upsert: overwrite || false, // Update the file if it already exists
      })

    if (error) {
      console.error('💥 Error uploading to Supabase:', error)
    }

    if (!data) {
      console.error('💥 Error retrieving upload data:', data)
    }

    if (!data || error) {
      throw new Error('Error uploading the image to Supabase.')
    }

    return `/${data.path}`
  }
}
