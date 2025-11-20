import bwipjs from "bwip-js";

/**
 * Generate a Code128 barcode as a PNG buffer.
 *
 * @param value The value to encode in the barcode.
 * @param options Optional configuration for barcode dimensions.
 * @return A Promise that resolves to a PNG Buffer.
 */
export const generateCode128Barcode = async (
  value: string,
  options?: {
    width?: number;
    height?: number;
    scale?: number;
  }
): Promise<Buffer> => {
  try {
    const png = await bwipjs.toBuffer({
      bcid: "code128", // Barcode type
      text: value, // Text to encode
      scale: options?.scale || 3, // 3x scaling factor
      height: options?.height || 10, // Bar height, in millimeters
      includetext: false, // Do not include text below barcode
      textxalign: "center", // Center text if included
    });

    console.log(`[BarcodeGenerator] Generated Code128 barcode for value: ${value}`);
    return png;
  } catch (error) {
    console.error(`[BarcodeGenerator] Error generating barcode for value ${value}:`, error);
    throw new Error(`Failed to generate barcode: ${error}`);
  }
};

/**
 * Generate a barcode value for residential exemption forms.
 * Residential exemption barcodes use the parcel ID as the value.
 *
 * @param parcelId The parcel ID.
 * @return The barcode value.
 */
export const generateResidentialExemptionBarcodeValue = (parcelId: string): string => {
  return parcelId;
};

/**
 * Generate a barcode value for personal exemption forms.
 * Personal exemption barcodes use the parcel ID as the value.
 *
 * @param parcelId The parcel ID.
 * @return The barcode value.
 */
export const generatePersonalExemptionBarcodeValue = (parcelId: string): string => {
  return parcelId;
};

/**
 * Generate a barcode value for abatement application forms.
 * Abatement barcodes use the format: {year}{seqnum}
 * Example: 202615001 (year 2026, sequence number 15001)
 *
 * @param year The 4-digit fiscal year.
 * @param sequenceNumber The sequence number for the year.
 * @return The barcode value.
 */
export const generateAbatementBarcodeValue = (year: number, sequenceNumber: number): string => {
  return `${year}${sequenceNumber}`;
};

/**
 * Generate a barcode buffer for a given form type and data.
 *
 * @param formType The type of form (residential, personal, abatement).
 * @param parcelId The parcel ID.
 * @param fiscalYear The fiscal year (required for abatements).
 * @param sequenceNumber The sequence number (required for abatements).
 * @return A Promise that resolves to a PNG Buffer.
 */
export const generateBarcodeForForm = async (
  formType: "residential" | "personal" | "abatement",
  parcelId: string,
  fiscalYear?: number,
  sequenceNumber?: number
): Promise<Buffer> => {
  let barcodeValue: string;

  switch (formType) {
  case "residential":
    barcodeValue = generateResidentialExemptionBarcodeValue(parcelId);
    break;
  case "personal":
    barcodeValue = generatePersonalExemptionBarcodeValue(parcelId);
    break;
  case "abatement":
    if (!fiscalYear || !sequenceNumber) {
      throw new Error("Fiscal year and sequence number are required for abatement barcodes");
    }
    barcodeValue = generateAbatementBarcodeValue(fiscalYear, sequenceNumber);
    break;
  default:
    throw new Error(`Unknown form type: ${formType}`);
  }

  return generateCode128Barcode(barcodeValue);
};

