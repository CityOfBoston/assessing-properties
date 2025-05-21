import { DetailedSearchResult, SearchResult, ParcelId, PropertyDetails, 
  PropertyOverview, PropertyAttributes, PropertyValue, PropertyTax 
} from "../types";
const PROPERTIES_TABLE = "6b7e460e-33f6-4e61-80bc-1bef2e73ac54";
const BASE_URL = "https://data.boston.gov/api/3/action/datastore_search_sql";
/**
 * Given a string that might either be a parcel id or part of a property's full
 * address, assembles a sql query string that will be used to fuzzy search for
 * possible matches in the table 6b7e460e-33f6-4e61-80bc-1bef2e73ac54.
 *
 * Depending on whether the isDetailed flag is true or false, the query will
 * involving getting additional two fields owner and assessedValue.
 *
 * The relavent fields in the table are:
 * "PID", "ST_NUM", "ST_NUM2", "ST_NAME", "UNIT_NUM"
 * - PID: string representing the property's parcel id
 * - ST_NUM: string representing the property's street number
 * - ST_NUM2: string representing the property's street number 2
 * - ST_NAME: string representing the property's street name
 * - UNIT_NUM: string representing the property's unit number
 *
 * "ST_NUM", "ST_NUM2", "ST_NAME" and "UNIT_NUM" together form the property's
 * full address. As such, the search string could contain any or none of these
 * fields, partial or full, so we must use a fuzzy search, break the search
 * string on spaces and testing all possible abbreviations/full forms.
 *
 * 'street' -> ['st', 'str']
 * 'avenue' -> ['av', 'ave']
 * 'boulevard' -> ['blvd', 'blv', 'bl']
 * 'road' -> ['rd']
 * 'drive' -> ['dr']
 * 'parkway' -> ['pkwy', 'pky']
 * 'square' -> ['sq']
 * 'plaza' -> ['plz']
 *
 * If isDetailed is true, the query will also involve getting the following
 * fields:
 * "OWNER", "TOTAL_VALUE"
 * - OWNER: string representing the property's owner name
 * - TOTAL_VALUE: string representing the property's total assessed value
 *
 * @param searchString - The string that might either be a parcel id or part of
 * a property's full address
 * @param isDetailed (optional) - Whether the query should involve getting
 * additional two fields owner and assessedValue, defaults to false
 * @return A sql query string that will be used to fuzzy search for possible
 * matches in the database
 */
export function assemblePropertySearchQuery(searchString: string,
  isDetailed = false): string {
    console.log(`[PropertyClient] Assembling search query with searchString: "${
      searchString}", isDetailed: ${isDetailed}`);
    
    const selectFields = ['"PID"', '"ST_NUM"', '"ST_NUM2"', '"ST_NAME"', 
      '"UNIT_NUM"', '"CITY"', '"ZIP_CODE"'];
    if (isDetailed) {
      selectFields.push('"OWNER"', '"TOTAL_VALUE"');
      console.log('[PropertyClient] Including detailed fields in query');
    }
    const fieldsToSelect = selectFields.join(', ');
  
    const cleaned = searchString
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();
    
    console.log(`[PropertyClient] Cleaned search string: "${cleaned}"`);
    const tokens = cleaned.split(' ').filter(Boolean);

    // === Special case: PID exact match ===
    if (tokens.length === 1 && /^\d+$/.test(tokens[0])) {
      const pid = tokens[0];
      console.log(`[PropertyClient] Detected PID exact match search: ${pid}`);
      const query = `SELECT ${fieldsToSelect}
  FROM ${PROPERTIES_TABLE}
  WHERE "PID" = '${pid}'
  LIMIT 20`;
      console.log('[PropertyClient] Generated PID exact match query');
      return query;
    }
  
    console.log('[PropertyClient] Building full-text search query');
    const fullTextVector = `to_tsvector('simple', 
    COALESCE("ST_NUM", '') || ' ' || 
    COALESCE("ST_NUM2", '') || ' ' || 
    COALESCE("ST_NAME", '') || ' ' || 
    COALESCE("UNIT_NUM", '') || ' ' || 
    COALESCE("CITY", '') || ' ' || 
    COALESCE("ZIP_CODE", ''))`;
  
    const tsQuery = `plainto_tsquery('simple', '${cleaned}')`;
  
    const fallbackILIKE = tokens.map(token => {
      const isNumeric = /^\d+$/.test(token);
      const fields = isNumeric ? ['ST_NUM', 'ST_NUM2', 'UNIT_NUM', 'ZIP_CODE'] 
      : ['ST_NAME', 'CITY'];
      return `(${fields.map(f => `"${f}" ILIKE '%${token}%'`).join(' OR ')})`;
    }).join(' AND ');

    const query = `SELECT ${fieldsToSelect}
  FROM ${PROPERTIES_TABLE}
  WHERE ${fullTextVector} @@ ${tsQuery}
      OR (${fallbackILIKE})
  LIMIT 20`;
    
    console.log('[PropertyClient] Generated full-text search query');
    return query;
}

