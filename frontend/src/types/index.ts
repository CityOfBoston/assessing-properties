/**
 * A type representing a valid parcel ID.
 * Must be a 10-digit number.
 */
export class ParcelId {
  private static readonly VALID_LENGTH = 10;
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
     * Creates a new ParcelId from a number or string.
     * @throws Error if the input is not a valid 10-digit number
     */
  static create(input: number | string): ParcelId {
    const num = typeof input === "string" ? parseInt(input, 10) : input;

    if (isNaN(num)) {
      throw new Error("ParcelId must be a valid number");
    }

    const str = num.toString();
    if (str.length !== this.VALID_LENGTH) {
      throw new Error(
        `ParcelId must be exactly ${this.VALID_LENGTH} digits`
      );
    }

    return new ParcelId(num);
  }

  /**
     * Returns the numeric value of the parcel ID
     */
  toNumber(): number {
    return this.value;
  }

  /**
     * Returns the string representation of the parcel ID
     */
  toString(): string {
    return this.value.toString().padStart(ParcelId.VALID_LENGTH, "0");
  }
}

/**
 * Declares a data object called feedbackData that has the following
 * properties:
 * - parcelId: 10 digit number representing the property's parcel id
 * - createdAt: timestamp representing the date and time the feedback was
 * submitted
 * - postiveFeedback: boolean representing whether the feedback is positive or
 * negative
 * - additionalDetails: string up to 200 characters long containing additional
 * feedback the user provided
 */
export interface FeedbackData {
    parcelId: ParcelId;
    createdAt: Date;
    postiveFeedback: boolean;
    additionalDetails: string;
}



/**
 * Declares a data object called SearchResult that has the following
 * properties:
 * - fullAddress: string representing the property's concatenated full address
 * - parcelId: ParcelId object representing the property's parcel id
 */
export interface SearchResult {
  fullAddress: string;
  parcelId: ParcelId;
}

/** Declares a data object called DetailedSearchResult that has the following
* properties:
* - parcelId: 10 digit number representing the property's parcel id
* - fullAddress: string representing the property's concatenated full address
* - owners: array of strings representing the property's owner(s) name(s)
* - value: number representing the property's assessed value for the current
* fiscal year
*/
export interface DetailedSearchResult {
  parcelId: ParcelId;
  fullAddress: string;
  owners: string[];
  value: number;
}

/**
* Declares a data object called propertyOverview that has the following
* properties:
* - fullAddress: string representing the property's concatenated full address
* - owners: array of strings representing the property's owner(s) name(s)
* - propertyType: string representing the property's type
* - parcelId: 10 digit number representing the property's parcel id
* - lotSize: number representing the property's lot size in square feet
* - livingArea: number representing the property's living area in square feet
* - yearBuilt: number representing the property's year built
* - assessedValue: number representing the property's assessed value for the
* current fiscal year
* - netTax: number representing the property's net tax for the current fiscal
* - hasResidentialExemption: boolean representing whether the property has a
* residential exemption
* - hasPersonalExemption: boolean representing whether the property has a
* personal exemption
* - classificationCode: string representing the property's classification code
*/
export interface PropertyOverview {
  parcelId: ParcelId;
  fullAddress: string;
  propertyType: string;
  owners: string[];
  lotSize: number;
  livingArea: number;
  yearBuilt: number;
  assessedValue: number;
  netTax: number;
  hasResidentialExemption: boolean;
  hasPersonalExemption: boolean;
  classificationCode: string;
}

