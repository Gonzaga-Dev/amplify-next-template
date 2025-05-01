// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function App() {
  const [participants, setParticipants] = useState<Schema["Todo"]["type"][]>([]);
  const [selected, setSelected] = useState<Schema["Todo"]["type"][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");
  const [drawCount, setDrawCount] = useState(1);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe(({ data }) => {
      const sorted = [...data.items].sort((a, b) =>
        a.createdAt && b.createdAt
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : 0
      );
      setParticipants(sorted);
    });
    return () => sub.unsubscribe();
  }, []);

  function addParticipant() {
    const name = newParticipant.trim();
    if (!name) return;
    if (participants.some(p => p.content.toLowerCase() === name.toLowerCase())) {
      alert("Já está cadastrado");
      return;
    }
    client.models.Todo.create({ content: name });
    setNewParticipant("");
  }

  async function getQuantumRandomIndex(max: number) {
    try {
      const res = await fetch("https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16");
      const data = await res.json();
      return data.success && data.data?.length
        ? data.data[0] % max
        : Math.floor(Math.random() * max);
    } catch {
      return Math.floor(Math.random() * max);
    }
  }

  async function drawParticipant() {
    if (!participants.length || isDrawing) return;
    setIsDrawing(true);
    setShowFireworks(false);
    setSelected([]);

    // breve animação de rolagem
    let rounds = 10, delay = 30;
    const roll = () => {
      const idx = Math.floor(Math.random() * participants.length);
      setTimeout(roll, --rounds > 0 ? (delay += 15) : 0);
    };
    roll();

    // após animação, escolhe 'drawCount' nomes únicos
    setTimeout(async () => {
      const winners: Schema["Todo"]["type"][] = [];
      const used = new Set<string>();
      for (let i = 0; i < drawCount; i++) {
        let idx = await getQuantumRandomIndex(participants.length);
        const p = participants[idx];
        if (!used.has(p.id)) {
          used.add(p.id);
          winners.push(p);
        } else {
          i--; // repete se duplicado
        }
      }
      setSelected(winners);
      setShowFireworks(true);
      setIsDrawing(false);
      setTimeout(() => setShowFireworks(false), 3000);
    }, 500 + rounds * delay);
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
      position: "relative",
      boxSizing: "border-box"
    }}>
      {showFireworks && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              top: `${Math.random()*100}%`,
              left: `${Math.random()*100}%`,
              width: 10, height: 10,
              backgroundColor: i%2===0? "#FFCE00" : "#FF8000",
              borderRadius: "50%",
              animation: "explode 1s ease-out forwards",
              animationDelay: `${i*0.2}s`
            }}/>
          ))}
          <style>{`
            @keyframes explode {
              0% { transform: scale(0); opacity: 1; }
              100% { transform: scale(2); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      <h1 style={{ fontSize: "clamp(1.5rem,5vw,2.5rem)", marginBottom: "1rem" }}>
        [Data&AI] Monthly Checkpoint
      </h1>

      <div style={{
        display: "flex", gap: "1rem", flexWrap: "wrap",
        justifyContent: "center", marginBottom: "1rem", width:"100%", maxWidth:600
      }}>
        <input
          value={newParticipant}
          onChange={e => setNewParticipant(e.target.value)}
          placeholder="Nome Completo"
          style={{
            flex:"1 1 300px", padding:10, fontSize:16,
            borderRadius:5, border:"2px solid #FFCE00",
            backgroundColor:"#333", color:"#FFCE00"
          }}
        />
        <button onClick={addParticipant} style={{
          backgroundColor:"#FF8000", color:"#000", border:"none",
          padding:"10px 20px", borderRadius:5, cursor:"pointer"
        }}>Participar</button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: 8 }}>Quantos sorteados?</label>
        <input
          type="number" min={1} max={participants.length} value={drawCount}
          onChange={e => setDrawCount(Number(e.target.value) || 1)}
          style={{
            width: "4rem", padding:5, borderRadius:5,
            border:"2px solid #FFCE00", backgroundColor:"#333",
            color:"#FFCE00", textAlign:"center"
          }}
        />
      </div>

      <ul style={{
        listStyle:"none", padding:0, width:"100%", maxWidth:600, marginBottom:"2rem"
      }}>
        {participants.map((p,i) => (
          <li key={p.id} style={{
            backgroundColor: selected.some(w=>w.id===p.id) ? "#FF8000" : "#333",
            color: selected.some(w=>w.id===p.id) ? "#000" : "#FFCE00",
            fontWeight: selected.some(w=>w.id===p.id) ? "bold" : "normal",
            padding:10, marginBottom:10, borderRadius:5, textAlign:"center"
          }}>
            {i+1}. {p.content}
          </li>
        ))}
      </ul>

      {selected.length>0 && (
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <h2 style={{ color:"#FFCE00" }}>Participantes Sorteados:</h2>
          <p style={{ color:"#FF8000", fontSize:"1.25rem", fontWeight:"bold" }}>
            {selected.map(w=>w.content).join(", ")}
          </p>
        </div>
      )}

      <button
        onClick={drawParticipant}
        disabled={isDrawing}
        style={{
          backgroundColor: isDrawing? "#666" : "#FFCE00",
          color:"#000", border:"none", padding:"10px 20px",
          borderRadius:5, cursor:isDrawing?"not-allowed":"pointer",
          opacity:isDrawing?0.7:1
        }}
      >
        Iniciar Sorteio
      </button>
    </main>
  );
}
