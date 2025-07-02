import * as admin from "firebase-admin";
import * as zlib from "zlib";
import {promisify} from "util";

const gzip = promisify(zlib.gzip);
const parcelIdAddressPairingsCacheBucket = admin.storage().bucket(process.env.PARCEL_ID_ADDRESS_PAIRINGS_CACHE_BUCKET!);
const staticMapImageCacheBucket = admin.storage().bucket(process.env.STATIC_MAP_IMAGE_CACHE_BUCKET!);

/**
 * Retreives the signed URL of a static map image from the staticMapImageCacheBucket
 * given a parcelId.
 *
 * @param parcelId The parcel ID to search for.
 * @return The signed URL of the static map image.
 */
export const getStaticMapImageUrl = async (parcelId: string): Promise<string> => {
  const [files] = await staticMapImageCacheBucket.getFiles({
    prefix: `static-map-images/${parcelId}`,
  });

  if (files.length === 0) {
    console.log(`[StorageClient] No cached static map image found for parcelId: ${parcelId}`);
    throw new Error(`No cached static map image found for parcelId: ${parcelId}`);
  }

  const filename = files[0].name;
  const file = staticMapImageCacheBucket.file(filename);

  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 60 * 60 * 1000, // 1 hour from now
  });

  console.log(`[StorageClient] Generated signed URL for ${filename}`);
  return signedUrl;
};

/**
 * Given a parcelId, returns a boolean indicating whether a static map image is cached.
 *
 * @param parcelId The parcel ID to search for.
 * @return A boolean indicating whether a static map image is cached.
 */
export const isStaticMapImageCached = async (parcelId: string): Promise<boolean> => {
  const [files] = await staticMapImageCacheBucket.getFiles({
    prefix: `static-map-images/${parcelId}`,
  });

  return files.length > 0;
};

/**
 * Given the binary png data of a static map image and its corresponding parcelId,
 * upload it to the staticMapImageCacheBucket.
 *
 * @param parcelId The parcel ID to search for.
 * @param staticMapImageData The binary png data of the static map image.
 *
 * @return The signed URL of the uploaded static map image.
 */
export const storeStaticMapImage = async (parcelId: string, staticMapImageData: Buffer): Promise<string> => {
  const filename = `static-map-images/${parcelId}.png`;
  const file = staticMapImageCacheBucket.file(filename);
  await file.save(staticMapImageData, {
    metadata: {
      contentType: "image/png",
    },
  });

  console.log(`[StorageClient] Successfully uploaded ${filename} to bucket`);

  // Generate signed URL (valid for 1 hour)
  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 60 * 60 * 1000, // 1 hour from now
  });

  console.log(`[StorageClient] Generated signed URL for ${filename}`);
  return signedUrl;
};

/**
 * Given parcelId address pairings, upload them to the parcelIdAddressPairingsCacheBucket
 * as a gzipped JSON file with current timestamp as the name.
 *
 * @param parcelIdAddressPairings Array of parcel ID and address pairings to cache.
 */
export const storeParcelIdAddressPairings = async (parcelIdAddressPairings: Array<{parcelId: string, fullAddress: string}>): Promise<void> => {
  console.log(`[StorageClient] Starting upload of ${parcelIdAddressPairings.length} parcel ID address pairings`);

  try {
    // Convert to JSON string
    const jsonData = JSON.stringify(parcelIdAddressPairings);
    console.log(`[StorageClient] JSON data size: ${jsonData.length} characters`);

    // Compress with gzip using Node.js built-in zlib
    const gzippedData = await gzip(jsonData);
    console.log(`[StorageClient] Gzipped data size: ${gzippedData.length} bytes (${((gzippedData.length / jsonData.length) * 100).toFixed(1)}% compression)`);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `parcel-id-address-pairings-${timestamp}.json.gz`;

    // Upload to bucket
    const file = parcelIdAddressPairingsCacheBucket.file(filename);
    await file.save(gzippedData, {
      metadata: {
        contentType: "application/gzip",
        metadata: {
          originalSize: jsonData.length.toString(),
          compressedSize: gzippedData.length.toString(),
          recordCount: parcelIdAddressPairings.length.toString(),
        },
      },
    });

    console.log(`[StorageClient] Successfully uploaded ${filename} to bucket`);
  } catch (error) {
    console.error("[StorageClient] Error uploading parcel ID address pairings:", error);
    throw error;
  }
};

/**
 * Get all files in the parcelIdAddressPairingsCacheBucket, determine the most recent file
 * by checking the timestamp in the filename and generate a signed URL for the file.
 *
 * @return A signed URL for the most recent parcel ID address pairings file, or null if no files exist.
 */
export const getMostRecentParcelIdAddressPairingsUrl = async (): Promise<string | null> => {
  console.log("[StorageClient] Getting most recent parcel ID address pairings file");

  try {
    // List all files in the bucket
    const [files] = await parcelIdAddressPairingsCacheBucket.getFiles({
      prefix: "parcel-id-address-pairings-",
    });

    if (files.length === 0) {
      console.log("[StorageClient] No cached files found in bucket");
      return null;
    }

    console.log(`[StorageClient] Found ${files.length} cached files`);

    // Find the most recent file by parsing timestamps in filenames
    let mostRecentFile = files[0];
    let mostRecentTimestamp = new Date(0);

    for (const file of files) {
      const filename = file.name;
      // Extract timestamp from filename: parcel-id-address-pairings-YYYY-MM-DDTHH-MM-SS-sssZ.json.gz
      const timestampMatch = filename.match(/parcel-id-address-pairings-(.+)\.json\.gz$/);

      if (timestampMatch) {
        const timestampStr = timestampMatch[1].replace(/-/g, ":").replace(/-/g, ".");
        const fileTimestamp = new Date(timestampStr);

        if (fileTimestamp > mostRecentTimestamp) {
          mostRecentTimestamp = fileTimestamp;
          mostRecentFile = file;
        }
      }
    }

    console.log(`[StorageClient] Most recent file: ${mostRecentFile.name} (${mostRecentTimestamp.toISOString()})`);

    // Generate signed URL (valid for 1 hour)
    const [signedUrl] = await mostRecentFile.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour from now
    });

    console.log(`[StorageClient] Generated signed URL for ${mostRecentFile.name}`);
    return signedUrl;
  } catch (error) {
    console.error("[StorageClient] Error getting most recent parcel ID address pairings URL:", error);
    throw error;
  }
};
