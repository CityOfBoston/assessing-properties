/**
 * A type representing the data for the OverviewSection component.
 */
export interface OverviewSectionData {
  fullAddress: string;
  owners: string[];
  imageSrc: string;
  assessedValue: number;
  propertyType: string;
  parcelId: string;
  netTax: number;
  personalExemptionFlag: boolean;
  residentialExemptionFlag: boolean;
  personalExemptionAmount: number;
  residentialExemptionAmount: number;
}

/**
 * A type representing the data for the PropertyValueSection component.
 */
export interface PropertyValueSectionData {
  historicPropertyValues: {
    [year: number]: number;
  };
}

/**
 * A type representing the attributes of a property.
 */
export interface PropertyAttributesData {
  // General
  landUse?: string;
  livingArea?: string;
  style?: string;
  storyHeight?: string;
  floor?: string;
  penthouseUnit?: string;
  orientation?: string;

  // Rooms
  bedroomNumber?: string;
  totalBathrooms?: string;
  halfBathrooms?: string;
  bathStyle1?: string;
  bathStyle2?: string;
  bathStyle3?: string;
  numberOfKitchens?: string;
  kitchenType?: string;
  kitchenStyle1?: string;
  kitchenStyle2?: string;
  kitchenStyle3?: string;

  //Constructions
  yearBuilt?: string;
  exteriorFinish?: string;
  exteriorCondition?: string;
  roofCover?: string;
  roofStructure?: string;
  foundation?: string;
  parkingSpots?: string;

  // Utilities
  heatType?: string;
  acType?: string;
  fireplaces?: string;

  // Last Transaction
  salePrice?: string;
  saleDate?: string;
  registryBookAndPlace?: string;
}

/**
 * A type representing the data for the PropertyTaxesSection component.
 */
export interface PropertyTaxesSectionData {
  propertyGrossTax: number;
  residentialExemptionFlag: boolean;
  personalExemptionFlag: boolean;
  residentialExemptionAmount: number;
  personalExemptionAmount: number;
  communityPreservationAmount: number;
  propertyNetTax: number;
  parcelId: string
}

/**
 * Data object for all property details sections, uses a constructor
 * that takes in all fields flat and assembles them into data for each
 * section. This is used to avoid deeply nested objects and simplify
 * instance where the same field and value is used for two and more
 * sections and to make the data object easier to understand and
 * maintain.
 */
export interface PropertyDetailsData {
  overview: OverviewSectionData;
  propertyValue: PropertyValueSectionData;
  propertyAttributes: PropertyAttributesData;
  propertyTaxes: PropertyTaxesSectionData;
}

/**
 * Class implementation of PropertyDetailsData that provides a constructor
 * to assemble the data object from flat fields.
 */
export class PropertyDetails implements PropertyDetailsData {
  overview: OverviewSectionData;
  propertyValue: PropertyValueSectionData;
  propertyAttributes: PropertyAttributesData;
  propertyTaxes: PropertyTaxesSectionData;

