/**
 * Helper function to determine fiscal year and quarter based on a date.
 * If the date is before 7/1 of the year of the date, return the year of the date and quarter "3".
 * Otherwise, return the next year to the year of the date and quarter "1".
 *
 * @param date The date to determine fiscal year and quarter for
 * @return Object containing year and quarter
 */
export function getFiscalYearAndQuarter(date: Date): { year: number; quarter: string } {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed: 0=Jan, 6=July

  // If date is before July 1st (month < 6), return current year with quarter 3
  if (month < 6) {
    return {year, quarter: "3"};
  }

  // If date is on or after July 1st (month >= 6), return next year with quarter 1
  return {year: year + 1, quarter: "1"};
}

/**
 * This is a client for making requests to the EGIS API.
 *
 * The EGIS API is a RESTful API that allows you to get property details,
 * tax and parcel information for properties in Boston. It also contains
 * geospatial data for each property that will be
 */

import {PropertyDetailsData, PropertyDetails} from "../types";

const baseUrl = "https://gisportal.boston.gov/arcgis/rest/services/Assessing/Assessing_Online_data/MapServer";
const geomertricDataLayerUrl = `${baseUrl}/0`;
const valueHistoryDataLayerUrl = `${baseUrl}/5`;
const residentialPropertyAttributesDataLayerUrl = `${baseUrl}/6`;
const currentOwnersDataLayerUrl = `${baseUrl}/7`;
const propertiesWebAppDataLayerUrl = `${baseUrl}/8`;
const condoAttributesDataLayerUrl = `${baseUrl}/9`;
const outbuildingsDataLayerUrl = `${baseUrl}/10`;

// Type definitions for ArcGIS Feature and FeatureSet
interface ArcGISFeature {
    attributes: Record<string, any>;
    geometry?: any;
}

interface ArcGISFeatureSet {
    features: ArcGISFeature[];
    exceededTransferLimit?: boolean;
}

/**
 * Abstract function that handles pagination for the EGIS API to ensure all data is retreived when using queries.
 *
 * @param url The proper layer URL to make the request to.
 * @param query The query to make the request with.
 * @return The data from the request.
 */
const fetchEGISData = async (url: string, query: string): Promise<ArcGISFeature[]> => {
  console.log(`[EGISClient] Starting fetchEGISData with URL: ${url}`);
  console.log(`[EGISClient] Query: ${query}`);
  console.log(`[EGISClient] Full request URL: ${url}/query${query}`);

  const allFeatures: ArcGISFeature[] = [];
  let resultOffset = 0;
  let currentRecordCount = 5000; // Start with a larger chunk size
  const minRecordCount = 100; // Minimum chunk size to avoid too many requests
  const maxRecordCount = 10000; // Maximum chunk size to avoid timeouts

  let requestCount = 0;
  let hasMoreData = true;

  while (hasMoreData) {
    requestCount++;
    const paginatedQuery = `${query}&resultOffset=${resultOffset}&resultRecordCount=${currentRecordCount}`;
    const fullUrl = `${url}/query${paginatedQuery}`;

    console.log(`[EGISClient] Making request #${requestCount}: ${fullUrl}`);

    const response = await fetch(fullUrl);

    if (!response.ok) {
      console.error(`[EGISClient] Request failed with status: ${response.status} ${response.statusText}`);
      // If request fails, try with a smaller chunk size, but only if we haven't tried this offset yet
      if (currentRecordCount > minRecordCount) {
        currentRecordCount = Math.max(minRecordCount, Math.floor(currentRecordCount / 2));
        console.log(`[EGISClient] Reducing chunk size to ${currentRecordCount} and retrying`);
        // Don't retry the same offset - move to next offset with smaller chunk
        resultOffset += currentRecordCount;
        continue;
      }
      throw new Error(`Failed to fetch data from EGIS API: ${response.status} ${response.statusText}`);
    }

    const data: ArcGISFeatureSet = await response.json();
    console.log(`[EGISClient] Received ${data.features?.length || 0} features, exceededTransferLimit: ${data.exceededTransferLimit}`);

    if (!data.features || data.features.length === 0) {
      console.log("[EGISClient] No more data to fetch, breaking loop");
      hasMoreData = false;
      break; // No more data to fetch
    }

    allFeatures.push(...data.features);
    console.log(`[EGISClient] Total features collected so far: ${allFeatures.length}`);

    // Use exceededTransferLimit to determine if there's more data
    if (!data.exceededTransferLimit) {
      console.log("[EGISClient] No exceededTransferLimit flag, breaking loop");
      hasMoreData = false;
      break; // No more data to fetch
    }

    // If we got fewer records than requested, reduce chunk size for next request
    if (data.features.length < currentRecordCount && currentRecordCount > minRecordCount) {
      currentRecordCount = Math.max(minRecordCount, Math.floor(currentRecordCount / 2));
      console.log(`[EGISClient] Reducing chunk size to ${currentRecordCount} for next request`);
    } else if (data.features.length === currentRecordCount && currentRecordCount < maxRecordCount) {
      // If we got exactly what we asked for, we can try increasing the chunk size
      currentRecordCount = Math.min(maxRecordCount, currentRecordCount * 2);
      console.log(`[EGISClient] Increasing chunk size to ${currentRecordCount} for next request`);
    }

    resultOffset += data.features.length; // Use actual number of records received
    console.log(`[EGISClient] Updated resultOffset to ${resultOffset}`);
  }

  console.log(`[EGISClient] fetchEGISData completed. Total features: ${allFeatures.length}, Total requests: ${requestCount}`);
  return allFeatures;
};

/**
 * Helper function to filter results for the highest fiscal year and quarter.
 * This is used when no specific date is provided and we want the most recent data.
 *
 * @param features Array of ArcGIS features to filter
 * @return Filtered array with only the highest fiscal year and quarter entries
 */
function filterForHighestFiscalYearAndQuarter(features: ArcGISFeature[]): ArcGISFeature[] {
  if (features.length === 0) return features;

  // Debug: Log sample feature attributes to understand the data structure
  console.log("[EGISClient] Sample feature attributes:", features[0]?.attributes);

  // Debug: Log all fiscal years and quarters present
  const fiscalYears = features.map((f) => f.attributes.fiscal_year).filter(Boolean);
  const quarters = features.map((f) => f.attributes.quarter).filter(Boolean);
  console.log("[EGISClient] Fiscal years found:", [...new Set(fiscalYears)]);
  console.log("[EGISClient] Quarters found:", [...new Set(quarters)]);

  // Find the highest fiscal year
  const maxYear = Math.max(...features.map((f) => f.attributes.fiscal_year || 0));
  console.log("[EGISClient] Highest fiscal year:", maxYear);

  // Filter to only the highest year
  const maxYearFeatures = features.filter((f) => f.attributes.fiscal_year === maxYear);
  console.log(`[EGISClient] Features with highest fiscal year (${maxYear}):`, maxYearFeatures.length);

  if (maxYearFeatures.length === 0) return features;

  // Find the highest quarter within the highest year
  const maxQuarter = Math.max(...maxYearFeatures.map((f) => parseInt(f.attributes.quarter) || 0));
  console.log(`[EGISClient] Highest quarter in year ${maxYear}:`, maxQuarter);

  // Filter to only the highest quarter within the highest year
  const result = maxYearFeatures.filter((f) => parseInt(f.attributes.quarter) === maxQuarter);

  console.log(`[EGISClient] Filtered ${features.length} features to ${result.length} features (FY${maxYear} Q${maxQuarter})`);

  return result;
}

