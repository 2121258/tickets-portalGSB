import { useContext } from "react";
import { AuthCtx } from "./_app";

export default function Home() {
  const { account, login, logout } = useContext(AuthCtx);

  return (
    <div style={{ padding: 24 }}>
      <h1>Portal de Tickets (MVP)</h1>
      {!account ? (
        <>
          <p>Iniciá sesión para continuar.</p>
          <button onClick={login}>Ingresar</button>
        </>
      ) : (
        <>
          <p>Hola {account.username}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/tickets">Ir a tickets</a>
            <button onClick={logout}>Salir</button>
          </div>
        </>
      )}
    </div>
  );
}
