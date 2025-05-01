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
<<<<<<< HEAD:app/sorteio/page.tsx
  const [currentRoll, setCurrentRoll] = useState<Schema["Todo"]["type"] | null>(null);
=======
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
  const [isDrawing, setIsDrawing] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");
  const [drawCount, setDrawCount] = useState(1);

<<<<<<< HEAD:app/sorteio/page.tsx
  // carrega lista em real-time
=======
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
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

  // adiciona participante, sem duplicatas
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

  // QRNG ou fallback Math.random
  async function getQuantumRandomIndex(max: number) {
    try {
<<<<<<< HEAD:app/sorteio/page.tsx
      const res = await fetch(
        "https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16"
      );
      const js = await res.json();
      return js.success && js.data?.length
        ? js.data[0] % max
=======
      const res = await fetch("https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16");
      const data = await res.json();
      return data.success && data.data?.length
        ? data.data[0] % max
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
        : Math.floor(Math.random() * max);
    } catch {
      return Math.floor(Math.random() * max);
    }
  }

  // executa sorteio
  async function drawParticipant() {
    if (!participants.length || isDrawing) return;
    setIsDrawing(true);
    setShowFireworks(false);
    setSelected([]);

<<<<<<< HEAD:app/sorteio/page.tsx
    // animação de rolagem rápida
    let rounds = 10;
    let delay = 30;
    const roll = () => {
      const idx = Math.floor(Math.random() * participants.length);
      setCurrentRoll(participants[idx]);
      if (--rounds > 0) {
        delay += 15;
        setTimeout(roll, delay);
      }
    };
    roll();

    // garante que não peça mais vencedores do que há participantes
    const count = Math.min(drawCount, participants.length);

    // após animação, seleciona vencedores únicos
    setTimeout(async () => {
      const winners: Schema["Todo"]["type"][] = [];
      const used = new Set<string>();
      for (let i = 0; i < count; i++) {
=======
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
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
        let idx = await getQuantumRandomIndex(participants.length);
        const p = participants[idx];
        if (!used.has(p.id)) {
          used.add(p.id);
          winners.push(p);
        } else {
<<<<<<< HEAD:app/sorteio/page.tsx
          i--; // repete em caso de duplicata
=======
          i--; // repete se duplicado
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
        }
      }
      setSelected(winners);
      setShowFireworks(true);
      setIsDrawing(false);
      setTimeout(() => setShowFireworks(false), 3000);
    }, 500 + rounds * delay);
  }

  return (
<<<<<<< HEAD:app/sorteio/page.tsx
    <main
      style={{
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
        boxSizing: "border-box",
      }}
    >
      {/* fogos */}
      {showFireworks && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: 10,
                height: 10,
                backgroundColor: i % 2 === 0 ? "#FFCE00" : "#FF8000",
                borderRadius: "50%",
                animation: "explode 1s ease-out forwards",
                animationDelay: `${i * 0.2}s`,
              }}
            />
=======
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
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
          ))}
          <style>{`
            @keyframes explode {
              0% { transform: scale(0); opacity: 1; }
              100% { transform: scale(2); opacity: 0; }
            }
          `}</style>
        </div>
      )}

<<<<<<< HEAD:app/sorteio/page.tsx
      <h1
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
        }}
      >
        [Data&AI] Monthly Checkpoint
      </h1>

      {/* cadastro */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "1rem",
          width: "100%",
          maxWidth: 600,
        }}
      >
=======
      <h1 style={{ fontSize: "clamp(1.5rem,5vw,2.5rem)", marginBottom: "1rem" }}>
        [Data&AI] Monthly Checkpoint
      </h1>

      <div style={{
        display: "flex", gap: "1rem", flexWrap: "wrap",
        justifyContent: "center", marginBottom: "1rem", width:"100%", maxWidth:600
      }}>
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
        <input
          value={newParticipant}
          onChange={e => setNewParticipant(e.target.value)}
          placeholder="Nome Completo"
          style={{
<<<<<<< HEAD:app/sorteio/page.tsx
            flex: "1 1 300px",
            padding: 10,
            fontSize: 16,
            borderRadius: 5,
            border: "2px solid #FFCE00",
            backgroundColor: "#333",
            color: "#FFCE00",
          }}
        />
        <button
          onClick={addParticipant}
          style={{
            backgroundColor: "#FF8000",
            color: "#000",
            border: "none",
            padding: "10px 20px",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Participar
        </button>
      </div>

      {/* quantos sorteados */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ marginRight: 8 }}>Quantos sorteados?</label>
        <input
          type="number"
          min={1}
          max={participants.length}
          value={drawCount}
          onChange={e => setDrawCount(Number(e.target.value) || 1)}
          style={{
            width: "4rem",
            padding: 5,
            borderRadius: 5,
            border: "2px solid #FFCE00",
            backgroundColor: "#333",
            color: "#FFCE00",
            textAlign: "center",
=======
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
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
          }}
        />
      </div>

<<<<<<< HEAD:app/sorteio/page.tsx
      {/* lista */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          width: "100%",
          maxWidth: 600,
          marginBottom: "2rem",
        }}
      >
        {participants.map((p, i) => (
          <li
            key={p.id}
            style={{
              backgroundColor: selected.some(w => w.id === p.id)
                ? "#FF8000"
                : "#333",
              color: selected.some(w => w.id === p.id)
                ? "#000"
                : "#FFCE00",
              fontWeight: selected.some(w => w.id === p.id)
                ? "bold"
                : "normal",
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
              textAlign: "center",
            }}
          >
            {i + 1}. {p.content}
=======
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
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
          </li>
        ))}
      </ul>

<<<<<<< HEAD:app/sorteio/page.tsx
      {/* resultado */}
      {selected.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ color: "#FFCE00" }}>Participantes Sorteados:</h2>
          <p
            style={{
              color: "#FF8000",
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}
          >
            {selected.map(w => w.content).join(", ")}
=======
      {selected.length>0 && (
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <h2 style={{ color:"#FFCE00" }}>Participantes Sorteados:</h2>
          <p style={{ color:"#FF8000", fontSize:"1.25rem", fontWeight:"bold" }}>
            {selected.map(w=>w.content).join(", ")}
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
          </p>
        </div>
      )}

<<<<<<< HEAD:app/sorteio/page.tsx
      {/* botão */}
=======
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
      <button
        onClick={drawParticipant}
        disabled={isDrawing}
        style={{
<<<<<<< HEAD:app/sorteio/page.tsx
          backgroundColor: isDrawing ? "#666" : "#FFCE00",
          color: "#000",
          border: "none",
          padding: "10px 20px",
          borderRadius: 5,
          cursor: isDrawing ? "not-allowed" : "pointer",
          opacity: isDrawing ? 0.7 : 1,
=======
          backgroundColor: isDrawing? "#666" : "#FFCE00",
          color:"#000", border:"none", padding:"10px 20px",
          borderRadius:5, cursor:isDrawing?"not-allowed":"pointer",
          opacity:isDrawing?0.7:1
>>>>>>> b186eaab52a984c3bb011742c5e3171f2692afde:app/page.tsx
        }}
      >
        Iniciar Sorteio
      </button>
    </main>
  );
}