/**
 * Given a parcel id, assembles a sql query string that will be used to 
 * get all the property details for the parcel. We assume that since the
 * parcel id is unique, the response will only contain one record, so we
 * can just return the first record in the response.
 * 
 * @param parcelId - The parcel id of the property to get details for
 * @return A sql query string that will be used to get all the property
 * details for the parcel
 */
export function assemblePropertyDetailsQuery(parcelId: ParcelId): string {
  console.log(
    `[PropertyClient] Assembling property details query for parcelId: ${
      parcelId.toString()}`);
  const query = `SELECT * FROM "${PROPERTIES_TABLE}" WHERE "PID" = 
  '${parcelId.toString()}'
  LIMIT 1`;
  console.log('[PropertyClient] Generated property details query');
  return query;
}

/**
 * Given a sql query string that will be used to fuzzy search for possible
 * matches in the database, executes the query on data.boston.gov's property
 * database and returns the results. Based on the isDetailed flag, the results
 * will be returned as a SearchResult or DetailedSearchResult.
 *
 * @param query - The sql query string that will be used to fuzzy search for
 * possible matches in the database
 * @param isDetailed (optional) - Whether the results should be returned as a
 * SearchResult or DetailedSearchResult, defaults to false
 * @return An array of SearchResult or DetailedSearchResult objects
 */
export async function executePropertySearchQuery(query: string,
  isDetailed = false):
    Promise<SearchResult[] | DetailedSearchResult[]> {
  console.log(`[PropertyClient] Executing property search query, isDetailed: ${
    isDetailed}`);
  const url = `${BASE_URL}?sql=${encodeURIComponent(query)}`;

  try {
    console.log('[PropertyClient] Sending request to Boston data API');
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[PropertyClient] API request failed with status: ${
        response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.success || !json.result || !json.result.records) {
      console.warn('[PropertyClient] API returned no results');
      return [];
    }

    console.log(`[PropertyClient] Processing ${
      json.result.records.length} search results`);
    const results = json.result.records.map((record: any) => {
      const stNum = record.ST_NUM || "";
      const stNum2 = record.ST_NUM2 ? `-${record.ST_NUM2}` : "";
      const stName = record.ST_NAME || "";
      const unit = record.UNIT_NUM ? `Unit ${record.UNIT_NUM}` : "";
      const city = record.CITY || "";
      const zipCode = record.ZIP_CODE || "";
      const fullAddress =
            `${stNum}${stNum2} ${stName}`.trim() + (unit ? `, ${unit}` : "") +
            (city ? `, ${city}` : "") + (zipCode ? `, ${zipCode}` : "");
      
      if (isDetailed) {
        return {
          parcelId: ParcelId.create(record.PID),
          fullAddress,
          owners: record.OWNER ? [record.OWNER] : [],
          value: parseFloat(record.TOTAL_VALUE) || 0,
        } as DetailedSearchResult;
      } else {
        return {
          parcelId: ParcelId.create(record.PID),
          fullAddress,
        } as SearchResult;
      }
    });

    console.log(`[PropertyClient] Successfully processed ${
      results.length} search results`);
    return results;
  } catch (error) {
    console.error('[PropertyClient] Error executing property search:', error);
    console.error(`[PropertyClient] Stack trace: ${error instanceof Error ?
       error.stack : 'No stack trace available'}`);
    throw error;
  }
}

/**
 * Helper function to discern whether a property is residential or commercial
 * based on the land use code. If the land use code starts with '1' or is '013' 
 * or '031', it is residential. Otherwise, it is commercial.
 * 
 * @param luc - The land use code of the property
 * @return true if the property is residential, false otherwise
 */
function isResidential(luc: string): boolean {
  return luc.startsWith('1') || luc === '013' || luc === '031';
}

/**
 * Given a parcel id, returns the property details for the parcel. It uses
 * the same endpoint as the search query above, but with a much more
 * simple query. We can assume that the response will only contain one
 * record, so we can just return the first record in the response. However,
 * the response is not formatted as a DetailedSearchResult, so we need to
 * format it as one. Additionally, the response might not contain all the
 * fields that we want, so we need to map the fields to the DetailedSearchResult
 * fields, and it is ok if some fields are not left empty. The names of all
 * fields that might be present in the response are documented in
 * data-boston-key.json.
 *
 * @param query - The sql query string that will be used to fuzzy search for
 * possible matches in the database
 * @return A DetailedSearchResult object containing the property details
 */
