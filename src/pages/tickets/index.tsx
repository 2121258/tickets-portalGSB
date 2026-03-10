import Link from "next/link";

export default function TicketsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Mis Tickets</h1>
      <p>Pronto vas a ver tus tickets acá. Por ahora, esta es la página base.</p>
      <div style={{ marginTop: 12 }}>
        <Link href="/">← Volver al inicio</Link>
      </div>
    </div>
  );
}
