/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 */

import {getSearchSuggestions} from "./callable/getSearchSuggestions";
import {getSearchResults} from "./callable/getSearchResults";
import {getPropertyDetails} from "./callable/getPropertyDetails";
import {postPropertyFeedback} from "./callable/postPropertyFeedback";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export {
  getSearchSuggestions,
  getSearchResults,
  getPropertyDetails,
  postPropertyFeedback,
};
