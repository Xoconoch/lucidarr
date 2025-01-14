const baseUrl = window.location.origin;

export const fetchModules = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/modules/check`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.modules;
  } catch (error) {
    console.error('Error fetching modules:', error);
    return {}; // Return empty object in case of error
  }
};
