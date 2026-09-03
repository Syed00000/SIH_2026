/**
 * Generic Storage Provider Abstraction Interface.
 *
 * All underlying cloud storage implementations (Cloudinary, AWS S3, Cloudflare R2,
 * Supabase Storage, etc.) must implement this contract. Application and business logic
 * only interact with this interface and never import provider SDKs directly.
 */
export class StorageProvider {
  /**
   * Uploads a file buffer to storage.
   *
   * @param {Object} input
   * @param {Buffer} input.buffer - File data buffer (in-memory)
   * @param {string} input.originalFileName - Original client-side filename
   * @param {string} input.mimeType - Validated MIME type (e.g. 'image/jpeg', 'video/mp4', 'application/pdf')
   * @param {string} [input.folder] - Storage bucket/folder path prefix (e.g. 'citizens/evidence')
   * @param {string} [input.uniqueId] - Collision-resistant unique ID
   * @param {boolean} [input.isPrivate=true] - Whether asset requires signed/authenticated access
   * @returns {Promise<{
   *   storageProvider: string,
   *   storageKey: string,
   *   providerPublicId: string,
   *   resourceType: 'image' | 'video' | 'raw',
   *   originalFileName: string,
   *   mimeType: string,
   *   fileType: 'image' | 'video' | 'pdf' | 'document' | 'other',
   *   fileSize: number,
   *   accessUrl: string
   * }>}
   */
  async upload(input) {
    throw new Error('upload() must be implemented by the storage provider subclass');
  }

  /**
   * Deletes an asset permanently from cloud storage.
   *
   * @param {Object} input
   * @param {string} input.providerPublicId - Unique provider public ID / storage key
   * @param {string} input.resourceType - 'image' | 'video' | 'raw'
   * @param {boolean} [input.isPrivate=true]
   * @returns {Promise<boolean>}
   */
  async delete(input) {
    throw new Error('delete() must be implemented by the storage provider subclass');
  }

  /**
   * Generates a temporary, authenticated, signed access URL for private files.
   *
   * @param {Object} input
   * @param {string} input.providerPublicId - Unique provider public ID
   * @param {string} input.resourceType - 'image' | 'video' | 'raw'
   * @param {boolean} [input.isPrivate=true]
   * @param {number} [input.expiresInSeconds=3600] - Expiration duration in seconds
   * @returns {Promise<string>}
   */
  async getAccessUrl(input) {
    throw new Error('getAccessUrl() must be implemented by the storage provider subclass');
  }
}

export default StorageProvider;
