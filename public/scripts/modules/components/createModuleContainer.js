import { createInput } from './createInput.js';
import { createEditableOptionInput } from './createEditableOptionInput.js';
import { getUpdatedModuleData } from './getUpdatedModuleData.js';
import { saveModule } from './saveModule.js';
import { deleteModule } from './deleteModule.js';

export function createModuleContainer(moduleId, moduleData) {
  const container = document.createElement('div');
  container.className = 'module-container';

  const title = document.createElement('h3');
  title.textContent = `Module ${moduleId}: ${moduleData.name}`;
  container.appendChild(title);

  const form = document.createElement('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  for (const key in moduleData) {
    if (key !== 'options' && key !== 'logins' && key !== 'id') {
      createInput(form, key, moduleData[key]);
    }
  }

  const loginsContainer = document.createElement('div');
  loginsContainer.textContent = 'Logins:';

  for (const loginKey in moduleData.logins) {
    const loginRow = document.createElement('div');
    const fixedLabel = document.createElement('span');
    fixedLabel.textContent = `${loginKey}: `;
    loginRow.appendChild(fixedLabel);

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.name = `logins:${loginKey}`;
    valueInput.value = moduleData.logins[loginKey];
    loginRow.appendChild(valueInput);

    loginsContainer.appendChild(loginRow);
  }

  form.appendChild(loginsContainer);

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

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.addEventListener('click', () => {
    const updatedModuleData = getUpdatedModuleData(form, moduleId, moduleData);
    saveModule(updatedModuleData);
  });
  form.appendChild(saveButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await deleteModule(moduleId);
    window.location.reload(); // Reload the page after deletion
  });
  form.appendChild(deleteButton);

  container.appendChild(form);
  return container;
}
