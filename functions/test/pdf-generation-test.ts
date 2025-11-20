/**
 * Local PDF Generation Testing Utility
 *
 * This script is for DEVELOPMENT ONLY and is NOT deployed to Firebase.
 * Use it to test PDF generation locally and adjust YAML configurations.
 *
 * Usage:
 *   npm run test:pdf -- --form-type=residential --parcel-id=0123456789 --output-path=./test/output/test.pdf
 */

import * as fs from "fs";
import * as path from "path";
import {loadFieldConfig, mapPropertyDataToFields, getPdfPath} from "../src/lib/PdfFieldMapper";
import {fillPdfForm, determineFormType} from "../src/lib/PdfGenerator";
import {generateBarcodeForForm} from "../src/lib/BarcodeGenerator";
import {PdfPropertyData} from "../src/types";

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split("=")[1] : undefined;
};

const formType = getArg("form-type") || "residential";
const parcelId = getArg("parcel-id") || "0123456789";
const outputPath = getArg("output-path") || "./test/output/test.pdf";
const fiscalYear = parseInt(getArg("fiscal-year") || "2026");

// Sample property data for testing
const currentDate = new Date();
const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}/${currentDate.getFullYear()}`;

const samplePropertyData: PdfPropertyData = {
  parcelId: parcelId,
  owner: ["Doe, John", "Doe, Jane"],
  address: "123 Main Street", // Just street address, no city/state/zip
  zipCode: "02101",
  firstName: "John",
  lastName: "Doe",
  date: formattedDate,
  assessedValue: 500000,
  propertyTypeCode: "101", // Residential - always defined
  classCode: "101", // Same as property type code
  streetNumber: "123",
  streetName: "Main Street",
};

async function generateTestPdf() {
  try {
    console.log("=== PDF Generation Test ===");
    console.log(`Form Type: ${formType}`);
    console.log(`Parcel ID: ${parcelId}`);
    console.log(`Fiscal Year: ${fiscalYear}`);
    console.log(`Output Path: ${outputPath}`);
    console.log();

    // Determine the actual form type (for abatements)
    const actualFormType = determineFormType(samplePropertyData.propertyTypeCode || "101", formType);
    console.log(`Determined Form Type: ${actualFormType}`);

    // Load field configuration
    console.log("Loading field configuration...");
    const fieldConfig = loadFieldConfig(fiscalYear, actualFormType);
    console.log(`Loaded config with ${Object.keys(fieldConfig.fields).length} fields`);

    // Generate barcode and application number (must be done before mapping fields)
    console.log("Generating barcode...");
    let barcodeData: Buffer | undefined;

    // Determine base form type for barcode generation
    const baseFormType = actualFormType.startsWith("abatement") ? "abatement" : actualFormType;

    if (baseFormType === "abatement") {
      // For abatements, use a test sequence number and add application number to property data
      const testSequenceNumber = 15001;
      const applicationNumber = `${fiscalYear}${testSequenceNumber}`;
      samplePropertyData.applicationNumber = applicationNumber;
      barcodeData = await generateBarcodeForForm("abatement", parcelId, fiscalYear, testSequenceNumber);
      console.log(`Generated abatement barcode/application number: ${applicationNumber}`);
    } else {
      barcodeData = await generateBarcodeForForm(baseFormType as "residential" | "personal", parcelId);
      console.log(`Generated ${baseFormType} barcode: ${parcelId}`);
    }

    // Map property data to field values (after application number is added)
    const fieldValues = mapPropertyDataToFields(samplePropertyData);
    console.log("Mapped field values:", fieldValues);

    // Get PDF template path
    const pdfPath = getPdfPath(fiscalYear, actualFormType);
    console.log(`PDF Template Path: ${pdfPath}`);

    // Check if PDF exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF template not found at ${pdfPath}`);
    }

    // Fill PDF form
    console.log("Filling PDF form...");
    const filledPdfBuffer = await fillPdfForm(
      pdfPath,
      fieldConfig,
      samplePropertyData,
      fieldValues,
      barcodeData
    );

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {recursive: true});
    }

    // Write output file
    fs.writeFileSync(outputPath, filledPdfBuffer);
    console.log();
    console.log(`✓ Successfully generated PDF: ${outputPath}`);
    console.log("Open the PDF to verify field placement and adjust YAML config as needed.");
  } catch (error) {
    console.error("✗ Error generating test PDF:", error);
    process.exit(1);
  }
}

// Run the test
generateTestPdf();

