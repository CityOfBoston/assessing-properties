import * as fs from "fs";
import {PDFDocument, PDFFont, rgb} from "pdf-lib";
import {
  FormFieldMapping,
  FieldIndexConfig,
  BoundingBoxFieldConfig,
  FontConfig,
  BoundingBox,
  PdfPropertyData,
} from "../types";

/**
 * Calculate the optimal font size to fit text within a bounding box.
 *
 * @param text The text to fit.
 * @param bbox The bounding box dimensions.
 * @param font The PDF font to use.
 * @param fontConfig Font configuration with min/max sizes.
 * @return The optimal font size.
 */
export const calculateOptimalFontSize = (
  text: string,
  bbox: BoundingBox,
  font: PDFFont,
  fontConfig: FontConfig
): number => {
  const maxSize = fontConfig.maxFontSize || 12;
  const minSize = fontConfig.minFontSize || 6;
  const defaultSize = fontConfig.defaultFontSize || 10;

  if (!fontConfig.autoSizeFont) {
    return defaultSize;
  }

  // Try sizes from max to min
  for (let size = maxSize; size >= minSize; size -= 0.5) {
    const width = font.widthOfTextAtSize(text, size);
    const height = font.heightAtSize(size);

    if (width <= bbox.width && height <= bbox.height) {
      return size;
    }
  }

  // If nothing fits, return minimum size
  return minSize;
};

/**
 * Fill a PDF form field by its index.
 *
 * @param pdfDoc The PDF document.
 * @param index The field index.
 * @param value The value to fill.
 */
export const fillFieldByIndex = (pdfDoc: PDFDocument, index: number, value: string): void => {
  try {
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    if (index >= fields.length) {
      console.warn(`[PdfGenerator] Field index ${index} is out of range (total fields: ${fields.length})`);
      return;
    }

    const field = fields[index];
    const fieldName = field.getName();

    // Try to fill as text field
    try {
      const textField = form.getTextField(fieldName);
      textField.setText(value);
      console.log(`[PdfGenerator] Filled field index ${index} (${fieldName}) with value: ${value}`);
    } catch {
      console.warn(`[PdfGenerator] Field at index ${index} is not a text field`);
    }
  } catch (error) {
    console.error(`[PdfGenerator] Error filling field at index ${index}:`, error);
  }
};

/**
 * Convert top-left coordinates to PDF bottom-left coordinates.
 *
 * @param x X coordinate from top-left
 * @param y Y coordinate from top-left
 * @param pageHeight Page height
 * @param boxHeight Height of the element
 * @return Converted coordinates for PDF (bottom-left origin)
 */
const convertToBottomLeft = (x: number, y: number, pageHeight: number, boxHeight = 0) => {
  return {
    x: x,
    y: pageHeight - y - boxHeight,
  };
};

/**
 * Fill a field by drawing text at a specific bounding box position.
 * Note: Input coordinates should be in top-left origin system.
 *
 * @param pdfDoc The PDF document.
 * @param bbox The bounding box for text placement (top-left coordinates).
 * @param value The text value to draw.
 * @param fontConfig Font configuration.
 */
