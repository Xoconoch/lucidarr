import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export default async function modulesRoute(req, res) {
  try {

    const __filename = fileURLToPath(import.meta.url);    
    const __dirname = path.dirname(__filename); 

    const filePath = path.join(__dirname, '../../../config/modules.json'); 
    const data = await readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading modules.json:", error);
    res.status(500).json({ error: "Error reading modules configuration" });
  }
}
