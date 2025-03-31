/**
 * Utility functions for the Compliance Admin panel
 */

/**
 * Save department configuration to the store
 * @param {string} departmentCode - The department code
 * @param {Object} config - The department configuration
 * @param {Function} updateDepartmentConfig - The function to update the department config in the store
 * @returns {Promise} - A promise that resolves when the configuration is saved
 */
export const saveDepartmentConfig = (departmentCode, config, updateDepartmentConfig) => {
    return new Promise((resolve, reject) => {
      try {
        // In a real application, this might involve an API call
        // For now, we're just updating the store directly
        updateDepartmentConfig(departmentCode, config);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };