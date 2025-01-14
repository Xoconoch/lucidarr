const baseUrl = window.location.origin;

export const addModule = async () => {
  try {
    const newModule = {
      type: '',
      name: '',
      logins: {
        username: 'user',
        password: 'pass'
      },
      options: {}
    };

    const response = await fetch(`${baseUrl}/api/modules/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newModule)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error adding module: ${errorData.error}`);
    }

    const data = await response.json();
    console.log(`Module added with ID: ${data.moduleId}`);

    // Reload the page after successful module addition
    window.location.reload();
  } catch (error) {
    console.error('Error adding module:', error);
    alert('Failed to add a new module. Please try again.');
  }
};