export const fillFieldByBoundingBox = async (
  pdfDoc: PDFDocument,
  bbox: BoundingBox,
  value: string,
  fontConfig: FontConfig
): Promise<void> => {
  try {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const pageHeight = firstPage.getHeight();

    const font = await pdfDoc.embedFont("Helvetica");
    const fontSize = calculateOptimalFontSize(value, bbox, font, fontConfig);

    // Convert from top-left to bottom-left coordinates
    const converted = convertToBottomLeft(bbox.x, bbox.y, pageHeight, fontSize);

    firstPage.drawText(value, {
      x: converted.x,
      y: converted.y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    console.log(`[PdfGenerator] Drew text "${value}" at top-left (${bbox.x}, ${bbox.y}) / bottom-left (${converted.x}, ${converted.y}) with font size ${fontSize}`);
  } catch (error) {
    console.error("[PdfGenerator] Error drawing text in bounding box:", error);
  }
};

/**
 * Embed a barcode image into the PDF, automatically centered at the top.
 * Barcode is placed 25pt from the top, horizontally centered.
 *
 * @param pdfDoc The PDF document.
 * @param barcodeBuffer The barcode image as a PNG buffer.
 */
export const embedBarcodeInPdf = async (
  pdfDoc: PDFDocument,
  barcodeBuffer: Buffer
): Promise<void> => {
  try {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const pageWidth = firstPage.getWidth();
    const pageHeight = firstPage.getHeight();

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeWidth = 135;
    const barcodeHeight = 35;

    // Calculate centered position (25pt from top in top-left coordinates)
    const topLeftX = (pageWidth - barcodeWidth) / 2;
    const topLeftY = 10;

    // Convert to bottom-left coordinates for PDF
    const converted = convertToBottomLeft(topLeftX, topLeftY, pageHeight, barcodeHeight);

    firstPage.drawImage(barcodeImage, {
      x: converted.x,
      y: converted.y,
      width: barcodeWidth,
      height: barcodeHeight,
    });

    console.log(`[PdfGenerator] Embedded barcode at top-center (page: ${pageWidth}x${pageHeight}, barcode: ${barcodeWidth}x${barcodeHeight})`);
  } catch (error) {
    console.error("[PdfGenerator] Error embedding barcode:", error);
    throw new Error(`Failed to embed barcode: ${error}`);
  }
};

/**
 * Determine the appropriate form type based on property type code.
 *
 * @param propertyTypeCode The property type code (4-digit LUC code, first digit is always 0).
 * @param formCategory The form category (residential, personal, or abatement).
 * @return The specific form type (for abatements: abatement_short or abatement_long).
 */
export const determineFormType = (propertyTypeCode: string, formCategory: string): string => {
  if (formCategory !== "abatement") {
    return formCategory;
  }

  // For abatements: residential properties use short form, commercial use long form
  // Property type code is 4 digits (e.g., "0101"), first digit is always 0
  // Extract the last 3 digits for classification
  const last3Digits = propertyTypeCode.slice(-3);
  const code = parseInt(last3Digits, 10);

  // Handle invalid codes - default to residential
  if (isNaN(code)) {
    console.warn(`[PdfGenerator] Invalid property type code: ${propertyTypeCode}, defaulting to residential`);
    return "abatement_short";
  }

  // Commercial property ranges:
  // 010-031, 111-129, 140, 200-999
  const isCommercial = 
    (code >= 10 && code <= 31) ||
    (code >= 111 && code <= 129) ||
    code === 140 ||
    (code >= 200 && code <= 999);

  return isCommercial ? "abatement_long" : "abatement_short";
};

/**
 * Fill a PDF form with property data and optional barcode.
 * This is a pure function that doesn't depend on Firebase or external services.
 *
 * @param pdfPath The path to the template PDF file.
 * @param fieldConfig The field configuration mapping.
 * @param propertyData The property data to fill.
 * @param fieldValues The mapped field values.
 * @param barcodeData Optional barcode image buffer.
 * @return A Promise that resolves to the filled PDF as a Buffer.
 */
export const fillPdfForm = async (
  pdfPath: string,
  fieldConfig: FormFieldMapping,
  propertyData: PdfPropertyData,
  fieldValues: { [key: string]: string },
  barcodeData?: Buffer
): Promise<Buffer> => {
  try {
    // Load the PDF template
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    console.log(`[PdfGenerator] Loaded PDF template from ${pdfPath}`);

    // Process each field in the configuration
    for (const [fieldName, config] of Object.entries(fieldConfig.fields)) {
      // Skip barcode field - it's handled separately
      if (fieldName === "barcode") {
        continue;
      }

      const value = fieldValues[fieldName];
      if (!value) {
        console.warn(`[PdfGenerator] No value found for field: ${fieldName}`);
        continue;
      }

      if (config.mode === "field_index") {
        const fieldIndexConfig = config as FieldIndexConfig;
        fillFieldByIndex(pdfDoc, fieldIndexConfig.index, value);
      } else if (config.mode === "bounding_box") {
        const bboxConfig = config as BoundingBoxFieldConfig;
        await fillFieldByBoundingBox(pdfDoc, bboxConfig, value, bboxConfig);
      }
    }

    // Embed barcode if provided (automatically centered at top)
    if (barcodeData) {
      await embedBarcodeInPdf(pdfDoc, barcodeData);
    }

    // Save and return the PDF
    const filledPdfBytes = await pdfDoc.save();
    console.log("[PdfGenerator] Successfully filled PDF form");

    return Buffer.from(filledPdfBytes);
  } catch (error) {
    console.error("[PdfGenerator] Error filling PDF form:", error);
    throw new Error(`Failed to fill PDF form: ${error}`);
  }
};

