"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [participants, setParticipants] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [selected, setSelected] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");
  const [drawCount, setDrawCount] = useState(1);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setParticipants(items.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()));
      },
    });
  }, []);

  async function addParticipant() {
    if (newParticipant.trim() === "") return;
    const exists = participants.some((p) => p.content === newParticipant.trim());
    if (exists) {
      alert("Você já está cadastrado");
      return;
    }
    await client.models.Todo.create({ content: newParticipant.trim() });
    setNewParticipant("");
  }

  async function getQuantumRandomIndex(max: number) {
    try {
      const response = await fetch(`https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        return data.data[0] % max;
      }
    } catch (error) {
      console.error("QRNG fetch failed", error);
    }
    return Math.floor(Math.random() * max);
  }

  async function drawParticipants() {
    if (participants.length === 0 || isDrawing) return;
    setIsDrawing(true);
    setShowFireworks(false);
    setSelected([]);

    const winners: Schema["Todo"]["type"][] = [];
    const availableParticipants = [...participants];

    for (let i = 0; i < Math.min(drawCount, participants.length); i++) {
      const index = await getQuantumRandomIndex(availableParticipants.length);
      winners.push(availableParticipants.splice(index, 1)[0]);
    }

    setSelected(winners);
    setShowFireworks(true);

    setTimeout(() => setShowFireworks(false), 3000);
    setIsDrawing(false);
  }

  return (
    <main style={{ backgroundColor: "#000", color: "#FFCE00", padding: "2rem", minHeight: "100vh" }}>
      <h1>[Data&AI] Monthly Checkpoint</h1>

      <div>
        <input
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          placeholder="Nome Completo"
        />
        <button onClick={addParticipant}>Participar</button>
      </div>

      <ul>
        {participants.map((p, idx) => (
          <li key={p.id}>{idx + 1}. {p.content}</li>
        ))}
      </ul>

      <div style={{ marginTop: "2rem" }}>
        <label>Quantidade de Sorteados: </label>
        <input
          type="number"
          min="1"
          value={drawCount}
          onChange={(e) => setDrawCount(Math.max(1, Number(e.target.value)))}
          style={{ width: "50px" }}
        />
      </div>

      <button onClick={drawParticipants} disabled={isDrawing}>
        Iniciar Sorteio
      </button>

      {selected.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Sorteado(s):</h2>
          {selected.map((winner) => (
            <p key={winner.id}>{winner.content}</p>
          ))}
        </div>
      )}

      {showFireworks && <div>🎆✨</div>}
    </main>
  );
}
