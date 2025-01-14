import { fetchModules } from "../fetchModules.js";

export function saveModule(moduleData) {

  const baseUrl = window.location.origin;
  const moduleId = moduleData.id;  // Get the module ID
  delete moduleData.id; //Remove id from the request body. It is already in the request path

  fetch(`${baseUrl}/api/modules/edit/${moduleId}`, {  // Use the correct PUT endpoint with moduleId
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(moduleData),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          console.log('Module updated successfully');
          fetchModules(document.getElementById('module-select'));
          return response.json(); // Return the JSON response
      })
      .then(data => console.log(data)) // Log the response data
      .catch(error => console.error('Error updating module:', error));
}