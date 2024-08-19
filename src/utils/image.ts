import sharp from 'sharp'

/**
 * Interface for image resizing and conversion options.
 *
 * @property {number} [width=96] - The desired width of the resulting image. Default is 96 pixels.
 * @property {number} [height=96] - The desired height of the resulting image. Default is 96 pixels.
 * @property {'jpeg' | 'png' | 'webp' | 'tiff' | 'gif'} [format='jpeg'] - The output format of the image. Can be 'jpeg', 'png', 'webp', 'tiff', or 'gif'. Default is 'jpeg'.
 * @property {number} [quality=90] - The quality of the resulting image (applicable to 'jpeg' and 'webp'). The value can range from 1 to 100. Default is 90.
 * @property {Buffer} [file] - The buffer of the image file if the image is provided directly instead of from a URL.
 * @property {string} [url] - The URL of the image if the image needs to be downloaded before processing.
 */
interface ResizeAndConvertOptions {
  width?: number
  height?: number
  format?: 'jpeg' | 'png' | 'webp' | 'tiff' | 'gif'
  quality?: number
  file?: Buffer
  url?: string
}

/**
 * Resizes and converts an image to the desired format.
 *
 * This function allows resizing and converting an image to different formats
 * such as JPEG, PNG, WebP, TIFF, and GIF. The image can be provided as a buffer
 * or downloaded from a URL. The function also allows configuring the quality of the resulting
 * image, applicable to formats like JPEG and WebP.
 *
 * @param {ResizeAndConvertOptions} options - Options for resizing and converting the image.
 * @param {number} [options.width=96] - The desired width of the resulting image. Default is 96 pixels.
 * @param {number} [options.height=96] - The desired height of the resulting image. Default is 96 pixels.
 * @param {'jpeg' | 'png' | 'webp' | 'tiff' | 'gif'} [options.format='jpeg'] - The output format of the image. Can be 'jpeg', 'png', 'webp', 'tiff', or 'gif'. Default is 'jpeg'.
 * @param {number} [options.quality=90] - The quality of the resulting image (applicable to 'jpeg' and 'webp'). The value can range from 1 to 100. Default is 90.
 * @param {Buffer} [options.file] - The buffer of the image file if the image is provided directly instead of from a URL.
 * @param {string} [options.url] - The URL of the image if the image needs to be downloaded before processing.
 *
 * @returns {Promise<Buffer>} - A buffer containing the resized and converted image.
 *
 * @throws {Error} - Throws an error if neither `file` nor `url` is provided.
 *
 * @example
 * // Resize and convert an image from a URL to PNG
 * const imageBuffer = await resizeAndConvertImage({
 *   url: 'https://example.com/image.jpg',
 *   width: 200,
 *   height: 200,
 *   format: 'png',
 *   quality: 80
 * })
 *
 * @example
 * // Resize and convert an image from a file to WebP
 * const imageBuffer = await resizeAndConvertImage({
 *   file: someBuffer,
 *   width: 150,
 *   height: 150,
 *   format: 'webp',
 *   quality: 85
 * })
 */
export async function resizeAndConvertImage(
  options: ResizeAndConvertOptions,
): Promise<Buffer> {
  const {
    width = 96,
    height = 96,
    format = 'jpeg',
    quality = 90,
    file,
    url,
  } = options

  let imageBuffer: Buffer

  if (file) {
    // If a file is provided, use it directly
    imageBuffer = file
  } else if (url) {
    // Download the image from the provided URL using fetch
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    imageBuffer = Buffer.from(arrayBuffer)
  } else {
    throw new Error('You must provide either a URL or a file.')
  }

  // Resize and convert the image to the desired format
  const resizedImage = await sharp(imageBuffer)
    .resize(width, height)
    [format]({ quality })
    .toBuffer()

  return resizedImage
}
