import { useEffect, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) window.location.href = "/";
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (password1 !== password2) { setMsg("Las contraseñas no coinciden"); return; }
    if (password1.length < 8) { setMsg("La contraseña debe tener al menos 8 caracteres"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: password1,
          nombreApellido: nombre
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo registrar");
      setOk(true);
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <div style={{ maxWidth: 420, margin: "48px auto", padding: 24, border:"1px solid #eee", borderRadius: 8 }}>
        <h2>Cuenta creada</h2>
        <p>Ya podés ingresar con tu email y contraseña.</p>
        <Link href="/login">Ir a Ingresar</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "48px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h1>Crear cuenta</h1>
      <form onSubmit={onSubmit} style={{ display:"grid", gap:12, marginTop:12 }}>
        <label>
          Nombre y Apellido
          <input value={nombre} onChange={e=>setNombre(e.target.value)} required style={{ width:"100%" }} />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ width:"100%" }} />
        </label>
        <label>
          Contraseña
          <input type="password" value={password1} onChange={e=>setPassword1(e.target.value)} required style={{ width:"100%" }} />
        </label>
        <label>
          Repetir contraseña
          <input type="password" value={password2} onChange={e=>setPassword2(e.target.value)} required style={{ width:"100%" }} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
      {msg && <p style={{ color: "crimson", marginTop:8 }}>{msg}</p>}
      <div style={{ marginTop:12 }}>
        <Link href="/login">Ya tengo cuenta</Link>
      </div>
    </div>
  );
}
