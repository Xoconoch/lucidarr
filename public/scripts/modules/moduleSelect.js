import { fetchModules } from './fetchModules.js'; // Import the function

export const createModuleSelect = () => {
    const moduleSelect = document.createElement('select');
    moduleSelect.id = 'moduleSelect';
    return moduleSelect;
};

export const populateModuleSelect = (moduleSelect) => { // Renamed for clarity
    fetchModules()
        .then(modules => {
            for (const moduleId in modules) {
                const module = modules[moduleId];
                const option = document.createElement('option');
                option.value = moduleId;
                option.text = module.name;
                moduleSelect.appendChild(option);
            }
        });
};
