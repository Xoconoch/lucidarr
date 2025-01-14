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
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission
  });

  // Create inputs for top-level fields (excluding options, logins, and id)
  for (const key in moduleData) {
    if (key !== 'options' && key !== 'logins' && key !== 'id') {
      createInput(form, key, moduleData[key]);
    }
  }

  // Create logins container
  const loginsContainer = document.createElement('div');
  loginsContainer.textContent = 'Logins:';

  for (const loginKey in moduleData.logins) {
    const loginRow = document.createElement('div');

    // Fixed label for logins
    const fixedLabel = document.createElement('span');
    fixedLabel.textContent = `${loginKey}: `;
    loginRow.appendChild(fixedLabel);

    // Editable input for login values
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.name = `logins:${loginKey}`;
    valueInput.value = moduleData.logins[loginKey];
    loginRow.appendChild(valueInput);

    loginsContainer.appendChild(loginRow);
  }

  form.appendChild(loginsContainer);

  // Create options container
  const optionsContainer = document.createElement('div');
  optionsContainer.textContent = 'Options:';

  for (const optionKey in moduleData.options) {
    createEditableOptionInput(optionsContainer, optionKey, moduleData.options[optionKey]);
  }

  const addOptionButton = document.createElement('button');
  addOptionButton.type = 'button';
  addOptionButton.textContent = "Add Option";
  addOptionButton.addEventListener('click', () => {
    createEditableOptionInput(optionsContainer, "", "");
  });
  optionsContainer.appendChild(addOptionButton);
  form.appendChild(optionsContainer);

  // Save button
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.addEventListener('click', () => {
    const updatedModuleData = getUpdatedModuleData(form, moduleId, moduleData);
    saveModule(updatedModuleData);
  });
  form.appendChild(saveButton);

  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteModule(moduleId));
  form.appendChild(deleteButton);

  container.appendChild(form);
  return container;
}



function createEditableOptionInput(parent, key, value) {
  const optionContainer = document.createElement('div'); 

  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.name = `options:${key}`; // Correct name attribute
  keyInput.value = key;
  optionContainer.appendChild(keyInput);


  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  // The name of the value input should be the same as the key input but with "options-value:" prepended
  valueInput.name = `options-value:${key}`;
  valueInput.value = value;
  optionContainer.appendChild(valueInput);

  // Add an event listener to update the value input name when the key changes
  keyInput.addEventListener('input', () => {
      valueInput.name = `options-value:${keyInput.value}`;
  });


  parent.appendChild(optionContainer);
  parent.appendChild(document.createElement('br'));
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

  const logins = {};
  for (let [key, value] of formData.entries()) {
    if (key.startsWith("logins:")) {
      logins[key.replace("logins:", "")] = value;
    }
  }
  updatedData.logins = logins;

  const options = {};
  for (let [key, value] of formData.entries()) {
    if (key.startsWith("options:")) {
      const optionKey = value;
      if (optionKey) {
        const optionValueKey = `options-value:${optionKey}`;
        const optionValue = formData.get(optionValueKey);
        if (optionValue !== null) {
          options[optionKey] = optionValue;
        }
      }
    }
  }
  updatedData.options = options;

  // Update the other fields (type, name, etc.), ignoring option-value keys
  for (let [key, value] of formData.entries()) {
    if (!key.startsWith("logins:") && !key.startsWith("options:") && !key.startsWith("options-value:")) {
      updatedData[key] = value;
    }
  }

  return updatedData;
}


function saveModule(moduleData) {
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

