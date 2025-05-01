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

  function listParticipants() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => {
        const sortedList = [...data.items].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          return 0;
        });
        setParticipants(sortedList);
      },
    });
  }

  useEffect(() => {
    listParticipants();
  }, []);

  async function addParticipant() {
    const trimmedName = newParticipant.trim();
    if (!trimmedName) return;

    const existing = participants.find(p => p.content.toLowerCase() === trimmedName.toLowerCase());
    if (existing) {
      alert("Você já está inscrito");
      return;
    }

    await client.models.Todo.create({ content: trimmedName });
    setNewParticipant("");
  }

  async function getQuantumRandomIndex(max: number) {
    try {
      const response = await fetch("https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16");
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        return data.data[0] % max;
      }
      return Math.floor(Math.random() * max);
    } catch (error) {
      console.error("QRNG fetch failed", error);
      return Math.floor(Math.random() * max);
    }
  }

  async function drawParticipant() {
    if (participants.length === 0 || isDrawing || drawCount < 1) return;

    setIsDrawing(true);
    setShowFireworks(false);
    setSelected([]);

    const winners: Schema["Todo"]["type"][] = [];
    const availableParticipants = [...participants];

    for (let i = 0; i < drawCount && availableParticipants.length; i++) {
      const index = await getQuantumRandomIndex(availableParticipants.length);
      winners.push(availableParticipants.splice(index, 1)[0]);
    }

    setSelected(winners);
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 3000);
    setIsDrawing(false);
  }

  return (
    <main style={{
      width: "100%",
      minHeight: "100vh",
      backgroundColor: "#000",
      color: "#FFCE00",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem",
      overflow: "hidden"
    }}>
      <h1>[Data&AI] Monthly Checkpoint</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          placeholder="Nome Completo"
          style={{ padding: "10px", borderRadius: "5px", border: "2px solid #FFCE00", backgroundColor: "#333", color: "#FFCE00" }}
        />
        <button onClick={addParticipant} style={{ padding: "10px 20px", backgroundColor: "#FF8000", color: "#000", borderRadius: "5px" }}>Participar</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, width: "100%", maxWidth: "600px" }}>
        {participants.map((participant, index) => (
          <li key={participant.id} style={{ padding: "10px", marginBottom: "10px", backgroundColor: "#333", color: "#FFCE00", borderRadius: "5px", textAlign: "center" }}>
            {index + 1}. {participant.content}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "2rem" }}>
        <input
          type="number"
          min={1}
          max={participants.length}
          value={drawCount}
          onChange={(e) => setDrawCount(Math.max(1, Math.min(participants.length, parseInt(e.target.value))))}
          style={{ padding: "10px", borderRadius: "5px", marginRight: "10px", backgroundColor: "#333", color: "#FFCE00", border: "2px solid #FFCE00" }}
        />
        <button onClick={drawParticipant} disabled={isDrawing} style={{ padding: "10px 20px", backgroundColor: isDrawing ? "#666" : "#FFCE00", color: "#000", borderRadius: "5px" }}>
          Iniciar Sorteio
        </button>
      </div>

      {selected.length > 0 && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <h2>Sorteados:</h2>
          {selected.map((winner) => <p key={winner.id} style={{ fontWeight: "bold", color: "#FF8000" }}>{winner.content}</p>)}
        </div>
      )}
    </main>
  );
}
