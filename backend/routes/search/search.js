import { searchByModule } from '../../../dist/searchers/searchByModule.js';

export default async function searchRoute(req, res) {
    try {
        const moduleId = req.query.moduleId;
        const query = req.query.query;
        const limit = req.query.limit;

        const results = await searchByModule(moduleId, query, limit);

        if (results) {
            res.json(results);
        } else {
            res.status(500).json({ error: "Error searching" });
        }
    } catch (error) {
        console.error("Error in /search route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