/**
 * Helper function to prioritize values from multiple data layers.
 * Priority order: residential attributes > condo attributes > exemption data
 * Returns the first value that is not null, undefined, or an empty string (but allows 0 for numbers).
 *
 * @param residentialValue Value from residential attributes layer (highest priority)
 * @param condoValue Value from condo attributes layer (medium priority)
 * @param exemptionValue Value from exemption data layer (lowest priority)
 * @return The prioritized value
 */
function prioritizeValue<T>(residentialValue: T | null | undefined, condoValue: T | null | undefined, exemptionValue: T | null | undefined): T | null | undefined {
  const isValid = (v: any) => v !== null && v !== undefined && (typeof v === "number" ? true : v !== "");
  if (isValid(residentialValue)) return residentialValue;
  if (isValid(condoValue)) return condoValue;
  if (isValid(exemptionValue)) return exemptionValue;
  return undefined;
}

/**
 * Helper to construct full address from fields
 */
function constructFullAddress(attrs: Record<string, any>): string {
  // Get and trim all parts, and apply proper case to each
  const stNum = attrs.street_number ? String(attrs.street_number).trim() : "";
  const stNumSuffix = attrs.street_number_suffix ? String(attrs.street_number_suffix).trim() : "";
  const stName = attrs.street_name ? toProperCase(String(attrs.street_name).trim()) : "";
  const unitNum = attrs.apt_unit ? String(attrs.apt_unit).trim() : "";
  const city = attrs.city ? (String(attrs.city).trim() === "=" ? "Boston" : toProperCase(String(attrs.city).trim())) : "";
  const zip = attrs.location_zip_code ? String(attrs.location_zip_code).trim() : "";

  // Compose street number (may be a range)
  let fullStreetNumber = stNum;
  if (stNumSuffix && stNumSuffix !== stNum) {
    fullStreetNumber = `${stNum}-${stNumSuffix}`;
  }

  // Compose street address
  let address = fullStreetNumber;
  if (stName) address += (address ? " " : "") + stName;
  if (unitNum) address += ` #${unitNum}`;
  // Always add comma before city if city is present
  if (city) address += `, ${city}`;
  if (zip) address += `, ${zip}`;

  return address || "Address not available";
}

