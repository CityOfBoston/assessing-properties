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
    return { year, quarter: "3" };
  }
  
  // If date is on or after July 1st (month >= 6), return next year with quarter 1
  return { year: year + 1, quarter: "1" };
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
//const outbuildingsDataLayerUrl = `${baseUrl}/10`;


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
  console.log(`[EGISClient] Sample feature attributes:`, features[0]?.attributes);
  
  // Debug: Log all fiscal years and quarters present
  const fiscalYears = features.map(f => f.attributes.fiscal_year).filter(Boolean);
  const quarters = features.map(f => f.attributes.quarter).filter(Boolean);
  console.log(`[EGISClient] Fiscal years found:`, [...new Set(fiscalYears)]);
  console.log(`[EGISClient] Quarters found:`, [...new Set(quarters)]);
  
  // Find the highest fiscal year
  const maxYear = Math.max(...features.map(f => f.attributes.fiscal_year || 0));
  console.log(`[EGISClient] Highest fiscal year:`, maxYear);
  
  // Filter to only the highest year
  const maxYearFeatures = features.filter(f => f.attributes.fiscal_year === maxYear);
  console.log(`[EGISClient] Features with highest fiscal year (${maxYear}):`, maxYearFeatures.length);
  
  if (maxYearFeatures.length === 0) return features;
  
  // Find the highest quarter within the highest year
  const maxQuarter = Math.max(...maxYearFeatures.map(f => parseInt(f.attributes.quarter) || 0));
  console.log(`[EGISClient] Highest quarter in year ${maxYear}:`, maxQuarter);
  
  // Filter to only the highest quarter within the highest year
  const result = maxYearFeatures.filter(f => parseInt(f.attributes.quarter) === maxQuarter);
  
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
  const isValid = (v: any) => v !== null && v !== undefined && (typeof v === 'number' ? true : v !== '');
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
  const stNum = attrs.street_number ? String(attrs.street_number).trim() : '';
  const stNumSuffix = attrs.street_number_suffix ? String(attrs.street_number_suffix).trim() : '';
  const stName = attrs.street_name ? toProperCase(String(attrs.street_name).trim()) : '';
  const unitNum = attrs.apt_unit ? String(attrs.apt_unit).trim() : '';
  const city = attrs.city ? toProperCase(String(attrs.city).trim()) : '';
  const zip = attrs.location_zip_code ? String(attrs.location_zip_code).trim() : '';

  // Compose street number (may be a range)
  let fullStreetNumber = stNum;
  if (stNumSuffix && stNumSuffix !== stNum) {
    fullStreetNumber = `${stNum}-${stNumSuffix}`;
  }

  // Compose street address
  let address = fullStreetNumber;
  if (stName) address += (address ? ' ' : '') + stName;
  if (unitNum) address += ` #${unitNum}`;
  // Always add comma before city if city is present
  if (city) address += `, ${city}`;
  if (zip) address += `, ${zip}`;

  return address || 'Address not available';
}

