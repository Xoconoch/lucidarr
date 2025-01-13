import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto'; 


export default async function addModuleRoute(req, res) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, '../../../config/modules.json');
        const newModuleData = req.body; 


         // Validate the required fields
         const requiredFields = ['type', 'name', 'logins', 'options'];
         if (!requiredFields.every(field => Object.keys(newModuleData).includes(field))) {
             return res.status(400).json({ error: "Missing required fields" });
         }
         if (!newModuleData.logins.username || !newModuleData.logins.password) {
             return res.status(400).json({ error: "Missing logins.username or logins.password" });
         }



        const data = await readFile(filePath, 'utf8');
        const modules = JSON.parse(data);



        const newModuleId = randomUUID().substring(0, 6); 

        modules.modules[newModuleId] = newModuleData;


        await writeFile(filePath, JSON.stringify(modules, null, 2));


        res.status(201).json({ message: "Module added", moduleId: newModuleId }); 

    } catch (error) {
        console.error("Error adding module:", error);
        res.status(500).json({ error: "Error adding module" });
    }
}


