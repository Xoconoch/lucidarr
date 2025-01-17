import { createModuleContainer } from './components/createModuleContainer.js';

const baseUrl = window.location.origin; // Get the base URL dynamically

function createModuleConfig(modules) {
  const configContainer = document.createElement('div');
  configContainer.id = 'module-config';

  for (const moduleId in modules) {
    const moduleData = modules[moduleId];
    const moduleContainer = createModuleContainer(moduleId, moduleData);
    configContainer.appendChild(moduleContainer);
  }

  return configContainer;
}

export { createModuleConfig };
