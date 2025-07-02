/**
 * Callable cloud function that stores property feedback from the frontend to
 * Firestore.
 */

import {createCallable, createSuccessResponse} from "../lib/FunctionsClient";
import {addFeedbackData} from "../lib/FirestoreClient";
import {FeedbackData} from "../types";

export const storePropertyFeedback = createCallable(async (data: FeedbackData) => {
  // Validate input data
  if (!data.parcelId) {
    console.error("[StorePropertyFeedback] Missing required field: parcelId");
    throw new Error("parcelId is required");
  }

  if (typeof data.hasPositiveSentiment !== "boolean") {
    console.error("[StorePropertyFeedback] Missing or invalid field: hasPositiveSentiment");
    throw new Error("hasPositiveSentiment must be a boolean");
  }

  console.log(`[StorePropertyFeedback] Input validation passed. ParcelId: ${data.parcelId}, Positive: ${data.hasPositiveSentiment}`);

  // Store feedback using FirestoreClient
  await addFeedbackData(data);

  console.log(`[StorePropertyFeedback] Successfully stored feedback for parcelId: ${data.parcelId}`);

  return createSuccessResponse(null, "Feedback stored successfully");
});
