import Router from "express";
import {
  createLead,
  getLeadById,
  deleteLeadById,
  getAllLeads,
  updateLaddById,
} from "../controllers/action.controller.js";

export const mcpRouter = Router();

// POST /api/mcp/execute
mcpRouter.post("/", async (req, res) => {
    console.log("response from the mcp server : ",req.body)
  const { command, data } = req.body;

  try {
    let result;

    switch (command) {
      case "createLead":
        result = await createLead(data);
        break;
      case "getLeadById":
        result = await getLeadById(data.id);
        break;
      case "deleteLead":
        result = await deleteLeadById(data.id);
        break;
      case "getLeads":
        result = await getAllLeads();
        break;
      case "updateLead":
        result = await updateLaddById(data.id, data);
        break;
      default:
        return res.status(400).json({ error: `Unknown command: ${command}` });
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error("Error in MCP execute route:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