/**
* Declares a data object called propertyAttributes that has the following
* properties:
* - bedrooms: number representing the property's number of bedrooms
* - bedroomType: string representing the property's bedroom condition
* - bathrooms: number representing the property's number of bathrooms
* - halfBathrooms: number representing the property's number of half bathrooms
* - bathStyle1: string representing the property's bathroom style
* - bathStyle2: string representing the property's bathroom style
* - bathStyle3: string representing the property's bathroom style
* - kitchens: number representing the property's number of kitchens
* - kitchenType: string representing the property's kitchen condition
* - kitchenStyle1: string representing the property's kitchen style
* - kitchenStyle2: string representing the property's kitchen style
* - kitchenStyle3: string representing the property's kitchen style
* - fireplaces: number representing the property's number of fireplaces
* - acType: string representing the property's air conditioning type
* - heatType: string representing the property's heating type
* - interiorCondition: string representing the property's interior condition
* - interiorFinish: string representing the property's interior finish
* - totalRooms: number representing the property's total number of rooms
* - exteriorFinish: string representing the property's exterior finish
* - exteriorCondition: string representing the property's exterior condition
* - view: string representing the property's view
* - grade: string representing the property's grade
* - yearBuilt: number representing the property's year built
* - roofCover: string representing the property's roof cover material
* - roofStructure: string representing the property's roof structure
* - foundation: string representing the property's foundation material
* - landUse: string representing the property's land use
* - parkSpots: number representing the property's number of parking spots
* - parkingOwnership: string representing the property's parking ownership
* - parkingType: string representing the property's parking type
* - tandemParking: boolean representing whether the property has tandem parking
* - propertyType: string representing the property's type
* - lotSize: number representing the property's lot size in square feet
* - livingArea: number representing the property's living area in square feet
* - floor: number representing the property's floor number
* - penthouseUnit: boolean representing whether the property is a penthouse
* unit
* - complex: string representing the property's complex name
* - storyHeight: number representing the property's story height in feet
* - style: string representing the property's style
* - orientation: string representing the property's orientation
*/
export interface PropertyAttributes {}

/**
* Declares a data object called propertyValue that has the following values:
* - buildingValue: number representing the property's building value for the
* current fiscal year
* - landValue: number representing the property's land value for the current
* fiscal year
* - assessedValue: number representing the property's assessed value for the
* current fiscal year
* - historicalValues: array of numbers representing the property's past
* assessed values
*/
export interface PropertyValue {
  buildingValue: number;
  landValue: number;
  assessedValue: number;
  historicalValues: number[];
}

/**
* Declares a data object called propertyTax that has the following properties:
* - assessedValue: number representing the property's assessed value for the
* current fiscal year
* - isResidential: boolean representing whether the property is residential
* - taxRate: number representing the property's tax rate
* - grossTax: number representing the property's gross tax
* - residentialExemption: number representing the property's residential
* exemption
* - personalExemption: number representing the property's personal exemption
* - communityPreservationFee: number representing the property's community
* preservation fee
* - netTax: number representing the property's net tax for the current fiscal
* year
*/
export interface PropertyTax {
  assessedValue: number;
  isResidential: boolean;
  taxRate: number;
  grossTax: number;
  residentialExemption: number;
  personalExemption: number;
  communityPreservationFee: number;
  netTax: number;
}


/** Declares a data object called propertyDetails that has the following
* properties:
* - overview: PropertyOverview object
* - attributes: PropertyAttributes object
* - value: PropertyValue object
* - tax: PropertyTax object
*/
export interface PropertyDetails {
  overview: PropertyOverview;
  attributes: PropertyAttributes;
  value: PropertyValue;
  tax: PropertyTax;
}


/**
 * Declares a data object called GetPropertyDetailsRequest that has the following
 * properties:
 * - propertyId: string representing the property's parcel id
 */
export interface GetPropertyDetailsRequest {
    propertyId: string;
}

/**
 * Declares a data object called PostFeedbackRequest that has the following
 * properties:
 * - parcelId: string representing the property's parcel id
 * - isPositive: boolean representing whether the feedback is positive or
 * negative
 * - additionalDetails: string representing the additional details of the
 * feedback
 */
export interface PostFeedbackRequest {
  parcelId: string;
  isPositive: boolean;
  additionalDetails: string;
}

/**
 * Declares a data object called SearchPropertiesRequest that has the following
 * properties:
 * - searchString: string representing the search string
 * - isDetailed: boolean representing whether the search is detailed
 */
export interface SearchPropertiesRequest {
  searchString: string;
  isDetailed?: boolean;
}

/**
 * Declares a data object called SearchPropertiesResponse that has the following
 * properties:
 * - success: boolean representing whether the search was successful
 * - data: array of SearchResult objects representing the search results
 */
export interface SearchPropertiesResponse {
  success: boolean;
  data: SearchResult[] | DetailedSearchResult[];
}
