"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [participants, setParticipants] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [selected, setSelected] = useState<Schema["Todo"]["type"] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

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
    const name = window.prompt("Digite o Nome Completo do participante:");
    if (name) {
      client.models.Todo.create({ content: name });
    }
  }

  function drawParticipant() {
    if (participants.length === 0 || isDrawing) return;

    setIsDrawing(true);
    setShowFireworks(false);

    let rounds = 20;
    let delay = 50;

    function roll() {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setSelected(participants[randomIndex]);
      rounds--;

      if (rounds > 0) {
        delay += 20;
        setTimeout(roll, delay);
      } else {
        setIsDrawing(false);
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 4000);
      }
    }

    roll();
  }

  return (
    <main style={{ padding: "2rem", backgroundColor: "#000000", minHeight: "100vh", color: "#FFCE00", fontFamily: "Arial, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Fogos de artifício */}
      {showFireworks && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
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

      <h1 style={{ textAlign: "center", color: "#FFCE00", marginBottom: "2rem" }}>
        [Data&AI] Monthly Checkpoint
      </h1>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}>
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
          }}
        >
          + Adicionar Participante
        </button>

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
            opacity: isDrawing ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {isDrawing && (
            <div
              style={{
                border: "3px solid #000000",
                borderTop: "3px solid #FFCE00",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                animation: "spin 1s linear infinite",
              }}
            />
          )}
          🎲 {isDrawing ? "Sorteando..." : "Sortear Participante"}
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
        {participants.map((participant, index) => (
          <li
            key={participant.id}
            style={{
              backgroundColor: selected?.id === participant.id ? "#FF8000" : "#333333",
              color: selected?.id === participant.id ? "#000000" : "#FFCE00",
              fontWeight: selected?.id === participant.id ? "bold" : "normal",
              border: selected?.id === participant.id ? "2px solid #FFCE00" : "none",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              transition: "all 0.3s ease",
              animation: selected?.id === participant.id ? "pulse 1s infinite alternate" : "none",
            }}
          >
            {index + 1}. {participant.content}
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h2 style={{ color: "#FFCE00" }}>Participante Sorteado:</h2>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#FF8000" }}>{selected.content}</p>
        </div>
      )}

      {/* Animações Globais */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
