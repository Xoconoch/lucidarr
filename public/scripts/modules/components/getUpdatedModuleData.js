export function getUpdatedModuleData(form, moduleId, originalData) {
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