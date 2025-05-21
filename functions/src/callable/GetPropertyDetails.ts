import {onCall, HttpsError} from "firebase-functions/v2/https";
import { ParcelId } from "../types";
import { assemblePropertyDetailsQuery, 
    executePropertyDetailsQuery } from "../lib/PropertyClient";
import { GetPropertyDetailsRequest } from "../types";
/**
 * Callable function that gets all details for a property given a property id 
 * in the request body.
 * 
 * @param request.propertyId - The id of the property to get details for.
 * @returns A PropertyDetails object.
 */
export const getPropertyDetails = onCall<GetPropertyDetailsRequest>(
    async (request) => {
        console.log(`[GetPropertyDetails] Function called with propertyId: ${
            request.data?.propertyId}`);
        
        try {
            // Validate input
            if (!request.data?.propertyId) {
                console.warn(
                    '[GetPropertyDetails] Missing propertyId in request');
                throw new HttpsError('invalid-argument', 
                    'Property ID is required');
            }

            // Create ParcelId object and execute query
            console.log(`[GetPropertyDetails] Creating ParcelId object for: ${
                request.data.propertyId}`);
            const parcelId = ParcelId.create(request.data.propertyId);
            
            console.log(`[GetPropertyDetails] Assembling query for parcelId: ${
                parcelId.toString()}`);
            const query = assemblePropertyDetailsQuery(parcelId);
            
            console.log(
                '[GetPropertyDetails] Executing property details query');
            const propertyDetails = await executePropertyDetailsQuery(query);
            
            console.log(
                `[GetPropertyDetails] Successfully retrieved details 
                for property: ${request.data.propertyId}`);
            return propertyDetails;
        } catch (error) {
            console.error('[GetPropertyDetails] Error:', error);
            if (error instanceof HttpsError) {
                console.error(`[GetPropertyDetails] HTTP Error - code: ${
                    error.code}, message: ${error.message}`);
                throw error;
            }
            console.error('[GetPropertyDetails] Internal Error:', error);
            throw new HttpsError('internal', 
                'An error occurred while fetching property details');
        }
    }
);
