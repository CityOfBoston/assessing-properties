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
  personalExemption: boolean;
  residentialExemption: boolean;
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
  // Bedrooms
  bedroomNumber?: number;
  bedroomType?: string;
  totalRooms?: number;

  // Bathrooms
  totalBathrooms?: number;
  halfBathrooms?: number;
  bathStyle1?: string;
  bathStyle2?: string;
  bathStyle3?: string;

  // Kitchen
  numberOfKitchens?: number;
  kitchenType?: string;
  kitchenStyle1?: string;
  kitchenStyle2?: string;
  kitchenStyle3?: string;

  // Utilities
  fireplaces?: number;
  acType?: string;
  heatType?: string;

  // Interior
  interiorCondition?: string;
  interiorFinish?: string;

  // Exterior
  exteriorFinish?: string;
  exteriorCondition?: string;
  view?: string;
  grade?: string;

  // Construction
  yearBuilt?: number;
  roofCover?: string;
  roofStructure?: string;
  foundation?: string;
  landUse?: string;

  // Last Transaction
  salePrice?: number;
  saleDate?: string;
  registryBookAndPlace?: string;

  // Parking
  parkingSpots?: number;
  parkingOwnership?: string;
  parkingType?: string;
  tandemParking?: boolean;

  // Details
  propertyType?: string;
  livingArea?: number;
  floor?: number;
  penthouseUnit?: boolean;
  complex?: string;
  storyHeight?: number;
  style?: string;
  orientation?: string;
}

/**
 * A type representing the data for the PropertyTaxesSection component.
 */
export interface PropertyTaxesSectionData {
  propertyGrossTax: number;
  residentialExemption: number;
  personalExemption: number;
  communityPreservation: number;
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
    personalExemption: boolean;
    residentialExemption: boolean;

    // Property Value fields
    historicPropertyValues: { [year: number]: number };

    // Property Attributes fields
    bedroomNumber?: number;
    bedroomType?: string;
    totalRooms?: number;
    totalBathrooms?: number;
    halfBathrooms?: number;
    bathStyle1?: string;
    bathStyle2?: string;
    bathStyle3?: string;
    numberOfKitchens?: number;
    kitchenType?: string;
    kitchenStyle1?: string;
    kitchenStyle2?: string;
    kitchenStyle3?: string;
    fireplaces?: number;
    acType?: string;
    heatType?: string;
    interiorCondition?: string;
    interiorFinish?: string;
    exteriorFinish?: string;
    exteriorCondition?: string;
    view?: string;
    grade?: string;
    yearBuilt?: number;
    roofCover?: string;
    roofStructure?: string;
    foundation?: string;
    landUse?: string;
    salePrice?: number;
    saleDate?: string;
    registryBookAndPlace?: string;
    parkingSpots?: number;
    parkingOwnership?: string;
    parkingType?: string;
    tandemParking?: boolean;
    livingArea?: number;
    floor?: number;
    penthouseUnit?: boolean;
    complex?: string;
    storyHeight?: number;
    style?: string;
    orientation?: string;

    // Property Taxes fields
    propertyGrossTax: number;
    residentialExemptionAmount: number;
    personalExemptionAmount: number;
    communityPreservation: number;
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
      personalExemption: data.personalExemption,
      residentialExemption: data.residentialExemption,
    };

    // Construct property value section
    this.propertyValue = {
      historicPropertyValues: data.historicPropertyValues,
    };

    // Construct property attributes section
    this.propertyAttributes = {
      bedroomNumber: data.bedroomNumber,
      bedroomType: data.bedroomType,
      totalRooms: data.totalRooms,
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
      fireplaces: data.fireplaces,
      acType: data.acType,
      heatType: data.heatType,
      interiorCondition: data.interiorCondition,
      interiorFinish: data.interiorFinish,
      exteriorFinish: data.exteriorFinish,
      exteriorCondition: data.exteriorCondition,
      view: data.view,
      grade: data.grade,
      yearBuilt: data.yearBuilt,
      roofCover: data.roofCover,
      roofStructure: data.roofStructure,
      foundation: data.foundation,
      landUse: data.landUse,
      salePrice: data.salePrice,
      saleDate: data.saleDate,
      registryBookAndPlace: data.registryBookAndPlace,
      parkingSpots: data.parkingSpots,
      parkingOwnership: data.parkingOwnership,
      parkingType: data.parkingType,
      tandemParking: data.tandemParking,
      livingArea: data.livingArea,
      floor: data.floor,
      penthouseUnit: data.penthouseUnit,
      complex: data.complex,
      storyHeight: data.storyHeight,
      style: data.style,
      orientation: data.orientation,
    };

    // Construct property taxes section
    this.propertyTaxes = {
      propertyGrossTax: data.propertyGrossTax,
      residentialExemption: data.residentialExemptionAmount,
      personalExemption: data.personalExemptionAmount,
      communityPreservation: data.communityPreservation,
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
