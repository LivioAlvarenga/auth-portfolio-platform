/**
 * Interface representing the properties of an image.
 */
export interface Image {
  /**
   * The name of the image file, including the extension (e.g., 'image.jpg').
   */
  imageName: string

  /**
   * The buffer containing the image data.
   */
  imageBuffer: Buffer

  /**
   * Optional file path where the image should be stored.
   * This can represent a folder or directory structure within the storage service.
   */
  filePath?: string

  /**
   * Indicates whether an existing image with the same name should be overwritten.
   * If set to `true`, any existing image with the same name will be replaced.
   * If set to `false`, an error or alternative handling can occur if the image already exists.
   * The default is `false`.
   */
  overwrite?: boolean
}

/**
 * Interface defining the contract for an image repository.
 *
 * This interface should be implemented by any class that manages image storage,
 * ensuring a consistent API for uploading images.
 */
export interface ImageRepository {
  /**
   * Uploads an image to the storage service.
   *
   * @param image - Object containing the image properties.
   *
   * Properties of `image`:
   * - `imageName`: The name of the image file, including the extension (e.g., 'image.jpg').
   * - `imageBuffer`: The buffer containing the image data.
   * - `filePath`: Optional file path where the image should be stored.
   * - `overwrite`: Indicates whether an existing image with the same name should be overwritten. Default is `false`.
   *
   * @returns {Promise<string>} - A promise that resolves to the path of the uploaded image within the bucket, excluding the `NEXT_PUBLIC_BUCKET` URL.
   * This path can be stored in the database (e.g., `/avatars/321354654632jhgjhgjhg-google.jpeg`).
   *
   * @throws {Error} - Throws an error if the upload fails.
   */
  uploadImage(image: Image): Promise<string>
}
