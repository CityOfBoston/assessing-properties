import * as admin from "firebase-admin";
import {Timestamp} from "firebase-admin/firestore";
import {FeedbackData} from "../types";

export const db = admin.firestore();
export const feedbackDataRef = db.collection("feedback");

/**
 * Given feedback data, add it to the feedback collection in Firestore along
 * with a timestamp of the current date and time as the createdAt field.
 *
 * @param feedbackData The feedback data to add to the feedback collection.
 */
export const addFeedbackData = async (feedbackData: FeedbackData): Promise<void> => {
  console.log(`[FirestoreClient] Adding feedback data for parcelId: ${feedbackData.parcelId}`);

  try {
    const feedbackDoc = {
      ...feedbackData,
      createdAt: Timestamp.now(),
    };

    await feedbackDataRef.add(feedbackDoc);

    console.log(`[FirestoreClient] Successfully added feedback data for parcelId: ${feedbackData.parcelId}`);
  } catch (error) {
    console.error(`[FirestoreClient] Error adding feedback data for parcelId: ${feedbackData.parcelId}`, error);
    throw error;
  }
};
