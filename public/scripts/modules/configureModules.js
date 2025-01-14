import { fetchModules } from './fetchModules.js';

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

function createModuleContainer(moduleId, moduleData) {
  const container = document.createElement('div');
  container.className = 'module-container';

  const title = document.createElement('h3');
  title.textContent = `Module ${moduleId}: ${moduleData.name}`;
  container.appendChild(title);

  const form = document.createElement('form');

    // Iterate through the main moduleData keys (excluding 'options', 'logins', and 'id')
    for (const key in moduleData) {
        if (key !== 'options' && key !== 'logins' && key !== 'id') {
            createInput(form, key, moduleData[key]);
        }
    }

    // Handle logins object separately:
    const loginsContainer = document.createElement('div');
    loginsContainer.textContent = 'Logins:';
    for (const loginKey in moduleData.logins) {
        createInput(loginsContainer, loginKey, moduleData.logins[loginKey], 'logins'); // Add 'logins' here
    }
    form.appendChild(loginsContainer);


    // Handle "options" object separately (same as before)
    const optionsContainer = document.createElement('div');
    optionsContainer.textContent = 'Options:';
    for (const optionKey in moduleData.options) {
        createInput(optionsContainer, optionKey, moduleData.options[optionKey], 'options'); // Add 'options' here
    }

    const addOptionButton = document.createElement('button');
    addOptionButton.textContent = "Add Option";
    addOptionButton.addEventListener('click', () => {
        createInput(optionsContainer, "", ""); 
    });
    optionsContainer.appendChild(addOptionButton)
    form.appendChild(optionsContainer)

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.addEventListener('click', () => {
    const updatedModuleData = getUpdatedModuleData(form, moduleId, moduleData);
    saveModule(updatedModuleData);

  });
  form.appendChild(saveButton);



  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteModule(moduleId));
  form.appendChild(deleteButton);


  container.appendChild(form);
  return container;
}

function createInput(parent, key, value, objectType = null) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'text';

  let name = key;
  if (objectType) {
      name = `${objectType}:${key}`; // Add prefix to name
      label.textContent = `${objectType}:${key}: `; //  Prefix to label (for visual consistency)
  } else {
      label.textContent = key + ": ";
  }

  input.name = name; // Assign the prefixed name here
  input.value = value;

  parent.appendChild(label);
  parent.appendChild(input);
  parent.appendChild(document.createElement('br'));
}



function getUpdatedModuleData(form, moduleId, originalData) {
  const updatedData = { ...originalData, id: moduleId };

  const formData = new FormData(form);
  const regularData = {};
  const logins = {};
  const options = {};

  for (let [key, value] of formData.entries()) {
      if (key.startsWith("logins:")) {
          logins[key.replace("logins:", "")] = value;
      } else if (key.startsWith("options:")) {
          options[key.replace("options:", "")] = value;
      } else {
          regularData[key] = value;
      }
  }


  updatedData.logins = logins;
  updatedData.options = options;

  //Update top level keys, but don't overwrite logins or options
  for(const key in regularData){
      if(!(key in updatedData.options) && !(key in updatedData.logins)){
          updatedData[key] = regularData[key];
      }
  }




  return updatedData;
}


function saveModule(moduleData) {

  fetch(`${baseUrl}/api/modules/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(moduleData),
  })
  .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
      // Handle successful save (e.g., refresh module list)
      console.log('Module saved successfully');
      fetchModules(document.getElementById('module-select')); // Assuming this updates the select
        return response.json()
  })
    .then(data => console.log(data))

  .catch(error => console.error('Error saving module:', error));



}


function deleteModule(moduleId) {
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





export { createModuleConfig };

