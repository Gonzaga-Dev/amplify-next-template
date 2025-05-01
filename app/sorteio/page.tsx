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
  const [selected, setSelected] = useState<Schema["Todo"]["type"] | null>(null);
  const [currentRoll, setCurrentRoll] = useState<Schema["Todo"]["type"] | null>(null);
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

  function addParticipant() {
    if (newParticipant.trim() === "") return;
    if (participants.some(p => p.content === newParticipant.trim())) {
      alert("Você já está cadastrado");
      return;
    }
    client.models.Todo.create({ content: newParticipant.trim() });
    setNewParticipant("");
  }

  async function getQuantumRandomIndex(max: number) {
    try {
      const response = await fetch(`https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16`);
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        return data.data[0] % max;
      }
      return Math.floor(Math.random() * max);
    } catch (error) {
      console.error("QRNG fetch failed, falling back to Math.random()", error);
      return Math.floor(Math.random() * max);
    }
  }

  async function drawParticipant() {
    if (participants.length === 0 || isDrawing) return;

    setIsDrawing(true);
    setShowFireworks(false);
    setSelected(null);

    let rounds = 10;
    let delay = 30;

    async function roll() {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setCurrentRoll(participants[randomIndex]);
      rounds--;

      if (rounds > 0) {
        delay += 15;
        setTimeout(roll, delay);
      } else {
        const winnersSet = new Set<Schema["Todo"]["type"]>();
        while (winnersSet.size < Math.min(drawCount, participants.length)) {
          const finalIndex = await getQuantumRandomIndex(participants.length);
          winnersSet.add(participants[finalIndex]);
        }

        const winners = Array.from(winnersSet);
        setSelected(winners.length === 1 ? winners[0] : null);
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 3000);
        setIsDrawing(false);
      }
    }

    roll();
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
      padding: "2rem",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>

      {showFireworks && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0
        }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                width: "10px",
                height: "10px",
                backgroundColor: i % 2 === 0 ? "#FFCE00" : "#FF8000",
                borderRadius: "50%",
                animation: "explode 1s ease-out forwards",
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "clamp(1.5rem, 5vw, 2.5rem)", zIndex: 1 }}>
        [Data&AI] Monthly Checkpoint
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginBottom: "2rem", width: "100%", maxWidth: "600px", zIndex: 1 }}>
        <input value={newParticipant} onChange={(e) => setNewParticipant(e.target.value)} placeholder="Nome Completo" style={{ flex: "1 1 300px", padding: "10px", fontSize: "1rem", borderRadius: "5px", border: "2px solid #FFCE00", backgroundColor: "#333333", color: "#FFCE00" }} />
        <button onClick={addParticipant} style={{ backgroundColor: "#FF8000", color: "#000000", border: "none", padding: "10px 20px", fontSize: "1rem", borderRadius: "5px", cursor: "pointer" }}>Participar</button>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <label>Quantos nomes sortear?</label>
        <input type="number" value={drawCount} onChange={(e) => setDrawCount(Math.max(1, parseInt(e.target.value)))} style={{ marginLeft: "10px", width: "50px" }} />
      </div>

      <button onClick={drawParticipant} disabled={isDrawing}>Iniciar Sorteio</button>
    </main>
  );
}
