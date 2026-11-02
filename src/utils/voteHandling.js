import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Submits a vote for a specific model.
 * Voting is now officially closed.
 */
export const submitVote = async (user, modelSlug, modelName) => {
  throw new Error("Voting has officially ended. No new votes can be accepted.");
};

/**
 * Gets the total number of votes for a specific model.
 * 
 * @param {string} modelSlug - The slug of the model
 * @returns {number} The total vote count
 */
export const getVoteCount = async (modelSlug) => {
  if (!db) return 0;
  try {
    const votesCol = collection(db, "votes_v3");
    const q = query(votesCol, where("modelSlug", "==", modelSlug));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error fetching vote count:", error);
    return 0;
  }
};
