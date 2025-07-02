/**
 * Schedule cloud function that runs GenerateAndStoreParcelIdAddressPairings
 * at the start of every year to generate
 * the latest parcelId and address pairings and store them in Firebase storage.
 */

import {onSchedule} from "firebase-functions/v2/scheduler";
import {generateAndStoreParcelIdAddressPairings} from "../https/GenerateAndStoreParcelIdAddressPairings";

export const runYearlyParcelIdAddressPairingsUpdate = onSchedule(
  {
    schedule: "0 0 1 1 *", // Run at midnight on January 1st every year
    timeZone: "America/New_York",
  },
  async (event) => {
    console.log("[RunYearlyParcelIdAddressPairingsUpdate] Scheduled function triggered");

    try {
      // Create a mock request/response to call the HTTP function
      const mockReq = {
        method: "POST",
        headers: {},
        body: {},
      } as any;

      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            console.log("[RunYearlyParcelIdAddressPairingsUpdate] HTTP function response:", data);
          },
        }),
      } as any;

      await generateAndStoreParcelIdAddressPairings(mockReq, mockRes);
      console.log("[RunYearlyParcelIdAddressPairingsUpdate] Successfully completed yearly update");
    } catch (error) {
      console.error("[RunYearlyParcelIdAddressPairingsUpdate] Error in yearly update process:", error);
      throw error;
    }
  }
);
