// Import necessary modules
import { fetchModules } from './modules/fetchModules.js';
import { createModuleConfig } from './modules/configureModules.js';
import { addModule } from './modules/components/addModule.js'; // Import the addModule function

// Initialize the settings page by fetching modules and creating their configurations
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Get the settings container
    const settingsContainer = document.getElementById('settings-container');
    if (!settingsContainer) {
      console.error('Settings container not found in the HTML.');
      return;
    }

    // Create and append the "Add" button at the top of the page
    const addButton = document.createElement('button');
    addButton.id = 'add-module-btn';
    addButton.textContent = 'Add module';
    addButton.addEventListener('click', () => {
      addModule(); // Call addModule when the button is clicked
    });
    settingsContainer.appendChild(addButton);

    // Create and append the "Back" button at the right side of the main container
    const backButton = document.createElement('button');
    backButton.id = 'back-btn';
    backButton.textContent = 'Back';
    backButton.style.position = 'absolute';
    backButton.style.right = '20px';
    backButton.style.top = '20px';
    backButton.addEventListener('click', () => {
      window.location.href = '/'; // Redirect to the root endpoint
    });
    settingsContainer.appendChild(backButton);

    // Fetch the modules from the API
    const modules = await fetchModules();

    // Create the module configuration UI
    const moduleConfig = createModuleConfig(modules);

    // Append the configuration to the settings container
    settingsContainer.appendChild(moduleConfig);
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
});
