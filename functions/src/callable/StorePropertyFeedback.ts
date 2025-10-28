/**
 * Callable cloud function that stores property feedback from the frontend to
 * Firestore.
 */

import {createCallable, createSuccessResponse} from "../lib/FunctionsClient";
import {addFeedbackData} from "../lib/FirestoreClient";
import {FeedbackData} from "../types";

export const storePropertyFeedback = createCallable(async (data: FeedbackData) => {
  // Validate input data based on feedback type
  if (!data.type) {
    console.error("[StorePropertyFeedback] Missing required field: type");
    throw new Error("type is required");
  }

  if (data.type === "property") {
    // Validate property feedback
    if (!data.parcelId) {
      console.error("[StorePropertyFeedback] Missing required field: parcelId for property feedback");
      throw new Error("parcelId is required for property feedback");
    }

    if (typeof data.hasPositiveSentiment !== "boolean") {
      console.error("[StorePropertyFeedback] Missing or invalid field: hasPositiveSentiment for property feedback");
      throw new Error("hasPositiveSentiment must be a boolean for property feedback");
    }

    console.log(`[StorePropertyFeedback] Property feedback validation passed. ParcelId: ${data.parcelId}, Positive: ${data.hasPositiveSentiment}`);
  } else if (data.type === "general") {
    // Validate general feedback
    if (!data.issueType) {
      console.error("[StorePropertyFeedback] Missing required field: issueType for general feedback");
      throw new Error("issueType is required for general feedback");
    }

    if (!["not-found", "bug", "suggestion"].includes(data.issueType)) {
      console.error("[StorePropertyFeedback] Invalid issueType for general feedback:", data.issueType);
      throw new Error("issueType must be one of: not-found, bug, suggestion");
    }

    const source = data.searchQuery ? "search_results" : "welcome";
    console.log(`[StorePropertyFeedback] General feedback validation passed. IssueType: ${data.issueType}, Source: ${source}`);
  } else {
    console.error("[StorePropertyFeedback] Invalid feedback type:", (data as any).type);
    throw new Error("type must be either 'property' or 'general'");
  }

  // Store feedback using FirestoreClient
  await addFeedbackData(data);

  const logMessage = data.type === "property" ?
    `Successfully stored property feedback for parcelId: ${data.parcelId}` :
    `Successfully stored general feedback with issueType: ${data.issueType}`;

  console.log(`[StorePropertyFeedback] ${logMessage}`);

  return createSuccessResponse(null, "Feedback stored successfully");
});
