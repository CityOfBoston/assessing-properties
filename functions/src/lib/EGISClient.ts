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

  const query = "?where=1=1&outFields=PID,FULL_ADDRESS&returnGeometry=false&f=json";
  const features = await fetchEGISData(currentPropertyDataLayerUrl, query);

  console.log(`[EGISClient] Processing ${features.length} features for parcel ID and address pairings`);

  const result = features.map((feature: ArcGISFeature) => {
    return {
      parcelId: feature.attributes.PID,
      fullAddress: feature.attributes.FULL_ADDRESS,
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
  const query = `?where=${parcelIdConditions}&outFields=PID,FULL_ADDRESS,OWNER,TOTAL_VALUE&returnGeometry=false&f=json`;

  try {
    console.log(`[EGISClient] Using query: ${query}`);
    const features = await fetchEGISData(propertyAssessmentJoinUrl, query);

    const results = features.map((feature) => ({
      parcelId: feature.attributes.PID,
      fullAddress: feature.attributes.FULL_ADDRESS,
      owner: feature.attributes.OWNER,
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
  const query = `?where=PID='${parcelId}'&outFields=PID,FULL_ADDRESS,OWNER,TOTAL_VALUE&returnGeometry=false&f=json`;

  try {
    console.log(`[EGISClient] Using query: ${query}`);
    const features = await fetchEGISData(currentPropertyDataLayerUrl, query);

    if (features.length > 0) {
      const feature = features[0];
      const result = {
        parcelId: feature.attributes.PID,
        fullAddress: feature.attributes.FULL_ADDRESS,
        owner: feature.attributes.OWNER,
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

  // Get current property data with all fields from the joined layer (layer 0)
  console.log(`[EGISClient] Fetching current property data for parcelId: ${parcelId} from propertyAssessmentJoinUrl`);

  // Try different query formats to handle potential PID format issues
  // Note: returnGeometry=true to get both field data and geometry in one call
  const currentQueryFormats = [
    `?where=PID='${parcelId}'&outFields=*&returnGeometry=true&f=json`,
    `?where=PID=${parcelId}&outFields=*&returnGeometry=true&f=json`,
    `?where=PID LIKE '%${parcelId}%'&outFields=*&returnGeometry=true&f=json`,
  ];

  let currentFeatures: ArcGISFeature[] = [];
  for (const query of currentQueryFormats) {
    try {
      console.log(`[EGISClient] Trying current data query format: ${query}`);
      currentFeatures = await fetchEGISData(propertyAssessmentJoinUrl, query);
      if (currentFeatures.length > 0) {
        console.log(`[EGISClient] Found current data with query format: ${query}`);
        break;
      }
    } catch (error) {
      console.log(`[EGISClient] Current data query format failed: ${query}`, error);
      continue;
    }
  }

  if (currentFeatures.length === 0) {
    console.log(`[EGISClient] No current property data found for parcelId: ${parcelId}`);
    // Return default PropertyDetailsData with empty values
    return new PropertyDetails({
      fullAddress: "Property not found",
      owners: ["Unknown"],
      imageSrc: "",
      assessedValue: 0,
      propertyType: "Unknown",
      parcelId: parcelId,
      propertyNetTax: 0,
      personalExemption: false,
      residentialExemption: false,
      historicPropertyValues: {},
      propertyGrossTax: 0,
      residentialExemptionAmount: 0,
      personalExemptionAmount: 0,
      communityPreservation: 0,
    });
  }

  console.log(`[EGISClient] Current property data found. Attributes count: ${Object.keys(currentFeatures[0].attributes).length}`);

  // Get historical property values
  console.log(`[EGISClient] Fetching historical property values for parcelId: ${parcelId}`);

  // Use single query format for historical data
  const historicalQuery = `?where=Parcel_id='${parcelId}'&outFields=*&returnGeometry=false&f=json`;

  let historicalFeatures: ArcGISFeature[] = [];
  try {
    console.log(`[EGISClient] Using historical data query: ${historicalQuery}`);
    historicalFeatures = await fetchEGISData(historicalPropertyDataLayerUrl, historicalQuery);
    console.log(`[EGISClient] Historical data found: ${historicalFeatures.length} records`);
  } catch (error) {
    console.log(`[EGISClient] Historical data query failed: ${historicalQuery}`, error);
    // Continue with empty historical features if query fails
    historicalFeatures = [];
  }

  // Debug: Log the first few historical features to see the structure
  if (historicalFeatures.length > 0) {
    console.log("[EGISClient] First historical feature attributes:", historicalFeatures[0].attributes);
    console.log("[EGISClient] Available fields in first feature:", Object.keys(historicalFeatures[0].attributes));
  }

  // Parse historical values - use the correct field names from the API
  const historicalValues: { [year: number]: number } = {};
  historicalFeatures.forEach((feature: ArcGISFeature, index: number) => {
    // Use the correct field names from the EGIS API
    const yearId = feature.attributes.Fiscal_Year;
    const assessedValue = feature.attributes.Assessed_value;

    console.log(`[EGISClient] Historical feature ${index}: Fiscal_Year=${yearId}, Assessed_value=${assessedValue}`);

    if (yearId && assessedValue !== undefined) {
      historicalValues[yearId] = assessedValue;
    }
  });

  console.log("[EGISClient] Parsed historical values:", historicalValues);

  // Get exemption flags from propertyWebAppDedupedUrl
  console.log(`[EGISClient] Fetching exemption flags for parcelId: ${parcelId}`);
  
  const exemptionQuery = `?where=parcel_id='${parcelId}'&outFields=residential_exemption_flag,personal_exemption_flag&returnGeometry=false&f=json`;
  
  let exemptionFeatures: ArcGISFeature[] = [];
  let residentialExemption = false;
  let personalExemption = false;
  
  try {
    console.log(`[EGISClient] Using exemption query: ${exemptionQuery}`);
    exemptionFeatures = await fetchEGISData(propertyWebAppDedupedUrl, exemptionQuery);
    console.log(`[EGISClient] Exemption data found: ${exemptionFeatures.length} records`);
    
    if (exemptionFeatures.length > 0) {
      const exemptionAttributes = exemptionFeatures[0].attributes;
      residentialExemption = Boolean(exemptionAttributes.residential_exemption_flag);
      personalExemption = Boolean(exemptionAttributes.personal_exemption_flag);
      
      console.log(`[EGISClient] Exemption flags - Residential: ${residentialExemption}, Personal: ${personalExemption}`);
    }
  } catch (error) {
    console.log(`[EGISClient] Exemption query failed: ${exemptionQuery}`, error);
    // Continue with default false values if query fails
  }

  const attributes = currentFeatures[0].attributes;
  const geometry = currentFeatures[0].geometry;

  // Create PropertyDetailsData using the PropertyDetails class constructor
  const propertyDetails = new PropertyDetails({
    // Overview fields
    fullAddress: attributes.FULL_ADDRESS || "Address not available",
    owners: attributes.OWNER ? [attributes.OWNER] : ["Owner not available"],
    imageSrc: "", // Not applicable for EGIS data
    assessedValue: attributes.TOTAL_VALUE || 0, // Use TOTAL_VALUE field
    propertyType: attributes.LU_DESC || "Property type not available",
    parcelId: attributes.PID || parcelId,
    propertyNetTax: attributes.GROSS_TAX || 0,
    personalExemption: personalExemption, // Use value from exemption query
    residentialExemption: residentialExemption, // Use value from exemption query
    historicPropertyValues: historicalValues,
    bedroomNumber: attributes.BED_RMS,
    bedroomType: attributes.BDRM_COND,
    totalRooms: attributes.TT_RMS,
    totalBathrooms: attributes.FULL_BTH,
    halfBathrooms: attributes.HLF_BTH,
    bathStyle1: attributes.BTHRM_STYLE1,
    bathStyle2: attributes.BTHRM_STYLE2,
    bathStyle3: attributes.BTHRM_STYLE3,
    numberOfKitchens: attributes.KITCHENS,
    kitchenType: attributes.KITCHEN_TYPE,
    kitchenStyle1: attributes.KITCHEN_STYLE1,
    kitchenStyle2: attributes.KITCHEN_STYLE2,
    kitchenStyle3: attributes.KITCHEN_STYLE3,
    fireplaces: attributes.FIREPLACES,
    acType: attributes.AC_TYPE,
    heatType: attributes.HEAT_TYPE,
    interiorCondition: attributes.INT_COND,
    interiorFinish: attributes.INT_WALL,
    exteriorFinish: attributes.EXT_FNISHED,
    exteriorCondition: attributes.EXT_COND,
    view: attributes.PROP_VIEW,
    grade: attributes.OVERALL_COND,
    yearBuilt: attributes.YR_BUILT,
    roofCover: attributes.ROOF_COVER,
    roofStructure: attributes.ROOF_STRUCTURE,
    foundation: "", // Not provided by EGIS
    landUse: attributes.LU,
    salePrice: undefined, // Not provided by EGIS
    saleDate: "", // Not provided by EGIS
    registryBookAndPlace: "", // Not provided by EGIS
    parkingSpots: attributes.NUM_PARKING,
    parkingOwnership: "", // Not provided by EGIS
    parkingType: "", // Not provided by EGIS
    tandemParking: undefined, // Not provided by EGIS
    livingArea: attributes.LIVING_AREA,
    floor: attributes.CD_FLOOR,
    penthouseUnit: undefined, // Not provided by EGIS
    complex: "", // Not provided by EGIS
    storyHeight: undefined, // Not provided by EGIS
    style: attributes.BLDG_TYPE,
    orientation: attributes.ORIENTATION,
    propertyGrossTax: attributes.GROSS_TAX || 0,
    residentialExemptionAmount: 0, // Not provided by EGIS
    personalExemptionAmount: 0, // Not provided by EGIS
    communityPreservation: 0, // Not provided by EGIS
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
