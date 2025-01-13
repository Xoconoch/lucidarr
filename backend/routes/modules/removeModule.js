import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export default async function removeModuleRoute(req, res) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, '../../../config/modules.json');

        const moduleIdToRemove = req.query.moduleId; // Get the module ID to remove from query parameters

        if (!moduleIdToRemove) {
            return res.status(400).json({ error: "moduleId is required as a query parameter" });
        }

        const data = await readFile(filePath, 'utf8');
        const modules = JSON.parse(data);

        if (!modules.modules[moduleIdToRemove]) {  // Check if the module exists
            return res.status(404).json({ error: "Module not found" }); // 404 Not Found
        }


        delete modules.modules[moduleIdToRemove]; // Remove the module



        await writeFile(filePath, JSON.stringify(modules, null, 2));

        res.json({ message: "Module removed" });
    } catch (error) {
        console.error("Error removing module:", error);
        res.status(500).json({ error: "Error removing module" });
    }
}
