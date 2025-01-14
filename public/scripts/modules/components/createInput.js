export function createInput(parent, key, value, objectType = null) {
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