import {onCall} from "firebase-functions/v2/https";
import {assemblePropertySearchQuery, executePropertySearchQuery} from
  "../lib/PropertyClient";
import {SearchPropertiesRequest} from "../types";

/**
 * Callable function that searches for properties based on a search string.
 * The search string can be either a parcel ID or part of a property's address.
 *
 * @param request.searchString - The string to search for (parcel ID or address)
 * @param request.isDetailed - Whether to return detailed results including
 * owner and value
 * @returns An array of SearchResult or DetailedSearchResult objects
 */
export const searchProperties =
onCall<SearchPropertiesRequest>(async (request) => {
  console.log(`[SearchProperties] Function called with searchString: "${
    request.data?.searchString}", isDetailed: ${request.data?.isDetailed}`);

  try {
    const {searchString, isDetailed = false} = request.data;

    if (!searchString) {
      console.warn("[SearchProperties] Missing searchString in request");
      throw new Error("Search string is required");
    }

    console.log(`[SearchProperties] Assembling search query for: "${
      searchString}"`);
    const query = assemblePropertySearchQuery(searchString, isDetailed);

    console.log("[SearchProperties] Executing property search query");
    const results = await executePropertySearchQuery(query, isDetailed);

    console.log(`[SearchProperties] Search completed. Found ${
      results.length} results`);
    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("[SearchProperties] Error:", error);
    console.error(`[SearchProperties] Stack trace: ${error instanceof Error ?
      error.stack : "No stack trace available"}`);
    throw new Error(error instanceof Error ? error.message :
      "An error occurred while searching properties");
  }
});