// Basic proper case function for text
function toProperCase(str: string | undefined): string {
  if (!str) return '';
  
  // If all uppercase and short (likely an abbreviation), keep as is
  if (/^[A-Z0-9 .,'&-]+$/.test(str) && str.length <= 6) return str;
  
  // Basic proper case
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// Simple function to format owner names - just reorder and proper case
function formatOwnerName(str: string | undefined): string {
  if (!str) return '';
  
  // If all uppercase and short (likely an abbreviation), keep as is
  if (/^[A-Z0-9 .,'&-]+$/.test(str) && str.length <= 6) return str;
  
  // If contains space but no comma or ampersand, assume it's a simple last name + first name format
  if (str.includes(' ') && !/[,&]/.test(str)) {
    const words = str.trim().split(/\s+/);
    if (words.length === 2) { // If exactly two words, assume last name + first name
      const [lastName, firstName] = words;
      // Convert to "Firstname Lastname" format with proper case
      const result = `${firstName} ${lastName}`;
      return toProperCase(result);
    }
    if (words.length === 3) { // Handle middle names/initials
      const [lastName, firstName, middleName] = words;
      // If middle part looks like an initial (1-2 chars), keep it uppercase
      if (middleName.length <= 2) {
        const result = `${firstName} ${middleName} ${lastName}`;
        return toProperCase(result).replace(new RegExp(`\\b${middleName}\\b`, 'i'), middleName.toUpperCase());
      }
      // Otherwise treat as first, middle, last
      const result = `${firstName} ${middleName} ${lastName}`;
      return toProperCase(result);
    }
  }
  
  // For anything else (business names, complex names), just do proper case
  return toProperCase(str);
}

/**
 * Helper to parse a string like 'XXX - XXXXXX XXX XXXX' and return the portion after the last ' - '.
 * If the format is not matched, returns the original string trimmed. Handles null/undefined/empty gracefully.
 * Also applies proper case formatting to the result.
 * @param value The input string
 * @returns The portion after the last ' - ', or the original string trimmed, with proper case applied
 */
export function parseAfterDash(value: string | null | undefined): string {
  if (!value) return '';
  const idx = value.indexOf(' - ');
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
    console.log(`[EGISClient] No fiscal year/quarter specified, using latest available data`);
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
    console.log(`[EGISClient] fiscalYearAndQuarter parameter:`, fiscalYearAndQuarter);
    
    if (!fiscalYearAndQuarter) {
      console.log(`[EGISClient] No specific fiscal year/quarter provided, filtering for latest data...`);
      filteredFeatures = filterForHighestFiscalYearAndQuarter(features);
      console.log(`[EGISClient] After filtering for latest data: ${filteredFeatures.length} records`);
    } else {
      console.log(`[EGISClient] Using specific fiscal year/quarter, no additional filtering needed`);
    }

    const results = filteredFeatures.map((feature) => ({
      parcelId: feature.attributes.parcel_id,
      fullAddress: constructFullAddress(feature.attributes),
      owner: formatOwnerName(feature.attributes.owner),
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
        owner: toProperCase(feature.attributes.OWNER),
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
    console.log(`[EGISClient] No fiscal year/quarter specified, using default data`);
  }

  // Get geometry from the joined layer (layer 0)
  console.log(`[EGISClient] Fetching geometry for parcelId: ${parcelId} from propertyAssessmentJoinUrl`);
  const geometryQuery = `?where=PID='${parcelId}'&returnGeometry=true&outFields=PID&f=json`;
  console.log(`[EGISClient] Geometry query: ${geometryQuery}`);
  console.log(`[EGISClient] Full geometry URL: ${geomertricDataLayerUrl}/query${geometryQuery}`);
  let geometryFeatures: ArcGISFeature[] = [];
  let geometry: any = null;
  
  try {
    console.log(`[EGISClient] Using geometry query: ${geometryQuery}`);
    geometryFeatures = await fetchEGISData(geomertricDataLayerUrl, geometryQuery);
    if (geometryFeatures.length > 0) {
      geometry = geometryFeatures[0].geometry;
      console.log(`[EGISClient] Geometry found for parcelId: ${parcelId}`);
    }
  } catch (error) {
    console.log(`[EGISClient] Geometry query failed: ${geometryQuery}`, error);
  }

  console.log("[EGISClient] Geometry:", geometry);

  // Get historical property values from layer 1
  console.log(`[EGISClient] Fetching historical property values for parcelId: ${parcelId}`);
  const historicalQuery = `?where=Parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;
  
  console.log(`[EGISClient] Historical data query: ${historicalQuery}`);
  console.log(`[EGISClient] Full historical data URL: ${valueHistoryDataLayerUrl}/query${historicalQuery}`);
  
  let historicalFeatures: ArcGISFeature[] = [];
  try {
    console.log(`[EGISClient] Using historical data query: ${historicalQuery}`);
    historicalFeatures = await fetchEGISData(valueHistoryDataLayerUrl, historicalQuery);
    console.log(`[EGISClient] Historical data found: ${historicalFeatures.length} records`);
  } catch (error) {
    console.log(`[EGISClient] Historical data query failed: ${historicalQuery}`, error);
  }

  // Parse historical values
  const historicalValues: { [year: number]: number } = {};
  
  historicalFeatures.forEach((feature: ArcGISFeature, index: number) => {
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
    let ownersFeatures = await fetchEGISData(currentOwnersDataLayerUrl, ownersQuery);
    
    // If no fiscal year/quarter specified, filter for highest
    if (!fiscalYearAndQuarter) {
      ownersFeatures = filterForHighestFiscalYearAndQuarter(ownersFeatures);
    }
    
    if (ownersFeatures.length > 0) {
      owners = ownersFeatures.map((feature: ArcGISFeature) => formatOwnerName(feature.attributes.owner_name)).filter(Boolean);
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
  
  let residentialAttrsFeatures: ArcGISFeature[] = [];
  try {
    residentialAttrsFeatures = await fetchEGISData(residentialPropertyAttributesDataLayerUrl, residentialAttrsQuery);
    console.log(`[EGISClient] Residential attributes data found: ${residentialAttrsFeatures.length} records`);
    
    // If no fiscal year/quarter specified, filter for highest
    if (!fiscalYearAndQuarter) {
      residentialAttrsFeatures = filterForHighestFiscalYearAndQuarter(residentialAttrsFeatures);
      console.log(`[EGISClient] After filtering, residential attributes data: ${residentialAttrsFeatures.length} records`);
    }
  } catch (error) {
    console.log(`[EGISClient] Residential attributes query failed: ${residentialAttrsQuery}`, error);
  }

  const residentialAttrs = residentialAttrsFeatures[0]?.attributes || {};
  console.log("[EGISClient] Residential attributes:", residentialAttrs);

  // Get condo attributes data from layer 9
  console.log(`[EGISClient] Fetching condo attributes for parcelId: ${parcelId}`);
  let condoAttrsQuery = `?where=parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;
  
  // Add fiscal year and quarter filtering if provided
  if (fiscalYearAndQuarter) {
    condoAttrsQuery = `?where=parcel_id='${parcelId}' AND fiscal_year=${fiscalYearAndQuarter.year} AND quarter=${fiscalYearAndQuarter.quarter}&outFields=*&returnGeometry=false&f=json`;
  }
  
  console.log(`[EGISClient] Condo attributes query: ${condoAttrsQuery}`);
  console.log(`[EGISClient] Full condo attributes URL: ${condoAttributesDataLayerUrl}/query${condoAttrsQuery}`);
  
  let condoAttrsFeatures: ArcGISFeature[] = [];
  try {
    condoAttrsFeatures = await fetchEGISData(condoAttributesDataLayerUrl, condoAttrsQuery);
    console.log(`[EGISClient] Condo attributes data found: ${condoAttrsFeatures.length} records`);
    
    // If no fiscal year/quarter specified, filter for highest
    if (!fiscalYearAndQuarter) {
      condoAttrsFeatures = filterForHighestFiscalYearAndQuarter(condoAttrsFeatures);
      console.log(`[EGISClient] After filtering, condo attributes data: ${condoAttrsFeatures.length} records`);
    }
  } catch (error) {
    console.log(`[EGISClient] Condo attributes query failed: ${condoAttrsQuery}`, error);
  }

  const condoAttrs = condoAttrsFeatures[0]?.attributes || {};
  console.log("[EGISClient] Condo attributes:", condoAttrs);

  // Get exemption data from exemptionDataLayerUrl
  console.log(`[EGISClient] Fetching exemption data for parcelId: ${parcelId}`);
  let table4Query = `?where=parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;
  
  // Add fiscal year and quarter filtering if provided
  if (fiscalYearAndQuarter) {
    table4Query = `?where=parcel_id='${parcelId}' AND fiscal_year=${fiscalYearAndQuarter.year} AND quarter=${fiscalYearAndQuarter.quarter}&outFields=*&returnGeometry=false&f=json`;
  }
  
  console.log(`[EGISClient] Exemption data query: ${table4Query}`);
  console.log(`[EGISClient] Full exemption data URL: ${propertiesWebAppDataLayerUrl}/query${table4Query}`);
  
  let table4Features: ArcGISFeature[] = [];
  try {
    table4Features = await fetchEGISData(propertiesWebAppDataLayerUrl, table4Query);
    console.log(`[EGISClient] Exemption data found: ${table4Features.length} records`);
    
    // If no fiscal year/quarter specified, filter for highest
    if (!fiscalYearAndQuarter) {
      table4Features = filterForHighestFiscalYearAndQuarter(table4Features);
      console.log(`[EGISClient] After filtering, exemption data: ${table4Features.length} records`);
    }
  } catch (error) {
    console.log(`[EGISClient] Exemption query failed: ${table4Query}`, error);
  }

  console.log("[EGISClient] Table 4 features:", table4Features);

  const table4Attrs = table4Features[0]?.attributes || {};

  console.log("[EGISClient] Table 4 attributes:", table4Attrs);

  // Compose the final object
  const propertyDetails = new PropertyDetails({
    // Overview fields
    fullAddress: constructFullAddress(table4Attrs),
    owners: owners,
    imageSrc: "", // Not applicable for EGIS data
    assessedValue: table4Attrs.total_value || 0,
    propertyType: toProperCase(table4Attrs.property_type) || "Not available",
    parcelId: parcelId,
    propertyNetTax: table4Attrs.net_tax || 0,
    personalExemptionFlag: table4Attrs.personal_exemption_flag,
    residentialExemptionFlag: table4Attrs.residential_exemption_flag,
    totalBilledAmount: table4Attrs.total_billed_amt || 0,
    // Property Value fields
    historicPropertyValues: historicalValues,
    // Property Attributes fields - prioritize residential > condo > exemption data
    landUse: prioritizeValue(parseAfterDash(residentialAttrs.composite_land_use), parseAfterDash(condoAttrs.composite_land_use), parseAfterDash(table4Attrs.land_use)) || "Not available",
    livingArea: table4Attrs.living_area || "Not available", // Not in condo or residential layer
    style: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.building_style)), toProperCase(parseAfterDash(condoAttrs.building_style)), toProperCase(parseAfterDash(table4Attrs.building_style))) || "Not available",
    storyHeight: prioritizeValue(toProperCase(residentialAttrs.story_height), toProperCase(condoAttrs.story_height), toProperCase(table4Attrs.story_height)) || "Not available",
    floor: prioritizeValue(toProperCase(residentialAttrs.floor), toProperCase(condoAttrs.floor), toProperCase(table4Attrs.floor)) || undefined,
    penthouseUnit: prioritizeValue(toProperCase(residentialAttrs.penthouse_unit), toProperCase(condoAttrs.penthouse_unit), toProperCase(table4Attrs.penthouse_unit)) || undefined,
    orientation: prioritizeValue(toProperCase(residentialAttrs.orientation), toProperCase(condoAttrs.orientation), toProperCase(table4Attrs.orientation)) || undefined,
    bedroomNumber: prioritizeValue(residentialAttrs.bedrooms, condoAttrs.bedrooms, table4Attrs.bedrooms) || undefined,
    totalBathrooms: (() => {
      const residentialFullBath = residentialAttrs.full_bath;
      const residentialHalfBath = residentialAttrs.half_bath;
      const condoFullBath = condoAttrs.full_bath;
      const condoHalfBath = condoAttrs.half_bath;
      const exemptionFullBath = table4Attrs.full_bathrooms;
      const exemptionHalfBath = table4Attrs.half_bathrooms;
      
      const fullBath = prioritizeValue(residentialFullBath, condoFullBath, exemptionFullBath);
      const halfBath = prioritizeValue(residentialHalfBath, condoHalfBath, exemptionHalfBath);
      
      if (fullBath !== undefined && halfBath !== undefined) {
        return String(Number(fullBath) + Number(halfBath) * 0.5);
      }
      return undefined;
    })(),
    halfBathrooms: prioritizeValue(residentialAttrs.half_bath, condoAttrs.half_bath, table4Attrs.half_bathrooms) || undefined,
    bathStyle1: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.bath_style_1)), toProperCase(parseAfterDash(condoAttrs.bath_style_1)), toProperCase(parseAfterDash(table4Attrs.bath_style_1))) || undefined,
    bathStyle2: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.bath_style_2)), toProperCase(parseAfterDash(condoAttrs.bath_style_2)), toProperCase(parseAfterDash(table4Attrs.bath_style_2))) || undefined,
    bathStyle3: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.bath_style_3)), toProperCase(parseAfterDash(condoAttrs.bath_style_3)), toProperCase(parseAfterDash(table4Attrs.bath_style_3))) || undefined,
    numberOfKitchens: prioritizeValue(residentialAttrs.kitchens, condoAttrs.kitchens, table4Attrs.kitchens) || undefined,
    kitchenType: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.kitchen_type)), toProperCase(parseAfterDash(condoAttrs.kitchen_type)), toProperCase(parseAfterDash(table4Attrs.kitchen_type))) || undefined,
    kitchenStyle1: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.kitchen_style_1)), toProperCase(parseAfterDash(condoAttrs.kitchen_style_1)), toProperCase(parseAfterDash(table4Attrs.kitchen_style_1))) || undefined,
    kitchenStyle2: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.kitchen_style_2)), toProperCase(parseAfterDash(condoAttrs.kitchen_style_2)), toProperCase(parseAfterDash(table4Attrs.kitchen_style_2))) || undefined,
    kitchenStyle3: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.kitchen_style_3)), toProperCase(parseAfterDash(condoAttrs.kitchen_style_3)), toProperCase(parseAfterDash(table4Attrs.kitchen_style_3))) || undefined,
    yearBuilt: prioritizeValue(residentialAttrs.year_built, condoAttrs.year_built, table4Attrs.year_built) || undefined,
    exteriorFinish: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.exterior_finish)), toProperCase(parseAfterDash(condoAttrs.exterior_finish)), toProperCase(parseAfterDash(table4Attrs.exterior_finish))) || undefined,
    exteriorCondition: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.exterior_condition)), toProperCase(parseAfterDash(condoAttrs.exterior_condition)), toProperCase(parseAfterDash(table4Attrs.exterior_condition))) || undefined,
    roofCover: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.roof_cover)), toProperCase(parseAfterDash(condoAttrs.roof_cover)), toProperCase(parseAfterDash(table4Attrs.roof_cover))) || undefined,
    roofStructure: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.roof_structure)), toProperCase(parseAfterDash(condoAttrs.roof_structure)), toProperCase(parseAfterDash(table4Attrs.roof_structure))) || undefined,
    foundation: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.foundation)), toProperCase(parseAfterDash(condoAttrs.foundation)), toProperCase(parseAfterDash(table4Attrs.foundation))) || "Not available",
    parkingSpots: prioritizeValue(residentialAttrs.num_of_parking_spots, condoAttrs.num_of_parking_spots, table4Attrs.num_parking_spots) || undefined,
    heatType: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.heat_type)), toProperCase(parseAfterDash(condoAttrs.heat_type)), toProperCase(parseAfterDash(table4Attrs.heat_type))) || undefined,
    acType: prioritizeValue(toProperCase(parseAfterDash(residentialAttrs.ac_type)), toProperCase(parseAfterDash(condoAttrs.ac_type)), toProperCase(parseAfterDash(table4Attrs.ac_type))) || undefined,
    fireplaces: prioritizeValue(residentialAttrs.fireplaces, condoAttrs.fireplaces, table4Attrs.fireplaces) || undefined,
    salePrice: undefined, // Not in either layer
    saleDate: table4Attrs.latest_sale_date || undefined, // Not in residential layer
    registryBookAndPlace: undefined, // Not in either layer
    // Property Taxes fields
    propertyGrossTax: table4Attrs.gross_tax || 0,
    residentialExemptionAmount: table4Attrs.resexempt || 0, // TODO: cast to number
    personalExemptionAmount: table4Attrs.persexempt_total|| 0,
    communityPreservationAmount: table4Attrs.cpa_amt || 0,
    personalExemptionAmount1: table4Attrs.persexempt_1 || 0,
    personalExemptionAmount2: table4Attrs.persexempt_2 || 0,
    estimatedTotalFirstHalf: table4Attrs.re_tax_amt || 0,
  });

  console.log(`[EGISClient] Property details completed for parcelId: ${parcelId}. Historical values count: ${Object.keys(historicalValues).length}`);

  // Return both property details and geometry
  return {
    ...propertyDetails,
    geometry: geometry,
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