// Basic proper case function for text
function toProperCase(str: string | undefined): string {
  if (!str) return "";

  // If all uppercase and short (likely an abbreviation), keep as is
  if (/^[A-Z0-9 .,'&-]+$/.test(str) && str.length <= 6) return str;

  // Basic proper case
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// Convert string to camel case (capitalize first letter of each word)
function toCamelCase(str: string | undefined): string {
  if (!str) return "";

  // If all uppercase and short (likely an abbreviation), keep as is
  if (/^[A-Z0-9 .,'&-]+$/.test(str) && str.length <= 6) return str;

  // First split only by spaces to handle multi-word names
  return str.toLowerCase()
    .split(" ")
    .map((part) =>
      // For each part (which might contain hyphens or apostrophes),
      // split by word boundaries but preserve special characters
      part.replace(/\b\w+\b/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))
    )
    .join(" ");
}

/**
 * Helper to parse a string like 'XXX - XXXXXX XXX XXXX' and return the portion after the last ' - '.
 * If the format is not matched, returns the original string trimmed. Handles null/undefined/empty gracefully.
 * Also applies proper case formatting to the result.
 * @param value The input string
 * @return The portion after the last ' - ', or the original string trimmed, with proper case applied
 */
export function parseAfterDash(value: string | null | undefined): string {
  if (!value) return "";
  const idx = value.indexOf(" - ");
  const result = idx !== -1 ? value.slice(idx + 3).trim() : value.trim();
  return toProperCase(result);
}

/**
 * Helper function to get all parcelId and full address pairings for all properties in Boston.
 * Uses currentPropertyDataLayerUrl with query at:
 * https://gisportal.boston.gov/arcgis/rest/services/Assessing/Assessing_Online_data/MapServer/2/query?where=1=1&outFields=PID,FULL_ADDRESS&returnGeometry=false&f=json
 * Results can be found in the "features" array with each feature having an "attributes" object with the fields PID and FULL_ADDRESS.
 *
 * @return A list of objects with parcelId and full address.
 */
export const fetchAllParcelIdAddressPairingsHelper = async (): Promise<{parcelId: string, fullAddress: string}[]> => {
  console.log("[EGISClient] Starting fetchAllParcelIdAddressPairings");

  const query = "?where=1=1&outFields=parcel_id,street_number,street_number_suffix,street_name,street_name_suffix,apt_unit,city,location_zip_code&returnGeometry=false&f=json";
  console.log(`[EGISClient] Parcel ID address pairings query: ${query}`);
  console.log(`[EGISClient] Full parcel ID address pairings URL: ${propertiesWebAppDataLayerUrl}/query${query}`);

  const features = await fetchEGISData(propertiesWebAppDataLayerUrl, query);

  console.log(`[EGISClient] Processing ${features.length} features for parcel ID and address pairings`);

  // Filter for highest fiscal year and quarter
  const filteredFeatures = filterForHighestFiscalYearAndQuarter(features);

  const result = filteredFeatures.map((feature: ArcGISFeature) => {
    return {
      parcelId: feature.attributes.parcel_id,
      fullAddress: constructFullAddress(feature.attributes),
    };
  });

  console.log(`[EGISClient] fetchAllParcelIdAddressPairings completed. Returning ${result.length} pairings`);
  return result;
};

/**
 * Helper function to get property summaries - parcelId, full address, owner and assessed value for the current year given parcelIds.
 * Uses currentPropertyDataLayerUrl with query at:
 * https://gisportal.boston.gov/arcgis/rest/services/Assessing/Assessing_Online_data/MapServer/2/query
 *
 * Results can be found in the "features" array with each feature having an "attributes" object with the fields PID, FULL_ADDRESS, OWNER, and TOTAL_VALUE.
 *
 * @param parcelIds Array of parcel IDs to search for.
 * @param fiscalYearAndQuarter Optional fiscal year and quarter for data filtering.
 * @return Array of property summary objects with parcelId, fullAddress, owner, and assessedValue.
 */
export const fetchPropertySummariesByParcelIdsHelper = async (
  parcelIds: string[],
  fiscalYearAndQuarter?: { year: number; quarter: string }
): Promise<Array<{parcelId: string, fullAddress: string, owner: string, assessedValue: number}>> => {
  console.log(`[EGISClient] Starting fetchPropertySummariesByParcelIds for ${parcelIds.length} parcelIds`);

  if (fiscalYearAndQuarter) {
    console.log(`[EGISClient] Using fiscal year: ${fiscalYearAndQuarter.year}, quarter: ${fiscalYearAndQuarter.quarter}`);
  } else {
    console.log("[EGISClient] No fiscal year/quarter specified, using latest available data");
  }

  // Build OR query for multiple parcel IDs
  const parcelIdConditions = parcelIds.map((id) => `parcel_id='${id}'`).join(" OR ");

  // Add fiscal year and quarter filtering if provided
  let whereClause = `(${parcelIdConditions})`;
  if (fiscalYearAndQuarter) {
    whereClause += ` AND fiscal_year=${fiscalYearAndQuarter.year} AND quarter=${fiscalYearAndQuarter.quarter}`;
  }

  const query = `?where=${whereClause}&outFields=parcel_id,street_name,street_number,street_number_suffix,apt_unit,city,location_zip_code,owner,total_value,fiscal_year,quarter&returnGeometry=false&f=json`;

  try {
    console.log(`[EGISClient] Property summaries query: ${query}`);
    console.log(`[EGISClient] Full property summaries URL: ${propertiesWebAppDataLayerUrl}/query${query}`);

    const features = await fetchEGISData(propertiesWebAppDataLayerUrl, query);

    // Filter for highest fiscal year and quarter only if no specific date was provided
    let filteredFeatures = features;
    console.log(`[EGISClient] Raw features before filtering: ${features.length} records`);
    console.log("[EGISClient] fiscalYearAndQuarter parameter:", fiscalYearAndQuarter);

    if (!fiscalYearAndQuarter) {
      console.log("[EGISClient] No specific fiscal year/quarter provided, filtering for latest data...");
      filteredFeatures = filterForHighestFiscalYearAndQuarter(features);
      console.log(`[EGISClient] After filtering for latest data: ${filteredFeatures.length} records`);
    } else {
      console.log("[EGISClient] Using specific fiscal year/quarter, no additional filtering needed");
    }

    const results = filteredFeatures.map((feature) => ({
      parcelId: feature.attributes.parcel_id,
      fullAddress: constructFullAddress(feature.attributes),
      owner: toCamelCase(feature.attributes.owner) || "",
      assessedValue: feature.attributes.total_value,
    }));

    console.log(`[EGISClient] Found ${results.length} property summaries`);
    return results;
  } catch (error) {
    console.error("[EGISClient] Error fetching property summaries:", error);
    return [];
  }
};

/**
 * Helper function to get a property summary - parcelId, full address, owner and assessed value for the current year given a parcelId.
 * Uses currentPropertyDataLayerUrl with query at:
 * https://gisportal.boston.gov/arcgis/rest/services/Assessing/Assessing_Online_data/MapServer/2/query?where=PID='{parcelId}'&outFields=PID,FULL_ADDRESS,OWNER,TOTAL_VALUE&returnGeometry=false&f=json
 *
 * Results can be found in the "features" array with each feature having an "attributes" object with the fields PID, FULL_ADDRESS, OWNER, and TOTAL_VALUE.
 *
 * @param parcelId The parcel ID to search for.
 * @return A property summary object with parcelId, fullAddress, owner, and assessedValue.
 */
export const fetchPropertySummaryByParcelIdHelper = async (parcelId: string): Promise<{parcelId: string, fullAddress: string, owner: string, assessedValue: number} | null> => {
  console.log(`[EGISClient] Starting fetchPropertySummaryByParcelId for parcelId: ${parcelId}`);

  // Use the correct query format with single quotes around PID
  const query = `?where=PID='${parcelId}'&outFields=PID,ST_NAME,ST_NUM,ST_NUM2,UNIT_NUM,CITY,ZIP_CODE,OWNER,TOTAL_VALUE&returnGeometry=false&f=json`;

  try {
    console.log(`[EGISClient] Property summary query: ${query}`);
    console.log(`[EGISClient] Full property summary URL: ${propertiesWebAppDataLayerUrl}/query${query}`);

    const features = await fetchEGISData(propertiesWebAppDataLayerUrl, query);

    // Filter for highest fiscal year and quarter
    const filteredFeatures = filterForHighestFiscalYearAndQuarter(features);

    if (filteredFeatures.length > 0) {
      const feature = filteredFeatures[0];
      const result = {
        parcelId: feature.attributes.PID,
        fullAddress: constructFullAddress(feature.attributes),
        owner: toCamelCase(feature.attributes.OWNER) || "",
        assessedValue: feature.attributes.TOTAL_VALUE, // Use TOTAL_VALUE field
      };

      console.log(`[EGISClient] Property summary found for parcelId: ${parcelId}`, result);
      return result;
    }
  } catch (error) {
    console.error(`[EGISClient] Error fetching property summary for parcelId: ${parcelId}:`, error);
  }

  console.log(`[EGISClient] No property found for parcelId: ${parcelId}`);
  return null;
};

/**
 * Helper function to get all property details for a property given a parcelId.
 * This involves getting all fields from propertyAssessmentJoinUrl (layer 0) and adding
 * a historical property value field that contains the results from historicalPropertyDataLayerUrl.
 * Also returns geometry data for map generation.
 *
 * @param parcelId The parcel ID to search for.
 * @param fiscalYearAndQuarter Optional fiscal year and quarter for data filtering.
 * @return A property details object with all current fields plus historical values and geometry.
 */
export const fetchPropertyDetailsByParcelIdHelper = async (
  parcelId: string,
  fiscalYearAndQuarter?: { year: number; quarter: string }
): Promise<PropertyDetailsData & { geometry?: any }> => {
  console.log(`[EGISClient] Starting fetchPropertyDetailsByParcelId for parcelId: ${parcelId}`);

  if (fiscalYearAndQuarter) {
    console.log(`[EGISClient] Using fiscal year: ${fiscalYearAndQuarter.year}, quarter: ${fiscalYearAndQuarter.quarter}`);
  } else {
    console.log("[EGISClient] No fiscal year/quarter specified, using default data");
  }

  // Get geometry from the joined layer (layer 0)
  console.log(`[EGISClient] Fetching geometry for parcelId: ${parcelId} from propertyAssessmentJoinUrl`);
  const geometryQuery = `?where=PID='${parcelId}'&returnGeometry=true&outFields=PID&f=json`;
  console.log(`[EGISClient] Geometry query: ${geometryQuery}`);
  console.log(`[EGISClient] Full geometry URL: ${geomertricDataLayerUrl}/query${geometryQuery}`);
  let geometricDataFeatures: ArcGISFeature[] = [];
  let geometricData: any = null;

  try {
    console.log(`[EGISClient] Using geometry query: ${geometryQuery}`);
    geometricDataFeatures = await fetchEGISData(geomertricDataLayerUrl, geometryQuery);
    if (geometricDataFeatures.length > 0) {
      geometricData = geometricDataFeatures[0].geometry;
      console.log(`[EGISClient] Geometry found for parcelId: ${parcelId}`);
    }
  } catch (error) {
    console.log(`[EGISClient] Geometry query failed: ${geometryQuery}`, error);
  }

  console.log("[EGISClient] Geometry:", geometricData);

  // Get historical property values from layer 1
  console.log(`[EGISClient] Fetching historical property values for parcelId: ${parcelId}`);
  const historicalQuery = `?where=Parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;

  console.log(`[EGISClient] Historical data query: ${historicalQuery}`);
  console.log(`[EGISClient] Full historical data URL: ${valueHistoryDataLayerUrl}/query${historicalQuery}`);

  let valueHistoryFeatures: ArcGISFeature[] = [];
  try {
    console.log(`[EGISClient] Using historical data query: ${historicalQuery}`);
    valueHistoryFeatures = await fetchEGISData(valueHistoryDataLayerUrl, historicalQuery);
    console.log(`[EGISClient] Historical data found: ${valueHistoryFeatures.length} records`);
  } catch (error) {
    console.log(`[EGISClient] Historical data query failed: ${historicalQuery}`, error);
  }

  // Parse historical values
  const historicalValues: { [year: number]: number } = {};

  valueHistoryFeatures.forEach((feature: ArcGISFeature, index: number) => {
    const yearId = feature.attributes.fiscal_year;
    const assessedValue = feature.attributes.assessed_value;
    console.log(`[EGISClient] Historical feature ${index}: Fiscal_Year=${yearId}, Assessed_value=${assessedValue}`);
    if (yearId && assessedValue !== undefined) {
      historicalValues[yearId] = assessedValue;
    }
  });

  // Get owners from layer 3
  console.log(`[EGISClient] Fetching owners for parcelId: ${parcelId}`);
  let ownersQuery = `?where=parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;

  // Add fiscal year and quarter filtering if provided
  if (fiscalYearAndQuarter) {
    ownersQuery = `?where=parcel_id='${parcelId}' AND fiscal_year=${fiscalYearAndQuarter.year} AND quarter=${fiscalYearAndQuarter.quarter}&outFields=*&returnGeometry=false&f=json`;
  }

  console.log(`[EGISClient] Owners query: ${ownersQuery}`);
  console.log(`[EGISClient] Full owners URL: ${currentOwnersDataLayerUrl}/query${ownersQuery}`);

  let owners: string[] = ["Owner not available"];
  try {
    let currentOwnersFeatures = await fetchEGISData(currentOwnersDataLayerUrl, ownersQuery);

    // If no fiscal year/quarter specified, filter for highest
    if (!fiscalYearAndQuarter) {
      currentOwnersFeatures = filterForHighestFiscalYearAndQuarter(currentOwnersFeatures);
    }

    if (currentOwnersFeatures.length > 0) {
      owners = currentOwnersFeatures.map((feature: ArcGISFeature) => toCamelCase(feature.attributes.owner_name) || "").filter(Boolean);
    }
  } catch (error) {
    console.log(`[EGISClient] Owners query failed: ${ownersQuery}`, error);
  }

  console.log("[EGISClient] Owners:", owners);

  // Get residential property attributes data from layer 6
  console.log(`[EGISClient] Fetching residential property attributes for parcelId: ${parcelId}`);
  let residentialAttrsQuery = `?where=parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;

  // Add fiscal year and quarter filtering if provided
  if (fiscalYearAndQuarter) {
    residentialAttrsQuery = `?where=parcel_id='${parcelId}' AND fiscal_year=${fiscalYearAndQuarter.year} AND quarter=${fiscalYearAndQuarter.quarter}&outFields=*&returnGeometry=false&f=json`;
  }

  console.log(`[EGISClient] Residential attributes query: ${residentialAttrsQuery}`);
  console.log(`[EGISClient] Full residential attributes URL: ${residentialPropertyAttributesDataLayerUrl}/query${residentialAttrsQuery}`);

  let residentialPropertyFeatures: ArcGISFeature[] = [];
  try {
    residentialPropertyFeatures = await fetchEGISData(residentialPropertyAttributesDataLayerUrl, residentialAttrsQuery);
    console.log(`[EGISClient] Residential attributes data found: ${residentialPropertyFeatures.length} records`);

    // If no fiscal year/quarter specified, filter for highest
    if (!fiscalYearAndQuarter) {
      residentialPropertyFeatures = filterForHighestFiscalYearAndQuarter(residentialPropertyFeatures);
      console.log(`[EGISClient] After filtering, residential attributes data: ${residentialPropertyFeatures.length} records`);
    }
  } catch (error) {
    console.log(`[EGISClient] Residential attributes query failed: ${residentialAttrsQuery}`, error);
  }

  // Check if we have multiple residential features with different attributes
  const hasMultipleBuildings = residentialPropertyFeatures.length > 1 &&
    residentialPropertyFeatures.some((feature, i) => {
      if (i === 0) return false;
      const prev = residentialPropertyFeatures[i - 1].attributes;
      const curr = feature.attributes;
      const differences = [];

      // Compare all relevant attributes and track differences
      if (prev.composite_land_use !== curr.composite_land_use) differences.push("land_use");
      if (prev.gross_area !== curr.gross_area) differences.push("gross_area");
      if (prev.building_style !== curr.building_style) differences.push("style");
      if (prev.story_height !== curr.story_height) differences.push("story_height");
      if (prev.floor !== curr.floor) differences.push("floor");
      if (prev.penthouse_unit !== curr.penthouse_unit) differences.push("penthouse");
      if (prev.orientation !== curr.orientation) differences.push("orientation");
      if (prev.bedrooms !== curr.bedrooms) differences.push("bedrooms");
      if (prev.full_bath !== curr.full_bath) differences.push("full_bath");
      if (prev.half_bath !== curr.half_bath) differences.push("half_bath");
      if (prev.bath_style_1 !== curr.bath_style_1) differences.push("bath_style_1");
      if (prev.bath_style_2 !== curr.bath_style_2) differences.push("bath_style_2");
      if (prev.bath_style_3 !== curr.bath_style_3) differences.push("bath_style_3");
      if (prev.kitchens !== curr.kitchens) differences.push("kitchens");
      if (prev.kitchen_type !== curr.kitchen_type) differences.push("kitchen_type");
      if (prev.kitchen_style_1 !== curr.kitchen_style_1) differences.push("kitchen_style_1");
      if (prev.kitchen_style_2 !== curr.kitchen_style_2) differences.push("kitchen_style_2");
      if (prev.kitchen_style_3 !== curr.kitchen_style_3) differences.push("kitchen_style_3");
      if (prev.year_built !== curr.year_built) differences.push("year_built");
      if (prev.exterior_finish !== curr.exterior_finish) differences.push("exterior_finish");
      if (prev.exterior_condition !== curr.exterior_condition) differences.push("exterior_condition");
      if (prev.roof_cover !== curr.roof_cover) differences.push("roof_cover");
      if (prev.roof_structure !== curr.roof_structure) differences.push("roof_structure");
      if (prev.foundation !== curr.foundation) differences.push("foundation");
      if (prev.num_of_parking_spots !== curr.num_of_parking_spots) differences.push("parking");
      if (prev.heat_type !== curr.heat_type) differences.push("heat");
      if (prev.ac_type !== curr.ac_type) differences.push("ac");
      if (prev.fireplaces !== curr.fireplaces) differences.push("fireplaces");

      // Log comparison details
      if (differences.length > 0) {
        console.log(`[EGISClient] Found differences between features ${i-1} and ${i}:`, {
          differences,
          feature1: {
            id: residentialPropertyFeatures[i-1].attributes.OBJECTID,
            landUse: prev.composite_land_use,
            grossArea: prev.gross_area,
            style: prev.building_style,
            bedrooms: prev.bedrooms,
            baths: `${prev.full_bath}/${prev.half_bath}`,
            kitchens: prev.kitchens,
          },
          feature2: {
            id: curr.OBJECTID,
            landUse: curr.composite_land_use,
            grossArea: curr.gross_area,
            style: curr.building_style,
            bedrooms: curr.bedrooms,
            baths: `${curr.full_bath}/${curr.half_bath}`,
            kitchens: curr.kitchens,
          },
        });
      }

      return differences.length > 0;
    });
  console.log("[EGISClient] Multiple buildings check:", {
    hasMultipleBuildings,
    count: residentialPropertyFeatures.length,
    features: residentialPropertyFeatures.map((f) => f.attributes.OBJECTID),
  });

  // Get the primary residential attributes (first building or only building)
  const primaryResidentialAttrs = residentialPropertyFeatures[0]?.attributes || {};

  // Prepare building attributes if we have multiple residential features
  const buildingAttrs = hasMultipleBuildings ?
    residentialPropertyFeatures.map((feature: ArcGISFeature, index: number) => ({
      buildingNumber: index + 1,
      landUse: parseAfterDash(feature.attributes.composite_land_use),
      grossArea: feature.attributes.gross_area,
      style: toProperCase(parseAfterDash(feature.attributes.building_style)),
      storyHeight: toProperCase(feature.attributes.story_height),
      floor: toProperCase(feature.attributes.floor),
      penthouseUnit: toProperCase(feature.attributes.penthouse_unit),
      orientation: toProperCase(feature.attributes.orientation),
      bedroomNumber: feature.attributes.bedrooms,
      totalBathrooms: feature.attributes.full_bath,
      halfBathrooms: feature.attributes.half_bath,
      bathStyle1: toProperCase(parseAfterDash(feature.attributes.bath_style_1)),
      bathStyle2: toProperCase(parseAfterDash(feature.attributes.bath_style_2)),
      bathStyle3: toProperCase(parseAfterDash(feature.attributes.bath_style_3)),
      numberOfKitchens: feature.attributes.kitchens,
      kitchenType: toProperCase(parseAfterDash(feature.attributes.kitchen_type)),
      kitchenStyle1: toProperCase(parseAfterDash(feature.attributes.kitchen_style_1)),
      kitchenStyle2: toProperCase(parseAfterDash(feature.attributes.kitchen_style_2)),
      kitchenStyle3: toProperCase(parseAfterDash(feature.attributes.kitchen_style_3)),
      yearBuilt: feature.attributes.year_built,
      exteriorFinish: toProperCase(parseAfterDash(feature.attributes.exterior_finish)),
      exteriorCondition: toProperCase(parseAfterDash(feature.attributes.exterior_condition)),
      roofCover: toProperCase(parseAfterDash(feature.attributes.roof_cover)),
      roofStructure: toProperCase(parseAfterDash(feature.attributes.roof_structure)),
      foundation: toProperCase(parseAfterDash(feature.attributes.foundation)),
      parkingSpots: feature.attributes.num_of_parking_spots,
      heatType: toProperCase(parseAfterDash(feature.attributes.heat_type)),
      acType: toProperCase(parseAfterDash(feature.attributes.ac_type)),
      fireplaces: feature.attributes.fireplaces,
    })) :
    undefined;

  console.log("[EGISClient] Residential attributes:", {
    hasMultipleBuildings,
    count: residentialPropertyFeatures.length,
    primaryAttributes: primaryResidentialAttrs,
    buildingAttributes: buildingAttrs,
  });

  // Get condo attributes data from layer 9
  console.log(`[EGISClient] Fetching condo attributes for parcelId: ${parcelId}`);
  let condoAttrsQuery = `?where=parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;

  // Add fiscal year and quarter filtering if provided
  if (fiscalYearAndQuarter) {
    condoAttrsQuery = `?where=parcel_id='${parcelId}' AND fiscal_year=${fiscalYearAndQuarter.year} AND quarter=${fiscalYearAndQuarter.quarter}&outFields=*&returnGeometry=false&f=json`;
  }

  console.log(`[EGISClient] Condo attributes query: ${condoAttrsQuery}`);
  console.log(`[EGISClient] Full condo attributes URL: ${condoAttributesDataLayerUrl}/query${condoAttrsQuery}`);

  let condoAttributesFeatures: ArcGISFeature[] = [];
  try {
    condoAttributesFeatures = await fetchEGISData(condoAttributesDataLayerUrl, condoAttrsQuery);
    console.log(`[EGISClient] Condo attributes data found: ${condoAttributesFeatures.length} records`);

    // If no fiscal year/quarter specified, filter for highest
    if (!fiscalYearAndQuarter) {
      condoAttributesFeatures = filterForHighestFiscalYearAndQuarter(condoAttributesFeatures);
      console.log(`[EGISClient] After filtering, condo attributes data: ${condoAttributesFeatures.length} records`);
    }
  } catch (error) {
    console.log(`[EGISClient] Condo attributes query failed: ${condoAttrsQuery}`, error);
  }

  const condoAttrs = condoAttributesFeatures[0]?.attributes || {};
  console.log("[EGISClient] Condo attributes:", condoAttrs);

  // Get outbuildings data from layer 10
  console.log(`[EGISClient] Fetching outbuildings for parcelId: ${parcelId}`);
  let outbuildingsQuery = `?where=parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;

  // Add fiscal year and quarter filtering if provided
  if (fiscalYearAndQuarter) {
    outbuildingsQuery = `?where=parcel_id='${parcelId}' AND fiscal_year=${fiscalYearAndQuarter.year} AND quarter=${fiscalYearAndQuarter.quarter}&outFields=*&returnGeometry=false&f=json`;
  }

  console.log(`[EGISClient] Outbuildings query: ${outbuildingsQuery}`);
  console.log(`[EGISClient] Full outbuildings URL: ${outbuildingsDataLayerUrl}/query${outbuildingsQuery}`);

  let outbuildingsFeatures: ArcGISFeature[] = [];
  try {
    outbuildingsFeatures = await fetchEGISData(outbuildingsDataLayerUrl, outbuildingsQuery);
    console.log(`[EGISClient] Outbuildings data found: ${outbuildingsFeatures.length} records`);

    // If no fiscal year/quarter specified, filter for highest
    if (!fiscalYearAndQuarter) {
      outbuildingsFeatures = filterForHighestFiscalYearAndQuarter(outbuildingsFeatures);
      console.log(`[EGISClient] After filtering, outbuildings data: ${outbuildingsFeatures.length} records`);
    }
  } catch (error) {
    console.log(`[EGISClient] Outbuildings query failed: ${outbuildingsQuery}`, error);
  }

  // Process outbuildings data
  const outbuildingAttrs = outbuildingsFeatures.map((feature) => ({
    type: toProperCase(parseAfterDash(feature.attributes.code)),
    size: feature.attributes.tot_units,
    quality: toProperCase(parseAfterDash(feature.attributes.quality)),
    condition: toProperCase(parseAfterDash(feature.attributes.condition)),
  }));

  // Get exemption data from exemptionDataLayerUrl
  console.log(`[EGISClient] Fetching exemption data for parcelId: ${parcelId}`);
  let propertyWebAppQuery = `?where=parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;

  // Add fiscal year and quarter filtering if provided
  if (fiscalYearAndQuarter) {
    propertyWebAppQuery = `?where=parcel_id='${parcelId}' AND fiscal_year=${fiscalYearAndQuarter.year} AND quarter=${fiscalYearAndQuarter.quarter}&outFields=*&returnGeometry=false&f=json`;
  }

  console.log(`[EGISClient] Property web app data query: ${propertyWebAppQuery}`);
  console.log(`[EGISClient] Full property web app data URL: ${propertiesWebAppDataLayerUrl}/query${propertyWebAppQuery}`);

  let propertyWebAppFeatures: ArcGISFeature[] = [];
  try {
    propertyWebAppFeatures = await fetchEGISData(propertiesWebAppDataLayerUrl, propertyWebAppQuery);
    console.log(`[EGISClient] Property web app data found: ${propertyWebAppFeatures.length} records`);

    // If no fiscal year/quarter specified, filter for highest
    if (!fiscalYearAndQuarter) {
      propertyWebAppFeatures = filterForHighestFiscalYearAndQuarter(propertyWebAppFeatures);
      console.log(`[EGISClient] After filtering, property web app data: ${propertyWebAppFeatures.length} records`);
    }
  } catch (error) {
    console.log(`[EGISClient] Property web app query failed: ${propertyWebAppQuery}`, error);
  }

  console.log("[EGISClient] Property web app features:", propertyWebAppFeatures);

  const propertyWebAppData = propertyWebAppFeatures[0]?.attributes || {};

  console.log("[EGISClient] Property web app data:", propertyWebAppData);

  // Helper function to extract master parcel ID from apartment complex identifier
  const extractMasterParcelId = (complexIdentifier: string | undefined): string | undefined => {
    if (!complexIdentifier || !complexIdentifier.trim()) return undefined;
    // Split by space or special characters and take the first part
    const match = complexIdentifier.match(/^[A-Za-z0-9]+/);
    const result = match ? match[0] : undefined;
    console.log("[EGISClient] Master parcel ID:", result);
    return result;
  };

  // Check if this unit belongs to an apartment complex (has non-empty complex field)
  const isPartOfComplex = !!condoAttrs?.complex?.trim();
  const masterParcelId = isPartOfComplex ? extractMasterParcelId(condoAttrs.complex) : undefined;

  // Log property structure and layout decision
  const layout = residentialPropertyFeatures.length > 1 ? "multiple_buildings" :
    isPartOfComplex ? "condo_unit_split" :
      "standard";
  console.log("[EGISClient] Property layout:", {
    layout,
    buildings: residentialPropertyFeatures.length,
    complex: {
      field: condoAttrs?.complex || "",
      id: masterParcelId,
    },
  });

  const condoMainAttributes = isPartOfComplex ? {
    masterParcelId,
    grade: condoAttrs.grade,
    exteriorCondition: toProperCase(parseAfterDash(condoAttrs.exterior_condition)),
    exteriorFinish: toProperCase(parseAfterDash(condoAttrs.exterior_finish)),
    foundation: toProperCase(parseAfterDash(condoAttrs.foundation)),
    roofCover: toProperCase(parseAfterDash(condoAttrs.roof_cover)),
    roofStructure: toProperCase(parseAfterDash(condoAttrs.roof_structure)),
  } : {};


  // Compose the final object
  console.log("[EGISClient] Constructing PropertyDetails with:", {
    layout,
    hasMultipleBuildings,
    buildingAttrsCount: buildingAttrs?.length,
    isPartOfComplex,
  });

  console.log("[EGISClient] Final data structure:", {
    layout,
    hasMultipleBuildings,
    isPartOfComplex,
    buildingCount: buildingAttrs?.length,
    outbuildingCount: outbuildingAttrs?.length,
    residentialFeatures: residentialPropertyFeatures.map((f) => ({
      id: f.attributes.OBJECTID,
      landUse: f.attributes.composite_land_use,
      grossArea: f.attributes.gross_area,
      style: f.attributes.building_style,
      bedrooms: f.attributes.bedrooms,
      baths: `${f.attributes.full_bath}/${f.attributes.half_bath}`,
      kitchens: f.attributes.kitchens,
    })),
    condoData: condoAttrs ? {
      complex: condoAttrs.complex,
      masterParcelId,
    } : undefined,
  });

  const propertyDetails = new PropertyDetails({
    hasComplexCondoData: layout === "condo_unit_split",
    buildingAttributes: hasMultipleBuildings ? buildingAttrs : undefined,
    outbuildingAttributes: outbuildingAttrs,
    ...condoMainAttributes,
    // Overview fields
    fullAddress: constructFullAddress(propertyWebAppData),
    owners: owners,
    imageSrc: "", // Not applicable for EGIS data
    assessedValue: propertyWebAppData.total_value || 0,
    propertyType: toProperCase(propertyWebAppData.property_type) || "Not available",
    parcelId: parcelId,
    propertyNetTax: propertyWebAppData.net_tax || 0,
    personalExemptionFlag: propertyWebAppData.personal_exemption_flag,
    residentialExemptionFlag: propertyWebAppData.residential_exemption_flag,
    totalBilledAmount: propertyWebAppData.total_billed_amt || 0,
    // Property Value fields
    historicPropertyValues: historicalValues,
    // Property Attributes fields
    landUse: prioritizeValue(parseAfterDash(primaryResidentialAttrs.composite_land_use), parseAfterDash(condoAttrs.composite_land_use), parseAfterDash(propertyWebAppData.land_use)) || "Not available",
    grossArea: propertyWebAppData.gross_area || "Not available",
    style: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.building_style)), toProperCase(parseAfterDash(condoAttrs.building_style)), toProperCase(parseAfterDash(propertyWebAppData.building_style))) || "Not available",
    storyHeight: prioritizeValue(toProperCase(primaryResidentialAttrs.story_height), toProperCase(condoAttrs.story_height), toProperCase(propertyWebAppData.story_height)) || "Not available",
    floor: prioritizeValue(toProperCase(primaryResidentialAttrs.floor), toProperCase(condoAttrs.floor), toProperCase(propertyWebAppData.floor)) || undefined,
    penthouseUnit: prioritizeValue(toProperCase(primaryResidentialAttrs.penthouse_unit), toProperCase(condoAttrs.penthouse_unit), toProperCase(propertyWebAppData.penthouse_unit)) || undefined,
    orientation: prioritizeValue(toProperCase(primaryResidentialAttrs.orientation), toProperCase(condoAttrs.orientation), toProperCase(propertyWebAppData.orientation)) || undefined,
    bedroomNumber: prioritizeValue(primaryResidentialAttrs.bedrooms, condoAttrs.bedrooms, propertyWebAppData.bedrooms) || undefined,
    totalBathrooms: (() => {
      const residentialFullBath = primaryResidentialAttrs.full_bath;
      const residentialHalfBath = primaryResidentialAttrs.half_bath;
      const condoFullBath = condoAttrs.full_bath;
      const condoHalfBath = condoAttrs.half_bath;
      const propertyWebAppFullBath = propertyWebAppData.full_bathrooms;
      const propertyWebAppHalfBath = propertyWebAppData.half_bathrooms;

      const fullBath = prioritizeValue(residentialFullBath, condoFullBath, propertyWebAppFullBath);
      const halfBath = prioritizeValue(residentialHalfBath, condoHalfBath, propertyWebAppHalfBath);

      if (fullBath !== undefined && halfBath !== undefined) {
        return String(Number(fullBath) + Number(halfBath) * 0.5);
      }
      return undefined;
    })(),
    halfBathrooms: prioritizeValue(primaryResidentialAttrs.half_bath, condoAttrs.half_bath, propertyWebAppData.half_bathrooms) || undefined,
    bathStyle1: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.bath_style_1)), toProperCase(parseAfterDash(condoAttrs.bath_style_1)), toProperCase(parseAfterDash(propertyWebAppData.bath_style_1))) || undefined,
    bathStyle2: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.bath_style_2)), toProperCase(parseAfterDash(condoAttrs.bath_style_2)), toProperCase(parseAfterDash(propertyWebAppData.bath_style_2))) || undefined,
    bathStyle3: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.bath_style_3)), toProperCase(parseAfterDash(condoAttrs.bath_style_3)), toProperCase(parseAfterDash(propertyWebAppData.bath_style_3))) || undefined,
    numberOfKitchens: prioritizeValue(primaryResidentialAttrs.kitchens, condoAttrs.kitchens, propertyWebAppData.kitchens) || undefined,
    kitchenType: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.kitchen_type)), toProperCase(parseAfterDash(condoAttrs.kitchen_type)), toProperCase(parseAfterDash(propertyWebAppData.kitchen_type))) || undefined,
    kitchenStyle1: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.kitchen_style_1)), toProperCase(parseAfterDash(condoAttrs.kitchen_style_1)), toProperCase(parseAfterDash(propertyWebAppData.kitchen_style_1))) || undefined,
    kitchenStyle2: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.kitchen_style_2)), toProperCase(parseAfterDash(condoAttrs.kitchen_style_2)), toProperCase(parseAfterDash(propertyWebAppData.kitchen_style_2))) || undefined,
    kitchenStyle3: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.kitchen_style_3)), toProperCase(parseAfterDash(condoAttrs.kitchen_style_3)), toProperCase(parseAfterDash(propertyWebAppData.kitchen_style_3))) || undefined,
    yearBuilt: prioritizeValue(primaryResidentialAttrs.year_built, condoAttrs.year_built, propertyWebAppData.year_built) || undefined,
    exteriorFinish: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.exterior_finish)), toProperCase(parseAfterDash(condoAttrs.exterior_finish)), toProperCase(parseAfterDash(propertyWebAppData.exterior_finish))) || undefined,
    exteriorCondition: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.exterior_condition)), toProperCase(parseAfterDash(condoAttrs.exterior_condition)), toProperCase(parseAfterDash(propertyWebAppData.exterior_condition))) || undefined,
    roofCover: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.roof_cover)), toProperCase(parseAfterDash(condoAttrs.roof_cover)), toProperCase(parseAfterDash(propertyWebAppData.roof_cover))) || undefined,
    roofStructure: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.roof_structure)), toProperCase(parseAfterDash(condoAttrs.roof_structure)), toProperCase(parseAfterDash(propertyWebAppData.roof_structure))) || undefined,
    foundation: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.foundation)), toProperCase(parseAfterDash(condoAttrs.foundation)), toProperCase(parseAfterDash(propertyWebAppData.foundation))) || "Not available",
    parkingSpots: prioritizeValue(primaryResidentialAttrs.num_of_parking_spots, condoAttrs.num_of_parking_spots, propertyWebAppData.num_parking_spots) || undefined,
    heatType: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.heat_type)), toProperCase(parseAfterDash(condoAttrs.heat_type)), toProperCase(parseAfterDash(propertyWebAppData.heat_type))) || undefined,
    acType: prioritizeValue(toProperCase(parseAfterDash(primaryResidentialAttrs.ac_type)), toProperCase(parseAfterDash(condoAttrs.ac_type)), toProperCase(parseAfterDash(propertyWebAppData.ac_type))) || undefined,
    fireplaces: prioritizeValue(primaryResidentialAttrs.fireplaces, condoAttrs.fireplaces, propertyWebAppData.fireplaces) || undefined,
    salePrice: undefined,
    saleDate: propertyWebAppData.latest_sale_date || undefined,
    registryBookAndPlace: undefined,
    // Property Taxes fields
    propertyGrossTax: propertyWebAppData.gross_tax || 0,
    residentialExemptionAmount: propertyWebAppData.resexempt || 0, // TODO: cast to number
    personalExemptionAmount: propertyWebAppData.persexempt_total|| 0,
    communityPreservationAmount: propertyWebAppData.cpa_amt || 0,
    personalExemptionAmount1: propertyWebAppData.persexempt_1 || 0,
    personalExemptionAmount2: propertyWebAppData.persexempt_2 || 0,
    estimatedTotalFirstHalf: propertyWebAppData.re_tax_amt || 0,
  });

  console.log(`[EGISClient] Property details completed for parcelId: ${parcelId}. Historical values count: ${Object.keys(historicalValues).length}`);

  // Return both property details and geometry
  return {
    ...propertyDetails,
    geometry: geometricData,
  };
};

