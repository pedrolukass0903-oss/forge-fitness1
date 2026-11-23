import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Configure SUPABASE_URL e SUPABASE_ANON_KEY nas variáveis de ambiente da Vercel.");
  }
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export function setCors(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

export async function readTable(req, res, table, orderBy) {
  if (setCors(req, res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Método não permitido." });
  try {
    const supabase = getSupabase();
    let query = supabase.from(table).select("*");
    if (orderBy) query = query.order(orderBy, { ascending: true });
    const { data, error } = await query;
    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Erro na tabela ${table}:`, error.message);
    return res.status(500).json({ error: "Não foi possível consultar os dados." });
  }
}
