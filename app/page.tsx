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
  const [currentRoll, setCurrentRoll] = useState<Schema["Todo"]["type"] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");
  const [drawCount, setDrawCount] = useState(1);
  const [countdown, setCountdown] = useState<number | null>(null);

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
    const name = newParticipant.trim();
    if (!name) return;
    if (participants.some(p => p.content === name)) {
      alert("Você já está cadastrado");
      return;
    }
    client.models.Todo.create({ content: name });
    setNewParticipant("");
  }

  async function getQuantumRandomIndex(max: number) {
    try {
      const res = await fetch(`https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16`);
      const json = await res.json();
      if (json.success && json.data?.length) {
        return json.data[0] % max;
      }
    } catch (error) {
      console.error("QRNG fetch failed, falling back to Math.random()", error);
    }
    return Math.floor(Math.random() * max);
  }

  async function drawParticipant() {
    if (!participants.length || isDrawing) return;

    setIsDrawing(true);
    setShowFireworks(false);
    setSelected([]);
    setCurrentRoll(null);
    setCountdown(null);

    let rounds = 10;
    let delay = 30;

    async function rollAnimation() {
      const idx = Math.floor(Math.random() * participants.length);
      setCurrentRoll(participants[idx]);
      rounds--;
      if (rounds > 0) {
        delay += 15;
        setTimeout(rollAnimation, delay);
      } else {
        const available = [...participants];
        const winners: Array<Schema["Todo"]["type"]> = [];
        const count = Math.min(drawCount, available.length);
        for (let i = 0; i < count; i++) {
          const j = await getQuantumRandomIndex(available.length);
          winners.push(available.splice(j, 1)[0]);
        }

        // Contagem regressiva de 5s antes de mostrar os vencedores
        let time = 5;
        setCountdown(time);
        const interval = setInterval(() => {
          time--;
          setCountdown(time);
          if (time === 0) {
            clearInterval(interval);
            setSelected(winners);
            setShowFireworks(true);
            setTimeout(() => setShowFireworks(false), 3000);
            setCountdown(null);
            setIsDrawing(false);
          }
        }, 1000);
      }
    }

    rollAnimation();
  }

  return (
    <main
      style={{
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
        overflow: "hidden",
      }}
    >
      {showFireworks && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: "10px",
                height: "10px",
                backgroundColor: i % 2 === 0 ? "#FFCE00" : "#FF8000",
                borderRadius: "50%",
                animation: "explode 1s ease-out forwards",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes explode {
              0% { transform: scale(0) translateY(0); opacity: 1; }
              100% { transform: scale(2) translateY(-100px); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "clamp(1.5rem, 5vw, 2.5rem)", zIndex: 1 }}>
        [Data&AI] Monthly Checkpoint
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginBottom: "2rem", width: "100%", maxWidth: "600px", zIndex: 1 }}>
        <input
          value={newParticipant}
          onChange={e => setNewParticipant(e.target.value)}
          placeholder="Nome Completo"
          style={{
            flex: "1 1 300px",
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "2px solid #FFCE00",
            backgroundColor: "#333333",
            color: "#FFCE00",
          }}
        />
        <button
          onClick={addParticipant}
          style={{
            backgroundColor: "#FF8000",
            color: "#000000",
            border: "none",
            padding: "10px 20px",
            fontSize: "1rem",
            borderRadius: "5px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Participar
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, width: "100%", maxWidth: "600px", zIndex: 1 }}>
        {participants.map((p, i) => (
          <li
            key={p.id}
            style={{
              backgroundColor: selected.some(w => w.id === p.id) ? "#FF8000" : "#333333",
              color: selected.some(w => w.id === p.id) ? "#000000" : "#FFCE00",
              fontWeight: selected.some(w => w.id === p.id) ? "bold" : "normal",
              border: selected.some(w => w.id === p.id) ? "2px solid #FFCE00" : "none",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              transition: "all 0.3s ease",
              textAlign: "center",
            }}
          >
            {i + 1}. {p.content}
          </li>
        ))}
      </ul>

      {countdown !== null && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        backgroundColor: "#FFCE00",
        color: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "3rem",
        fontWeight: "bold",
        animation: "pulse-countdown 1s ease-in-out infinite",
      }}
    >
      {countdown}
    </div>
    <style>{`
      @keyframes pulse-countdown {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
)}

      {selected.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "2rem", zIndex: 1 }}>
          <h2 style={{ color: "#FFCE00" }}>
            Participante{selected.length > 1 ? "s" : ""} Sorteado{selected.length > 1 ? "s" : ""}:
          </h2>
          {selected.map((w, idx) => (
            <p key={w.id} style={{ fontSize: selected.length > 1 ? "1.2rem" : "2rem", fontWeight: "bold", color: "#FF8000", margin: "0.5rem 0" }}>
              {`${idx + 1}º ${w.content}`}
            </p>
          ))}
        </div>
      )}

      <div style={{ marginTop: "2rem", zIndex: 1 }}>
        <label>Quantidade de Sorteados:</label>
        <input
          type="number"
          min="1"
          value={drawCount}
          onChange={e => setDrawCount(Math.max(1, Number(e.target.value)))}
          style={{ marginLeft: "10px", width: "50px" }}
        />
      </div>

      <div style={{ marginTop: "3rem", zIndex: 1 }}>
        <button
          onClick={drawParticipant}
          disabled={isDrawing}
          style={{
            backgroundColor: isDrawing ? "#666666" : "#FFCE00",
            color: "#000000",
            border: "none",
            padding: "10px 20px",
            fontSize: "1rem",
            borderRadius: "5px",
            cursor: isDrawing ? "not-allowed" : "pointer",
            opacity: isDrawing ? 0.7 : 1,
          }}
        >
          {isDrawing ? "Sorteando..." : "Iniciar Sorteio"}
        </button>
      </div>
    </main>
  );
}
