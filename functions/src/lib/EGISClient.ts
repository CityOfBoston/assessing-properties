/**
 * This is a client for making requests to the EGIS API.
 *
 * The EGIS API is a RESTful API that allows you to get property details,
 * tax and parcel information for properties in Boston. It also contains
 * geospatial data for each property that will be
 */

import {PropertyDetailsData, PropertyDetails} from "../types";

const baseUrl = "https://gisportal.boston.gov/arcgis/rest/services/Assessing/Assessing_Online_data/MapServer";
const propertyAssessmentJoinUrl = `${baseUrl}/0`;
const historicalPropertyDataLayerUrl = `${baseUrl}/1`;
const currentPropertyDataLayerUrl = `${baseUrl}/2`;
const currentOwnersDataLayerUrl = `${baseUrl}/3`;
const propertyWebAppDedupedUrl = `${baseUrl}/4`;


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

// Helper to construct full address from fields
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

// Helper to convert a string to proper case (title case), with refinements for common name edge cases
function toProperCase(str: string | undefined): string {
  if (!str) return '';
  // If all uppercase and short (likely an abbreviation), keep as is
  if (/^[A-Z0-9 .,'&-]+$/.test(str) && str.length <= 6) return str;
  // Lowercase, then title case each word
  let result = str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  // Handle Mc/Mac prefixes (e.g., Mcdonald -> McDonald, Macarthur -> MacArthur)
  result = result.replace(/\b(Mc|Mac)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  // Handle O' prefixes (e.g., O'connor -> O'Connor)
  result = result.replace(/\bO'([a-z])/g, (m, p1) => "O'" + p1.toUpperCase());
  // Handle hyphenated names (e.g., Smith-jones -> Smith-Jones)
  result = result.replace(/-([a-z])/g, (m, p1) => '-' + p1.toUpperCase());
  // Handle Jr, Sr, I, II, III, IV, LLC, INC, etc. (keep as uppercase if at end)
  result = result.replace(/\b(Jr|Sr|I{1,3}|Iv|Llc|Inc|Ltd|Co|Corp|Pllc|Pllp|Pc|Plc|Lp|Llp|Pl|Pa|Pllc|Pllp|Pllc|Pllp)\b/gi, (m) => m.toUpperCase());
  return result;
}

/**
 * Helper to parse a string like 'XXX - XXXXXX XXX XXXX' and return the portion after the last ' - '.
 * If the format is not matched, returns the original string trimmed. Handles null/undefined/empty gracefully.
 * @param value The input string
 * @returns The portion after the last ' - ', or the original string trimmed
 */
export function parseAfterDash(value: string | null | undefined): string {
  if (!value) return '';
  const idx = value.indexOf(' - ');
  return idx !== -1 ? value.slice(idx + 3).trim() : value.trim();
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
  const features = await fetchEGISData(propertyWebAppDedupedUrl, query);

  console.log(`[EGISClient] Processing ${features.length} features for parcel ID and address pairings`);

  const result = features.map((feature: ArcGISFeature) => {
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
 * @return Array of property summary objects with parcelId, fullAddress, owner, and assessedValue.
 */
export const fetchPropertySummariesByParcelIdsHelper = async (parcelIds: string[]): Promise<Array<{parcelId: string, fullAddress: string, owner: string, assessedValue: number}>> => {
  console.log(`[EGISClient] Starting fetchPropertySummariesByParcelIds for ${parcelIds.length} parcelIds`);

  // Build OR query for multiple parcel IDs
  const parcelIdConditions = parcelIds.map((id) => `PID='${id}'`).join(" OR ");
  const query = `?where=${parcelIdConditions}&outFields=PID,ST_NAME,ST_NUM,ST_NUM2,UNIT_NUM,CITY,ZIP_CODE,OWNER,TOTAL_VALUE&returnGeometry=false&f=json`;

  try {
    console.log(`[EGISClient] Using query: ${query}`);
    const features = await fetchEGISData(propertyAssessmentJoinUrl, query);

    const results = features.map((feature) => ({
      parcelId: feature.attributes.PID,
      fullAddress: constructFullAddress(feature.attributes),
      owner: toProperCase(feature.attributes.OWNER),
      assessedValue: feature.attributes.TOTAL_VALUE,
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
    console.log(`[EGISClient] Using query: ${query}`);
    const features = await fetchEGISData(currentPropertyDataLayerUrl, query);

    if (features.length > 0) {
      const feature = features[0];
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
 * @return A property details object with all current fields plus historical values and geometry.
 */
export const fetchPropertyDetailsByParcelIdHelper = async (parcelId: string): Promise<PropertyDetailsData & { geometry?: any }> => {
  console.log(`[EGISClient] Starting fetchPropertyDetailsByParcelId for parcelId: ${parcelId}`);

  // Get geometry from the joined layer (layer 0)
  console.log(`[EGISClient] Fetching geometry for parcelId: ${parcelId} from propertyAssessmentJoinUrl`);
  const geometryQuery = `?where=PID='${parcelId}'&returnGeometry=true&outFields=PID&f=json`;
  let geometryFeatures: ArcGISFeature[] = [];
  let geometry: any = null;
  
  try {
    console.log(`[EGISClient] Using geometry query: ${geometryQuery}`);
    geometryFeatures = await fetchEGISData(propertyAssessmentJoinUrl, geometryQuery);
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
  let historicalFeatures: ArcGISFeature[] = [];
  try {
    console.log(`[EGISClient] Using historical data query: ${historicalQuery}`);
    historicalFeatures = await fetchEGISData(historicalPropertyDataLayerUrl, historicalQuery);
    console.log(`[EGISClient] Historical data found: ${historicalFeatures.length} records`);
  } catch (error) {
    console.log(`[EGISClient] Historical data query failed: ${historicalQuery}`, error);
  }

  // Parse historical values
  const historicalValues: { [year: number]: number } = {};
  historicalFeatures.forEach((feature: ArcGISFeature, index: number) => {
    const yearId = feature.attributes.Fiscal_Year;
    const assessedValue = feature.attributes.Assessed_value;
    console.log(`[EGISClient] Historical feature ${index}: Fiscal_Year=${yearId}, Assessed_value=${assessedValue}`);
    if (yearId && assessedValue !== undefined) {
      historicalValues[yearId] = assessedValue;
    }
  });

  console.log("[EGISClient] Historical values:", historicalValues);

  // Get current property data from layer 2
  // console.log(`[EGISClient] Fetching current property data for parcelId: ${parcelId}`);
  // const table2Query = `?where=parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;
  // let table2Features: ArcGISFeature[] = [];
  // try {
  //   console.log(`[EGISClient] Using current data query: ${table2Query}`);
  //   table2Features = await fetchEGISData(currentPropertyDataLayerUrl, table2Query);
  //   console.log(`[EGISClient] Current data found: ${table2Features.length} records`);
  // } catch (error) {
  //   console.log(`[EGISClient] Current data query failed: ${table2Query}`, error);
  // }

  // Get owners from layer 3
  console.log(`[EGISClient] Fetching owners for parcelId: ${parcelId}`);
  const ownersQuery = `?where=parcel_id='${parcelId}'&outFields=owner_name&returnGeometry=false&f=json`;
  let owners: string[] = ["Owner not available"];
  try {
    const ownersFeatures = await fetchEGISData(currentOwnersDataLayerUrl, ownersQuery);
    if (ownersFeatures.length > 0) {
      owners = ownersFeatures.map((feature: ArcGISFeature) => toProperCase(feature.attributes.owner_name)).filter(Boolean);
    }
  } catch (error) {
    console.log(`[EGISClient] Owners query failed: ${ownersQuery}`, error);
  }

  console.log("[EGISClient] Owners:", owners);

  // Get exemption data from layer 4
  console.log(`[EGISClient] Fetching exemption data for parcelId: ${parcelId}`);
  const table4Query = `?where=parcel_id='${parcelId}'&outFields=total_value,property_type,net_tax,personal_exemption_flag,residential_exemption_flag,land_use,living_area,building_style,story_height,floor,penthouse_unit,orientation,bedrooms,full_bath,half_bath,bath_style_1,bath_style_2,bath_style_3,kitchens,kitchen_type,kitchen_style_1,kitchen_style_2,kitchen_style_3,year_built,exterior_finish,exterior_condition,roof_cover,roof_structure,foundation,num_parking_spots,heat_type,ac_type,fireplaces,latest_sale_date,gross_tax,residential_exemption,personal_exemption,cpa_amt,street_number,street_number_suffix,street_name,street_name_suffix,apt_unit,city,location_zip_code&returnGeometry=false&f=json`;
  let table4Features: ArcGISFeature[] = [];
  try {
    table4Features = await fetchEGISData(propertyWebAppDedupedUrl, table4Query);
    console.log(`[EGISClient] Exemption data found: ${table4Features.length} records`);
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
    // Property Value fields
    historicPropertyValues: historicalValues,
    // Property Attributes fields
    landUse: table4Attrs.land_use || "Not available",
    livingArea: table4Attrs.living_area || "Not available",
    style: parseAfterDash(table4Attrs.building_style) || "Not available",
    storyHeight: table4Attrs.story_height || "Not available",
    floor: table4Attrs.floor || undefined,
    penthouseUnit: table4Attrs.penthouse_unit || undefined,
    orientation: parseAfterDash(table4Attrs.orientation) || undefined,
    bedroomNumber: table4Attrs.bedrooms || undefined,
    totalBathrooms: table4Attrs.full_bathrooms !== undefined && table4Attrs.half_bathrooms !== undefined ? String(Number(table4Attrs.full_bathrooms) + Number(table4Attrs.half_bathrooms) * 0.5) : undefined,
    halfBathrooms: table4Attrs.half_bathrooms || undefined,
    bathStyle1: table4Attrs.bathroom_style_1 || undefined,
    bathStyle2: table4Attrs.bathroom_style_2 || undefined,
    bathStyle3: table4Attrs.bathroom_style_3 || undefined,
    numberOfKitchens: table4Attrs.kitchens || undefined,
    kitchenType: parseAfterDash(table4Attrs.kitchen_type) || undefined,
    kitchenStyle1: parseAfterDash(table4Attrs.kitchen_style_1) || undefined,
    kitchenStyle2: parseAfterDash(table4Attrs.kitchen_style_2) || undefined,
    kitchenStyle3: parseAfterDash(table4Attrs.kitchen_style_3) || undefined,
    yearBuilt: table4Attrs.year_built || undefined,
    exteriorFinish: parseAfterDash(table4Attrs.exterior_finish) || undefined,
    exteriorCondition: parseAfterDash(table4Attrs.exterior_condition) || undefined,
    roofCover: parseAfterDash(table4Attrs.roof_cover) || undefined,
    roofStructure: parseAfterDash(table4Attrs.roof_structure) || undefined,
    foundation: parseAfterDash(table4Attrs.foundation) || "Not available",
    parkingSpots: table4Attrs.num_parking_spots || undefined,
    heatType: parseAfterDash(table4Attrs.heat_type) || undefined,
    acType: parseAfterDash(table4Attrs.ac_type) || undefined,
    fireplaces: table4Attrs.fireplaces || undefined,
    salePrice: undefined,
    saleDate: table4Attrs.latest_sale_date || undefined,
    registryBookAndPlace: undefined,
    // Property Taxes fields
    propertyGrossTax: table4Attrs.gross_tax || 0,
    residentialExemptionAmount: table4Attrs.residential_exemption || 0, // TODO: cast to number
    personalExemptionAmount: table4Attrs.personal_exemption|| 0,
    communityPreservationAmount: table4Attrs.cpa_amt || 0,
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

        const exportUrl = `${propertyAssessmentJoinUrl.replace("/0", "")}/export`;
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
      console.log(`[EGISClient] Using geometry query: ${geometryQuery}`);
      geometryFeatures = await fetchEGISData(propertyAssessmentJoinUrl, geometryQuery);
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

        const exportUrl = `${propertyAssessmentJoinUrl.replace("/0", "")}/export`;
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
