import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


export default async function editModuleRoute(req, res) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, '../../../config/modules.json');
        const moduleId = req.params.id; // Get the module ID from the request parameters
        const updatedModuleData = req.body;

        const data = await readFile(filePath, 'utf8');
        const modules = JSON.parse(data);

        if (!modules.modules[moduleId]) {
            return res.status(404).json({ error: "Module not found" });
        }

        // Validate the required fields if you are updating them
        const requiredFields = ['type', 'name', 'logins', 'options'];
        const updatingRequiredFields = requiredFields.filter(field => Object.keys(updatedModuleData).includes(field));

        if (updatingRequiredFields.length > 0 && !updatingRequiredFields.every(field => Object.keys(updatedModuleData).includes(field))) {
          return res.status(400).json({ error: "Missing required fields. If you are updating a required field you must provide all other required fields" });
        }

        if (updatedModuleData.logins && (!updatedModuleData.logins.username || !updatedModuleData.logins.password)) {
          return res.status(400).json({ error: "Missing logins.username or logins.password" });
        }



        // Update the module data
        modules.modules[moduleId] = { ...modules.modules[moduleId], ...updatedModuleData };

        await writeFile(filePath, JSON.stringify(modules, null, 2));

        res.status(200).json({ message: "Module updated", moduleId: moduleId });

    } catch (error) {
        console.error("Error updating module:", error);
        res.status(500).json({ error: "Error updating module" });
    }
}
