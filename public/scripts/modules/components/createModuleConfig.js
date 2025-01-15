export function createModuleConfig(modules) {
  const configContainer = document.createElement('div');
  configContainer.id = 'module-config';

  for (const moduleId in modules) {
    const moduleData = modules[moduleId];
    const moduleContainer = createModuleContainer(moduleId, moduleData);
    
    // Add the 'module-container' class for styling
    moduleContainer.classList.add('module-container');
    
    configContainer.appendChild(moduleContainer);
  }

  return configContainer;
}
