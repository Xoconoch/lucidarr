export function createEditableOptionInput(parent, key, value) {
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