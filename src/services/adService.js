import { fetchData } from "../../utils/ApiUtility";

/**
 * getAdHierarchy
 *
 * Fetches a single level of AD hierarchy given a baseDN and some optional parameters.
 * Relies on the global fetchData function, which includes:
 *   - Bearer token from localStorage
 *   - JSON parsing
 *
 * @param {string} baseDN            - The DN to start from
 * @param {number} [depth=1]         - Depth of the search (1 means one level)
 * @param {number} [pageSize=10]     - Number of items per page
 * @param {number} [page=1]          - Page number
 * @param {string} [sortBy="name"]   - Sorting field
 * @param {string} [sortOrder="asc"] - Sort order
 * @param {AbortSignal} [signal]     - Optional abort signal
 * @returns {Promise<Object>}        - Parsed JSON from the server
 */
export async function getAdHierarchy(
  baseDN,
  depth = 1,
  pageSize = 10,
  page = 1,
  sortBy = "name",
  sortOrder = "asc",
  signal
) {
  try {
    const endpoint =
      `/api/v1/ad/ad-hierarchy` +
      `?baseDN=${encodeURIComponent(baseDN)}` +
      `&depth=${depth}` +
      `&pageSize=${pageSize}` +
      `&page=${page}` +
      `&sortBy=${sortBy}` +
      `&sortOrder=${sortOrder}`;

    // method = "GET", no body needed
    return await fetchData(endpoint, "adService", "GET", null, false, "json", signal);
  } catch (error) {
    console.error("Error in getAdHierarchy:", error);
    throw error; // Re-throw to let callers handle or show UI errors
  }
}

/**
 * getGroupMembersPaginated
 *
 * Fetches group members (paginated) by groupName.
 * Uses global fetchData (includes Bearer token).
 *
 * @param {string} groupName         - The CN of the group
 * @param {number} [pageNumber=1]    - Which page of results
 * @param {number} [pageSize=10]     - Number of results per page
 * @param {string} [sortBy="cn"]     - Sorting field
 * @param {string} [sortOrder="asc"] - Sort order
 * @param {AbortSignal} [signal]     - Optional abort signal
 * @returns {Promise<Object>}        - Parsed JSON from the server
 */
export async function getGroupMembersPaginated(
  groupName,
  pageNumber = 1,
  pageSize = 10,
  sortBy = "cn",
  sortOrder = "asc",
  signal
) {
  try {
    const endpoint =
      `/api/v1/ad/fetchGroupMembersPaginated` +
      `?groupName=${encodeURIComponent(groupName)}` +
      `&pageNumber=${pageNumber}` +
      `&pageSize=${pageSize}` +
      `&sortBy=${sortBy}` +
      `&sortOrder=${sortOrder}`;
    return await fetchData(endpoint, "adService", "GET", null, false, "json", signal);
  } catch (error) {
    console.error("Error in getGroupMembersPaginated:", error);
    throw error;
  }
}