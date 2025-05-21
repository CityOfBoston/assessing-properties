import {onCall} from "firebase-functions/v2/https";
import { saveFeedbackData } from "../lib/FirestoreClient";
import { ParcelId, FeedbackData } from "../types";
import { PostFeedbackRequest } from "../types";

/**
 * Callable function that assembles feedback data using current timestamp
 * and request body information, then saves it to Firestore.
 * 
 * @param request.parcelId - The parcel id of the property.
 * @param request.isPositive - Whether the feedback is positive or negative.
 * @param request.additionalDetails - Additional details about the feedback.
 * @returns A success message.
 */
export const postFeedback = onCall<PostFeedbackRequest>(
    async (request) => {
        console.log(
            `[PostFeedback] Function called with parcelId: ${
                request.data?.parcelId
            }, isPositive: ${
                request.data?.isPositive
            }, additionalDetails: ${
                request.data?.additionalDetails}`);
        
        try {
            const {parcelId, isPositive, additionalDetails} = request.data;
            
            console.log(
                `[PostFeedback] Creating ParcelId object for: ${parcelId}`);
            const parcelIdObj = ParcelId.create(parcelId);
            
            console.log('[PostFeedback] Assembling feedback data');
            const feedbackData: FeedbackData = {
                parcelId: parcelIdObj,
                createdAt: new Date(),
                postiveFeedback: isPositive,
                additionalDetails,
            };
            
            console.log('[PostFeedback] Saving feedback data to Firestore');
            await saveFeedbackData(feedbackData);
            
            console.log('[PostFeedback] Successfully saved feedback data');
            return {success: true};
        } catch (error) {
            console.error('[PostFeedback] Error:', error);
            console.error(`[PostFeedback] Stack trace: ${error instanceof Error 
                ? error.stack : 'No stack trace available'}`);
            throw error;
        }
    }
);
