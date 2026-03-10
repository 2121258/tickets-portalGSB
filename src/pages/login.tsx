import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si ya hay token, redirigimos a /
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) window.location.href = "/";
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error de autenticación");
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user)); // { email, nombre, rol }
      window.location.href = "/"; // al dashboard/home
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h1>Ingresar</h1>
      <p style={{ color: "#666" }}>Accedé con tu email y contraseña.</p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
            style={{ width:"100%" }}
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
            style={{ width:"100%" }}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      {msg && <p style={{ color: "crimson", marginTop: 8 }}>{msg}</p>}
      <div style={{ marginTop: 12, display:"flex", gap: 12 }}>
        <Link href="/register">Crear cuenta</Link>
        <Link href="/forgot">Olvidé mi contraseña</Link>
      </div>
    </div>
  );
}