  constructor(data: {
    // Overview fields
    fullAddress: string;
    owners: string[];
    imageSrc: string;
    assessedValue: number;
    propertyType: string;
    parcelId: string;
    propertyNetTax: number;
    personalExemptionFlag: boolean;
    residentialExemptionFlag: boolean;

    // Property Value fields
    historicPropertyValues: { [year: number]: number };

    // Property Attributes fields
    landUse?: string;
    livingArea?: string;
    style?: string;
    storyHeight?: string;
    floor?: string;
    penthouseUnit?: string;
    orientation?: string;
    bedroomNumber?: string;
    totalBathrooms?: string;
    halfBathrooms?: string;
    bathStyle1?: string;
    bathStyle2?: string;
    bathStyle3?: string;
    numberOfKitchens?: string;
    kitchenType?: string;
    kitchenStyle1?: string;
    kitchenStyle2?: string;
    kitchenStyle3?: string;
    yearBuilt?: string;
    exteriorFinish?: string;
    exteriorCondition?: string;
    roofCover?: string;
    roofStructure?: string;
    foundation?: string;
    parkingSpots?: string;
    heatType?: string;
    acType?: string;
    fireplaces?: string;
    salePrice?: string;
    saleDate?: string;
    registryBookAndPlace?: string;

    // Property Taxes fields
    propertyGrossTax: number;
    residentialExemptionAmount: number;
    personalExemptionAmount: number;
    communityPreservationAmount: number;
  }) {
    // Construct overview section
    this.overview = {
      fullAddress: data.fullAddress,
      owners: data.owners,
      imageSrc: data.imageSrc,
      assessedValue: data.assessedValue,
      propertyType: data.propertyType,
      parcelId: data.parcelId,
      netTax: data.propertyNetTax,
      personalExemptionFlag: data.personalExemptionFlag,
      residentialExemptionFlag: data.residentialExemptionFlag,
      personalExemptionAmount: data.personalExemptionAmount,
      residentialExemptionAmount: data.residentialExemptionAmount
    };

    // Construct property value section
    this.propertyValue = {
      historicPropertyValues: data.historicPropertyValues,
    };

    // Construct property attributes section
    this.propertyAttributes = {
      landUse: data.landUse,
      livingArea: data.livingArea,
      style: data.style,
      storyHeight: data.storyHeight,
      floor: data.floor,
      penthouseUnit: data.penthouseUnit,
      orientation: data.orientation,  
      bedroomNumber: data.bedroomNumber,
      totalBathrooms: data.totalBathrooms,
      halfBathrooms: data.halfBathrooms,
      bathStyle1: data.bathStyle1,
      bathStyle2: data.bathStyle2,
      bathStyle3: data.bathStyle3,
      numberOfKitchens: data.numberOfKitchens,
      kitchenType: data.kitchenType,
      kitchenStyle1: data.kitchenStyle1,
      kitchenStyle2: data.kitchenStyle2,
      kitchenStyle3: data.kitchenStyle3,
      yearBuilt: data.yearBuilt,
      exteriorFinish: data.exteriorFinish,
      exteriorCondition: data.exteriorCondition,
      roofCover: data.roofCover,
      roofStructure: data.roofStructure,
      foundation: data.foundation,
      parkingSpots: data.parkingSpots,
      heatType: data.heatType,
      acType: data.acType,
      fireplaces: data.fireplaces,
      salePrice: data.salePrice,
      saleDate: data.saleDate,
      registryBookAndPlace: data.registryBookAndPlace
    };

    // Construct property taxes section
    this.propertyTaxes = {
      propertyGrossTax: data.propertyGrossTax,
      residentialExemptionFlag: data.residentialExemptionFlag,
      personalExemptionFlag: data.personalExemptionFlag,
      residentialExemptionAmount: data.residentialExemptionAmount,
      personalExemptionAmount: data.personalExemptionAmount,
      communityPreservationAmount: data.communityPreservationAmount,
      propertyNetTax: data.propertyNetTax,
      parcelId: data.parcelId,
    };
  }
}

/**
 * A type representing a single property search result.
 */
export interface PropertySearchResult {
  parcelId: string;
  address: string;
  owners: string[];
  value: number;
}

/**
 * A type representing the results of a property search.
 */
export interface PropertySearchResults {
  results: PropertySearchResult[];
}

export interface PropertySearchSuggestion {
  fullAddress: string;
  parcelId: string;
}

export interface PropertySearchSuggestions {
  suggestions: PropertySearchSuggestion[];
}

export interface FeedbackData {
  parcelId: string;
  hasPositiveSentiment: boolean;
  feedbackMessage?: string;
}

// Standard response interface
export interface StandardResponse<T = any> {
  status: "success" | "error";
  message: string;
  data?: T;
}