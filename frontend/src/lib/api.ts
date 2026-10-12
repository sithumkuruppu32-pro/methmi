import type { Tour } from "@/types/tour";
import type { Vehicle } from "@/types/vehicle";
// On Vercel the backend service shares this domain (/api/* is routed to it).
function resolveBackendUrl(){
  if(process.env.BACKEND_URL) return process.env.BACKEND_URL.replace(/\/$/,"");
  const host=process.env.VERCEL_PROJECT_PRODUCTION_URL||process.env.VERCEL_URL;
  if(process.env.VERCEL&&host) return `https://${host}`;
  return "http://localhost:4000";
}
export const BACKEND_URL=resolveBackendUrl();
async function get<T>(p:string):Promise<T>{ const r=await fetch(`${BACKEND_URL}${p}`,{cache:"no-store",headers:{Accept:"application/json"}}); if(!r.ok) throw new Error(`Backend request failed: ${r.status}`); return r.json(); }
export async function getAllTours(){ return (await get<{tours:Tour[]}>("/api/tours")).tours; }
export async function getAllVehicles(){ return (await get<{vehicles:Vehicle[]}>("/api/vehicles")).vehicles; }
