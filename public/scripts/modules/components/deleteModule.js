import { fetchModules } from "../fetchModules.js";

const baseUrl = window.location.origin;

export function deleteModule(moduleId) {
    const url = new URL(`${baseUrl}/api/modules/remove`);
    url.searchParams.append('moduleId', moduleId);

  fetch(url, {
    method: 'DELETE',

  })
  .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
      console.log('Module deleted successfully');
        fetchModules(document.getElementById('module-select')); // Refresh module select
        return response.json()

  })
      .then(data => console.log(data))
  .catch(error => console.error('Error deleting module:', error));
}