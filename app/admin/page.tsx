"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function AdminPage() {
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState("");

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
    <main style={{ padding: "2rem", backgroundColor: "#000000", minHeight: "100vh", color: "#FFCE00", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Área Administrativa
      </h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <button
          onClick={clearAllParticipants}
          disabled={isClearing}
          style={{
            backgroundColor: "#FF8000",
            color: "#000000",
            border: "none",
            padding: "15px 30px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            cursor: isClearing ? "not-allowed" : "pointer",
            opacity: isClearing ? 0.6 : 1,
          }}
        >
          {isClearing ? "Apagando..." : "🗑️ Limpar Todos os Participantes"}
        </button>
      </div>

      {message && (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "#FFCE00", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </main>
  );
}
