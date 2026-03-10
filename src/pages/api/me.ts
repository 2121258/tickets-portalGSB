import type { NextApiRequest, NextApiResponse } from "next";

/**
 * MVP: endpoint de perfil.
 * Por ahora devuelve datos de ejemplo.
 * Más adelante vamos a leer el token real (B2C/Entra) y los grupos.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Placeholders (los vamos a reemplazar)
  const email = req.headers["x-user-email"] || "usuario@ejemplo.com";
  const groupsHeader = (req.headers["x-user-groups"] as string) || "[]";
  let groups: string[] = [];
  try { groups = JSON.parse(groupsHeader); } catch {}

  const role = groups.includes(process.env.CTRL_GROUP_ID || "CTRL_GROUP_ID_PLACEHOLDER")
    ? "control"
    : "externo";

  res.status(200).json({
    ok: true,
    email,
    groups,
    role
  });
}