export async function executePropertyDetailsQuery(query: string): 
Promise<PropertyDetails> {
  console.log('[PropertyClient] Executing property details query');
  const url = `${BASE_URL}?sql=${encodeURIComponent(query)}`;

  try {
    console.log('[PropertyClient] Sending request to Boston data API');
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[PropertyClient] API request failed with status: ${
        response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    
    if (!json.success || !json.result || !json.result.records || 
      !json.result.records[0]) {
      console.error(
        '[PropertyClient] API returned no results for property details');
      throw new Error('No property details found');
    }

    console.log(
      '[PropertyClient] Processing property details from API response');
    const record = json.result.records[0];
    const stNum = record.ST_NUM || "";
    const stNum2 = record.ST_NUM2 ? `-${record.ST_NUM2}` : "";
    const stName = record.ST_NAME || "";
    const unit = record.UNIT_NUM ? `Unit ${record.UNIT_NUM}` : "";
    const city = record.CITY || "";
    const zipCode = record.ZIP_CODE || "";
    const fullAddress =
          `${stNum}${stNum2} ${stName}`.trim() + (unit ? `, ${unit}` : "") +
          (city ? `, ${city}` : "") + (zipCode ? `, ${zipCode}` : "");

    // Assemble PropertyOverview
    console.log('[PropertyClient] Assembling property overview');
    const propertyOverview: PropertyOverview = {
      parcelId: ParcelId.create(record.PID),
      fullAddress,
      propertyType: record.LU_DESC || "",
      owners: record.OWNER ? [record.OWNER] : [],
      lotSize: parseFloat(record.LAND_SF) || 0,
      livingArea: parseFloat(record.LIVING_AREA) || 0,
      yearBuilt: parseInt(record.YR_BUILT) || 0,
      assessedValue: parseFloat(record.TOTAL_VALUE) || 0,
      netTax: parseFloat(record.GROSS_TAX) || 0,
      hasResidentialExemption: record.OWN_OCC === "Y",
      hasPersonalExemption: false,
      classificationCode: record.LUC || ""
    };

    // Assemble PropertyAttributes
    console.log('[PropertyClient] Assembling property attributes');
    const attributes: PropertyAttributes = {
      bedrooms: parseInt(record.BED_RMS) || 0,
      bedroomType: record.BDRM_COND || "",
      bathrooms: parseInt(record.FULL_BTH) || 0,
      halfBathrooms: parseInt(record.HALF_BTH) || 0,
      bathStyle1: record.BTHRM_STYLE1 || "",
      bathStyle2: record.BTHRM_STYLE2 || "",
      bathStyle3: record.BTHRM_STYLE3 || "",
      kitchens: parseInt(record.KITCHEN) || 0,
      kitchenType: record.KITCHEN_TYPE || "",
      kitchenStyle1: record.KITCHEN_STYLE1 || "",
      kitchenStyle2: record.KITCHEN_STYLE2 || "",
      kitchenStyle3: record.KITCHEN_STYLE3 || "",
      fireplaces: parseInt(record.FIRE_PLACE) || 0,
      acType: record.AC_TYPE || "",
      heatType: record.HEAT_TYPE || "",
      interiorCondition: record.INT_COND || "",
      interiorFinish: record.INT_WALL || "",
      totalRooms: parseInt(record.TT_RMS) || 0,
      exteriorFinish: record.EXT_FINISHED || "",
      exteriorCondition: record.EXT_COND || "",
      view: record.PROP_VIEW || "",
      grade: record.OVERALL_COND || "",
      yearBuilt: parseInt(record.YR_BUILT) || 0,
      roofCover: record.ROOF_COVER || "",
      roofStructure: record.ROOF_STRUCTURE || "",
      foundation: record.STRUCTURE_CLASS || "",
      landUse: record.LU || "",
      parkSpots: parseInt(record.NUM_PARKING) || 0,
      parkingOwnership: "",
      parkingType: "",
      tandemParking: false,
      propertyType: record.LU_DESC || "",
      lotSize: parseFloat(record.LAND_SF) || 0,
      livingArea: parseFloat(record.LIVING_AREA) || 0,
      floor: parseInt(record.CD_FLOOR) || 0,
      penthouseUnit: false,
      complex: "",
      storyHeight: 0,
      style: record.BLDG_TYPE || "",
      orientation: record.ORIENTATION || ""
    };

    // Assemble PropertyValue
    console.log('[PropertyClient] Assembling property value information');
    const propertyValue: PropertyValue = {
      buildingValue: parseFloat(record.BLDG_VALUE) || 0,
      landValue: parseFloat(record.LAND_VALUE) || 0,
      assessedValue: parseFloat(record.TOTAL_VALUE) || 0,
      historicalValues: []
    };

    // Assemble PropertyTax
    console.log('[PropertyClient] Assembling property tax information');
    const propertyTax: PropertyTax = {
      assessedValue: parseFloat(record.TOTAL_VALUE) || 0,
      isResidential: isResidential(record.LUC) || false,
      taxRate: isResidential(record.LUC) ? 11.58 : 25.96,
      grossTax: parseFloat(record.GROSS_TAX) || 0,
      residentialExemption: record.OWN_OCC === "Y" ? 0 : 0,
      personalExemption: 0,
      communityPreservationFee: 0,
      netTax: parseFloat(record.GROSS_TAX) || 0
    };

    const propertyDetails = {
      overview: propertyOverview,
      attributes: attributes,
      value: propertyValue,
      tax: propertyTax
    };

    console.log(
      `[PropertyClient] Successfully assembled property details for parcelId: ${
        record.PID}`);
    return propertyDetails;
  } catch (error) {
    console.error('[PropertyClient] Error fetching property details:', error);
    console.error(`[PropertyClient] Stack trace: ${error instanceof Error ? 
      error.stack : 'No stack trace available'}`);
    throw error;
  }
}