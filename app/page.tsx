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
        const finalIndex = await getQuantumRandomIndex(participants.length);
        const winner = participants[finalIndex];
        setSelected(winner);
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 3000);
        setIsDrawing(false);

        // Deletar o nome sorteado imediatamente
        if (winner && winner.id) {
          await client.models.Todo.delete({ id: winner.id });
        }

        // Programar para limpar toda a lista 2 horas depois
        setTimeout(async () => {
          const result = await client.models.Todo.list();
          const deletions = result.data.map((item) => client.models.Todo.delete({ id: item.id }));
          await Promise.all(deletions);
        }, 2 * 60 * 60 * 1000); // 2 horas
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

      {/* Fireworks e layout da página... permanece igual ao anterior */}

      {/* Input, botão de participar, lista de participantes, botão de sorteio... tudo igual */}

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