/**
 * Helper function to generate static map image for a property using existing geometry data.
 * This avoids making an additional API call since we already have the geometry from the property details call.
 *
 * @param parcelId The parcel ID for logging purposes.
 * @param geometry The geometry data from the property details call.
 * @return A Buffer containing the PNG image data.
 */
export const generatePropertyStaticMapImageFromGeometryHelper = async (parcelId: string, geometry: any): Promise<Buffer> => {
  console.log(`[EGISClient] Starting generatePropertyStaticMapImageFromGeometry for parcelId: ${parcelId}`);

  try {
    if (!geometry || !geometry.rings) {
      console.log(`[EGISClient] No valid geometry provided for parcelId: ${parcelId}`);
      throw new Error(`No valid geometry provided for parcelId: ${parcelId}`);
    }

    console.log("[EGISClient] Geometry spatial reference:", geometry.spatialReference);
    console.log("[EGISClient] Geometry rings count:", geometry.rings.length);

    // Calculate bounding box from the geometry rings
    let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;

    geometry.rings.forEach((ring: number[][], ringIndex: number) => {
      console.log(`[EGISClient] Processing ring ${ringIndex} with ${ring.length} points`);
      ring.forEach(([x, y], pointIndex: number) => {
        if (pointIndex < 5) { // Log first 5 points for debugging
          console.log(`[EGISClient] Point ${pointIndex}: (${x}, ${y})`);
        }
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    });

    // Validate bounding box values
    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
      throw new Error(`Invalid bounding box calculated: minX=${minX}, minY=${minY}, maxX=${maxX}, maxY=${maxY}`);
    }

    // Add padding to the bounding box (40% on each side for 2x zoom out)
    const paddingX = Math.max((maxX - minX) * 0.4, 100); // Minimum 100 units padding
    const paddingY = Math.max((maxY - minY) * 0.4, 100);

    const bbox = [
      minX - paddingX,
      minY - paddingY,
      maxX + paddingX,
      maxY + paddingY,
    ];

    console.log(`[EGISClient] Calculated bounding box: [${bbox.join(", ")}]`);

    // Try different export configurations
    const exportConfigs = [
      {
        bboxSR: "2249",
        imageSR: "2249",
        size: "512,512",
        layers: "0",
        description: "MA State Plane, layers=0, 512x512",
      },
      {
        bboxSR: "2249",
        imageSR: "2249",
        size: "512,512",
        layers: "show:0",
        description: "MA State Plane, layers=show:0, 512x512",
      },
      {
        bboxSR: "2249",
        imageSR: "2249",
        size: "512,512",
        layers: "0",
        format: "jpg",
        description: "MA State Plane, JPG format, 512x512",
      },
      {
        bboxSR: "2249",
        imageSR: "2249",
        size: "512,512",
        layers: "0",
        format: "png",
        transparent: "true",
        description: "MA State Plane, transparent PNG, 512x512",
      },
    ];

    for (const config of exportConfigs) {
      try {
        console.log(`[EGISClient] Trying export config: ${config.description}`);

        const exportUrl = `${geomertricDataLayerUrl.replace("/0", "")}/export`;
        const exportParams = new URLSearchParams({
          bbox: bbox.join(","),
          bboxSR: config.bboxSR,
          imageSR: config.imageSR,
          size: config.size,
          layers: config.layers,
          format: config.format || "png",
          transparent: config.transparent || "false",
          f: "image",
        });

        const fullExportUrl = `${exportUrl}?${exportParams.toString()}`;
        console.log(`[EGISClient] Requesting static map image from: ${fullExportUrl}`);

        const response = await fetch(fullExportUrl);

        if (response.ok) {
          // Get the image data as ArrayBuffer and convert to Buffer
          const imageArrayBuffer = await response.arrayBuffer();
          const imageBuffer = Buffer.from(imageArrayBuffer);

          console.log(`[EGISClient] Successfully generated static map image for parcelId: ${parcelId}, size: ${imageBuffer.length} bytes using config: ${config.description}`);
          return imageBuffer;
        } else {
          // Try to get the error details from the response
          let errorDetails = "";
          try {
            const errorText = await response.text();
            errorDetails = ` - ${errorText}`;
          } catch (e) {
            errorDetails = " - Could not read error details";
          }
          console.log(`[EGISClient] Export failed with config ${config.description}: ${response.status} ${response.statusText}${errorDetails}`);
        }
      } catch (configError) {
        console.log(`[EGISClient] Export error with config ${config.description}:`, configError);
      }
    }

    // If all configs fail, throw an error
    throw new Error(`Failed to generate static map image with all coordinate system configurations for parcelId: ${parcelId}`);
  } catch (error) {
    console.error(`[EGISClient] Error generating static map image for parcelId: ${parcelId}:`, error);
    throw error;
  }
};

/**
 * Helper function to generate static map image for a property given a parcelId.
 * Uses propertyAssessmentJoinUrl (layer 0) with query at:
 * https://gisportal.boston.gov/arcgis/rest/services/Assessing/Assessing_Online_data/MapServer/0/query
    ?where=PID='{parcelId}'
    &returnGeometry=true
    &outFields=PID
    &f=json
 * to get the bounding box and spatial reference of the property.
 * The uses the export query to get the static map image:
 * https://gisportal.boston.gov/arcgis/rest/services/Assessing/Assessing_Online_data/MapServer/export
    ?bbox=736200,2905200,736500,2905400
    &bboxSR=2249
    &imageSR=3857
    &size=800,600
    &layers=show:0
    &format=png
    &transparent=false
    &f=image
 * to get the static map image in binary png format.
 *
 * @param parcelId The parcel ID to search for.
 * @return A Buffer containing the PNG image data.
 */
export const fetchPropertyStaticMapImageByParcelIdHelper = async (parcelId: string): Promise<Buffer> => {
  console.log(`[EGISClient] Starting fetchPropertyStaticMapImageByParcelId for parcelId: ${parcelId}`);

  try {
    // First, let's check the map service information to understand available layers
    console.log("[EGISClient] Checking map service information...");
    const serviceInfoUrl = `${baseUrl}/0?f=json`;
    const serviceInfoResponse = await fetch(serviceInfoUrl);
    if (serviceInfoResponse.ok) {
      const serviceInfo = await serviceInfoResponse.json();
      console.log("[EGISClient] Map service layers:", serviceInfo.layers?.map((l: any) => ({id: l.id, name: l.name})));
    }

    // Get the property geometry to determine the bounding box
    const geometryQuery = `?where=PID='${parcelId}'&returnGeometry=true&outFields=PID&f=json`;

    let geometryFeatures: ArcGISFeature[] = [];
    try {
      console.log(`[EGISClient] Static map geometry query: ${geometryQuery}`);
      console.log(`[EGISClient] Full static map geometry URL: ${geomertricDataLayerUrl}/query${geometryQuery}`);

      geometryFeatures = await fetchEGISData(geomertricDataLayerUrl, geometryQuery);
      console.log(`[EGISClient] Geometry data found: ${geometryFeatures.length} records`);
    } catch (error) {
      console.log(`[EGISClient] Geometry query failed: ${geometryQuery}`, error);
      throw new Error(`No property geometry found for parcelId: ${parcelId}`);
    }

    if (geometryFeatures.length === 0) {
      console.log(`[EGISClient] No property geometry found for parcelId: ${parcelId}`);
      throw new Error(`No property geometry found for parcelId: ${parcelId}`);
    }

    const feature = geometryFeatures[0];
    const geometry = feature.geometry;

    if (!geometry || !geometry.rings) {
      console.log(`[EGISClient] No valid geometry found for parcelId: ${parcelId}`);
      throw new Error(`No valid geometry found for parcelId: ${parcelId}`);
    }

    console.log("[EGISClient] Geometry spatial reference:", geometry.spatialReference);
    console.log("[EGISClient] Geometry rings count:", geometry.rings.length);

    // Calculate bounding box from the geometry rings
    let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;

    geometry.rings.forEach((ring: number[][], ringIndex: number) => {
      console.log(`[EGISClient] Processing ring ${ringIndex} with ${ring.length} points`);
      ring.forEach(([x, y], pointIndex: number) => {
        if (pointIndex < 5) { // Log first 5 points for debugging
          console.log(`[EGISClient] Point ${pointIndex}: (${x}, ${y})`);
        }
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    });

    // Validate bounding box values
    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
      throw new Error(`Invalid bounding box calculated: minX=${minX}, minY=${minY}, maxX=${maxX}, maxY=${maxY}`);
    }

    // Add padding to the bounding box (40% on each side for 2x zoom out)
    const paddingX = Math.max((maxX - minX) * 0.4, 100); // Minimum 100 units padding
    const paddingY = Math.max((maxY - minY) * 0.4, 100);

    const bbox = [
      minX - paddingX,
      minY - paddingY,
      maxX + paddingX,
      maxY + paddingY,
    ];

    console.log(`[EGISClient] Calculated bounding box: [${bbox.join(", ")}]`);

    // Try different export configurations
    const exportConfigs = [
      {
        bboxSR: "2249",
        imageSR: "2249",
        size: "512,512",
        layers: "0",
        description: "MA State Plane, layers=0, 512x512",
      },
      {
        bboxSR: "2249",
        imageSR: "2249",
        size: "512,512",
        layers: "show:0",
        description: "MA State Plane, layers=show:0, 512x512",
      },
      {
        bboxSR: "2249",
        imageSR: "2249",
        size: "512,512",
        layers: "0",
        format: "jpg",
        description: "MA State Plane, JPG format, 512x512",
      },
      {
        bboxSR: "2249",
        imageSR: "2249",
        size: "512,512",
        layers: "0",
        format: "png",
        transparent: "true",
        description: "MA State Plane, transparent PNG, 512x512",
      },
    ];

    for (const config of exportConfigs) {
      try {
        console.log(`[EGISClient] Trying export config: ${config.description}`);

        const exportUrl = `${geomertricDataLayerUrl.replace("/0", "")}/export`;
        const exportParams = new URLSearchParams({
          bbox: bbox.join(","),
          bboxSR: config.bboxSR,
          imageSR: config.imageSR,
          size: config.size,
          layers: config.layers,
          format: config.format || "png",
          transparent: config.transparent || "false",
          f: "image",
        });

        const fullExportUrl = `${exportUrl}?${exportParams.toString()}`;
        console.log(`[EGISClient] Requesting static map image from: ${fullExportUrl}`);

        const response = await fetch(fullExportUrl);

        if (response.ok) {
          // Get the image data as ArrayBuffer and convert to Buffer
          const imageArrayBuffer = await response.arrayBuffer();
          const imageBuffer = Buffer.from(imageArrayBuffer);

          console.log(`[EGISClient] Successfully generated static map image for parcelId: ${parcelId}, size: ${imageBuffer.length} bytes using config: ${config.description}`);
          return imageBuffer;
        } else {
          // Try to get the error details from the response
          let errorDetails = "";
          try {
            const errorText = await response.text();
            errorDetails = ` - ${errorText}`;
          } catch (e) {
            errorDetails = " - Could not read error details";
          }
          console.log(`[EGISClient] Export failed with config ${config.description}: ${response.status} ${response.statusText}${errorDetails}`);
        }
      } catch (configError) {
        console.log(`[EGISClient] Export error with config ${config.description}:`, configError);
      }
    }

    // If all configs fail, throw an error
    throw new Error(`Failed to generate static map image with all coordinate system configurations for parcelId: ${parcelId}`);
  } catch (error) {
    console.error(`[EGISClient] Error generating static map image for parcelId: ${parcelId}:`, error);
    throw error;
  }
};

