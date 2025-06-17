import * as admin from "firebase-admin";
import {FeedbackData} from "../types";

export const db = admin.firestore();
export const registrationDataRef = db.collection("feedbackData");

/**
 * Given feedback data, saves it to feedbackData collection in Firestore.
 *
 * @param feedbackData - The feedback data to save.
 */
export const saveFeedbackData = async (feedbackData: FeedbackData) => {
  console.log("[FirestoreClient] Attempting to save feedback data:", {
    parcelId: feedbackData.parcelId.toString(),
    createdAt: feedbackData.createdAt,
    isPositive: feedbackData.postiveFeedback,
  });

  try {
    const docRef = await registrationDataRef.add(feedbackData);
    console.log(`[FirestoreClient] Successfully saved feedback data with ID:
            ${docRef.id}`);
  } catch (error) {
    console.error("[FirestoreClient] Error saving feedback data:", error);
    console.error(`[FirestoreClient] Stack trace: ${error instanceof Error ?
      error.stack : "No stack trace available"}`);
    throw error;
  }
};
