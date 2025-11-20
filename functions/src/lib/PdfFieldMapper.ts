import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import {FormFieldMapping, PdfPropertyData} from "../types";

/**
 * Load and parse a YAML configuration file for PDF field mapping.
 *
 * @param fiscalYear The fiscal year (e.g., 26 for FY2026).
 * @param formType The form type (residential, personal, abatement_short, abatement_long).
 * @return The parsed field mapping configuration.
 */
export const loadFieldConfig = (fiscalYear: number, formType: string): FormFieldMapping => {
  // Extract last two digits of fiscal year for directory name
  const fyShort = fiscalYear.toString().slice(-2);
  const configPath = path.join(__dirname, `../assets/forms/fy${fyShort}/${formType}.config.yaml`);

  try {
    const fileContents = fs.readFileSync(configPath, "utf8");
    const config = yaml.load(fileContents) as FormFieldMapping;

    console.log(`[PdfFieldMapper] Loaded config for ${formType} FY${fiscalYear}`);
    return config;
  } catch (error) {
    console.error(`[PdfFieldMapper] Error loading config from ${configPath}:`, error);
    throw new Error(`Failed to load field configuration: ${error}`);
  }
};

/**
 * Map property data to field values for PDF generation.
 *
 * @param propertyData The property data to map.
 * @return An object mapping field names to their values.
 */
export const mapPropertyDataToFields = (propertyData: PdfPropertyData): { [key: string]: string } => {
  const fields: { [key: string]: string } = {
    parcel_id: propertyData.parcelId,
    owner: propertyData.owner.join(", "),
    address: propertyData.address,
    assessed_value: propertyData.assessedValue.toLocaleString(), // No dollar sign
  };

  // Add optional fields if they exist
  if (propertyData.zipCode) {
    fields.zip_code = propertyData.zipCode;
  }
  if (propertyData.firstName) {
    fields.first_name = propertyData.firstName;
  }
  if (propertyData.lastName) {
    fields.last_name = propertyData.lastName;
  }
  if (propertyData.date) {
    fields.date = propertyData.date;
  }
  if (propertyData.applicationNumber) {
    fields.application_number = propertyData.applicationNumber;
  }
  if (propertyData.classCode) {
    fields.class_code = propertyData.classCode;
  }
  if (propertyData.streetNumber) {
    fields.street_number = propertyData.streetNumber;
  }
  if (propertyData.streetName) {
    fields.street_name = propertyData.streetName;
  }

  return fields;
};

/**
 * Get the PDF file path for a given form type and fiscal year.
 *
 * @param fiscalYear The fiscal year.
 * @param formType The form type.
 * @return The absolute path to the PDF file.
 */
export const getPdfPath = (fiscalYear: number, formType: string): string => {
  const fyShort = fiscalYear.toString().slice(-2);
  return path.join(__dirname, `../assets/forms/fy${fyShort}/${formType}.pdf`);
};

