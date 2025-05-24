"use client";

import { useEffect, useState } from "react";
import { Auth, Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Carregando autenticação...</p>;
  }

  if (!authenticated) {
    return (
      <main style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h2>🔒 Acesso restrito</h2>
        <p>Você precisa estar logado para acessar esta página.</p>
      </main>
    );
  }

  async function clearAllParticipants() {
    const confirmClear = window.confirm("Você tem certeza que deseja apagar TODOS os participantes?");
    if (!confirmClear) return;

    setIsClearing(true);
    setMessage("");

    try {
      const result = await client.models.Todo.list();
      const deletions = result.data.map((item) => client.models.Todo.delete({ id: item.id }));
      await Promise.all(deletions);
      setMessage("Todos os participantes foram apagados com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao apagar os participantes.");
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <main style={{
      width: "100%",
      maxWidth: "100%",
      minHeight: "100vh",
      backgroundColor: "#000000",
      color: "#FFCE00",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      boxSizing: "border-box"
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "2rem",
        fontSize: "clamp(1.5rem, 5vw, 2.5rem)"
      }}>
        Área Administrativa
      </h1>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "2rem",
        width: "100%",
        maxWidth: "400px"
      }}>
        <button
          onClick={clearAllParticipants}
          disabled={isClearing}
          style={{
            backgroundColor: isClearing ? "#666666" : "#FF8000",
            color: "#000000",
            border: "none",
            padding: "15px 30px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            cursor: isClearing ? "not-allowed" : "pointer",
            opacity: isClearing ? 0.7 : 1,
            width: "100%"
          }}
        >
          {isClearing ? "Apagando..." : "🗑️ Limpar Todos os Participantes"}
        </button>
      </div>

      {message && (
        <p style={{
          textAlign: "center",
          marginTop: "2rem",
          color: message.includes("sucesso") ? "#FFCE00" : "#FF8000",
          fontWeight: "bold",
          fontSize: "1.2rem",
          maxWidth: "400px"
        }}>
          {message}
        </p>
      )}
    </main>
  );
}
