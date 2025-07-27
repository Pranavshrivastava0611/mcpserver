// lib/actions/createLead.ts
import db from "../utils/db.js";
import { leads } from "../lib/schema.js";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

/**
 * Create a lead in the database
 * @param {{
 *   name: string,
 *   source?: string,
 *   contact?: {
 *     email?: string,
 *     phone?: string
 *   },
 *   interestedProducts?: string[],
 *   status?: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost',
 *   notes?: string
 * }} data
 */
export const createLead = async (data) => {
  const id = uuidv4();
  try {
    await db.insert(leads).values({
      id,
      name: data.name || null,
      source: data.source || null,
      email: data.contact?.email || null,
      phone: data.contact?.phone || null,
      interestedProducts: data.interestedProducts || [],
      status: data.status || 'New',
      notes: data.notes || null,
    });

    return { success: true, id };
  } catch (error) {
    console.error("Failed to create lead:", error);
    return { success: false, error: error.message };
  }
};
export const getAllLeads = async()=>{
    try{
       const leadss = await db.select().from(leads).orderBy(leads.createdAt);
        console.log("leadss:", leadss);
        return { success: true, leadss };
    }catch(error){
        console.log("error in getAllLeads:", error);
        throw new Error("Failed to fetch lead");
    }
}
export const getLeadById = async (id)=>{
    try{
        const lead = db.select().from(leads).where(eq(leads.id,id));
        return lead;
    }catch(error){
        console.log("error in getLeadById:", error);
        throw new Error("Failed to fetch lead");
    }
}

export const updateLaddById = async (id, updates) => {
  try {
    // 1. Fetch existing lead
    const existingLead = await db.select().from(leads).where(eq(leads.id, id));
   const _updates = updates.updates

    if (!existingLead) {
      throw new Error("Lead not found");
    }

    const { createdAt, updatedAt, id: _id, ...rest } = existingLead[0];

    const cleanedUpdates = {
      ...rest,
      ..._updates,
      updatedAt: new Date(),
    };

    await db.update(leads).set(cleanedUpdates).where(eq(leads.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error in updateLeadById:", error);
    throw new Error("Failed to update lead");
  }
};

export const deleteLeadById = async (id)=>{
    try{
           await db.delete(leads).where(eq(leads.id, id));
        return { success: true };
    }catch(error){
        console.log("error in deleteLeadById:", error); 
        throw new Error("Failed to delete lead");
    }
}
