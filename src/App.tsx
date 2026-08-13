import React, { useState, useEffect } from "react";

const USERS = [{ n: "Lucio", p: "4321" }, { n: "Tio Joao", p: "1111" }, { n: "Ana", p: "2222" }];
const LIMITE = new Date("2026-08-13T11:30:00-03:00");

// 🎾 OS 32 CONFRONTOS REAIS DA 1ª RODADA
const JOGOS_R1 = [
  { jA: "C. Norrie", jB: "D. Prizmic" }, { jA: "M. Fucsovics", jB: "T. Atmane" },
  { jA: "C. Moutet", jB: "H. Hurkacz" }, { jA: "Qualifier", jB: "A. Vallejo" },
  { jA: "D. Shapovalov", jB: "A. Mannarino" }, { jA: "R. Burruchaga", jB: "J. L. Struff" },
  { jA: "M. Navone", jB: "R. Collignon" }, { jA: "C. Carabelli", jB: "M. Kecmanovic" },
  { jA: "T. Tirante", jB: "J. Choinski" }, { jA: "M. Landaluce", jB: "Jack Draper" },
  { jA: "R. Hijikata", jB: "G. Monfils" }, { jA: "Z. Svajda", jB: "M. Bellucci" },
  { jA: "Qualifier", jB: "M. Berrettini" }, { jA: "Y. Hanfmann", jB: "Qualifier" },
  { jA: "Qualifier", jB: "J. Duckworth" }, { jA: "V. Kopriva", jB: "Qualifier" },
  { jA: "A. Michelsen", jB: "J. de Jong" }, { jA: "D. M. Aguilar", jB: "M. Cilic" },
  { jA: "B. v. de Zandschulp", jB: "T. Griekspoor" }, { jA: "Qualifier F", jB: "K. Majchrzak" },
  { jA: "T. Machac", jB: "P. Carreno-Busta" }, { jA: "N. Borges", jB: "T. Kokkinakis" },
  { jA: "A. Kovacevic", jB: "K. Khachanov" }, { jA: "H. Medjedovic", jB: "Qualifier G" },
  { jA: "J. Brooksby", jB: "Qualifier H" }, { jA: "A. Walton", jB: "Qualifier I" },
  { jA: "F. Marozsan", jB: "Qualifier J" }, { jA: "Qualifier K", jB: "D. Altmaier" },
  { jA: "S. Baez", jB: "Grigor Dimitrov" }, { jA: "J. Shang", jB: "L. Sonego" },
  { jA: "J. M. Cerundolo", jB: "Qualifier L" }, { jA: "V. Royer", jB: "S. Tsitsipas" }
];

// 👑 ORDEM DOS BYES CORRIGIDA (Aliassime inserido no lugar de Alcaraz como Seed 2)
const BYES_R2 = [
  "A. Zverev (1)", "T. M. Etcheverry (26)", "T. Paul (18)", "V. Vacherot (15)", 
  "R. Jodar", "A. Tabilo (22)", "A. Blockx", "F. Cobolli (7)",
  "N. Djokovic (3)", "M. Arnaldi (31)", "L. Darderi (19)", "J. Mensik (14)",
  "J. Lehecka (9)", "A. Fils (21)", "A. Fery (32)", "A. de Minaur (5)",
  "T. Fritz (6)", "Z. Bergs (30)", "João Fonseca (23)", "Casper Ruud (11)",
  "Andrey Rublev (13)", "F. Cerundolo (20)", "B. Nakashima", "Daniil Medvedev (4)", 
   "B. Shelton (8)", "I. Buse (29)",   "U. Humbert (24)", "L. Musetti (10)", "L. Tien (16)",
  "F. Tiafoe (17)", "A. Rinderknech (25)", "F. Auger-Aliassime (2)"
];
 
const CONFIG = [
  { id: 1, nome: "1ª Rodada", pts: 10, total: 32 }, { id: 2, nome: "2ª Rodada (Byes)", pts: 20, total: 32 },
  { id: 3, nome: "3ª Rodada", pts: 30, total: 16 }, { id: 4, nome: "Oitavas de Final", pts: 40, total: 8 },
  { id: 5, nome: "Quartas de Final", pts: 60, total: 4 }, { id: 6, nome: "Semifinal", pts: 80, total: 2 },
  { id: 7, nome: "Grande Final", pts: 100, total: 1 }
];
export default function App() {
  const [tela, setTela] = useState<"login" | "palpites" | "ranking" | "admin">("login");
  const [user, setUser] = useState(""); const [rCurr, setRCurr] = useState(1);
  const [inputN, setInputN] = useState(""); const [inputP, setInputP] = useState("");
  const [votos, setVotos] = useState<{ [key: string]: string }>({});
  const [resultados, setResultados] = useState<{ [key: string]: string }>({});
  const [ranking, setRanking] = useState<{ nome: string; pontos: number }[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<{ n: string; p: string }[]>(USERS);
  const [textoImportar, setTextoImportar] = useState("");
  const bloqueado = new Date() > LIMITE;

  useEffect(() => { 
    const res = localStorage.getItem("b_res"); if (res) setResultados(JSON.parse(res)); 
    const uSalvos = localStorage.getItem("b_usuarios_locais");
    if (uSalvos) { setListaUsuarios([...USERS, ...JSON.parse(uSalvos)]); }
  }, []);

  useEffect(() => { if (user && tela === "palpites") { const s = localStorage.getItem(`b_96_${user}`); if (s) setVotos(JSON.parse(s)); } }, [user, tela]);
  
  useEffect(() => {
    if (tela === "ranking") {
      const lista = listaUsuarios.map(u => {
        const p = JSON.parse(localStorage.getItem(`b_96_${u.n}`) || "{}"); let pts = 0;
        Object.keys(resultados).forEach(k => { if (p[k] === resultados[k]) { const f = CONFIG.find(c => c.id === parseInt(k.split("_"))); if (f) pts += f.pts; } });
        return { nome: u.n, pontos: pts };
      }); setRanking(lista.sort((a, b) => b.pontos - a.pontos));
    }
  }, [tela, resultados, listaUsuarios]);

  const logar = (e: React.FormEvent) => {
    e.preventDefault(); const u = listaUsuarios.find(x => x.n.toLowerCase() === inputN.trim().toLowerCase());
    if (!u || u.p !== inputP.trim()) return alert("Dados incorretos! Se você é novo, clique em Cadastrar.");
    setUser(u.n); setTela(bloqueado ? "ranking" : "palpites");
  };

  const cadastrarAparelho = () => {
    const nomeCler = inputN.trim(); const pinCler = inputP.trim();
    if (!nomeCler || pinCler.length < 4) return alert("Digite um Nome e um PIN de 4 dígitos!");
    const jaExiste = listaUsuarios.find(x => x.n.toLowerCase() === nomeCler.toLowerCase());
    if (jaExiste) return alert("Esse nome já está cadastrado!");
    const novosLocais = JSON.parse(localStorage.getItem("b_usuarios_locais") || "[]");
    novosLocais.push({ n: nomeCler, p: pinCler });
    localStorage.setItem("b_usuarios_locais", JSON.stringify(novosLocais));
    setListaUsuarios([...listaUsuarios, { n: nomeCler, p: pinCler }]);
    setUser(nomeCler); alert("Cadastro realizado com sucesso! 🎉");
    setTela(bloqueado ? "ranking" : "palpites");
  };

  const processarImportacao = () => {
    try {
      if (!textoImportar.includes("||")) return alert("Código inválido!");
      const [nomePart, dadosVotos] = textoImportar.split("||");
      const n = nomePart.replace("BOLAO:", "").trim();
      const v = JSON.parse(dadosVotos.trim());
      localStorage.setItem(`b_96_${n}`, JSON.stringify(v));
      const novosLocais = JSON.parse(localStorage.getItem("b_usuarios_locais") || "[]");
      if (!listaUsuarios.find(x => x.n.toLowerCase() === n.toLowerCase())) {
        novosLocais.push({ n: n, p: "0000" });
        localStorage.setItem("b_usuarios_locais", JSON.stringify(novosLocais));
        setListaUsuarios([...listaUsuarios, { n: n, p: "0000" }]);
      }
      alert(`Palpites de ${n} importados com sucesso! 🎾`); setTextoImportar("");
    } catch (e) { alert("Erro ao ler o código. Verifique se copiou inteiro."); }
  };

  const getNome = (fase: number, idx: number, pos: "A" | "B", dados: any): string => {
    if (fase === 1) return pos === "A" ? JOGOS_R1[idx].jA : JOGOS_R1[idx].jB;
    if (fase === 2) return pos === "A" ? BYES_R2[idx] : dados[`1_j${idx + 1}`] || `Venc. R1 J${idx + 1}`;
    const fAnt = fase - 1; let idxA = idx * 2 + 1; let idxB = idx * 2 + 2;
    if (fase === 3 && idx === 3) { idxA = 7; idxB = 8; } if (fase === 3 && idx === 15) { idxA = 31; idxB = 32; }
    return pos === "A" ? (dados[`${fAnt}_j${idxA}`] || `Venc. F${fAnt} J${idxA}`) : (dados[`${fAnt}_j${idxB}`] || `Venc. F${fAnt} J${idxB}`);
  };

  const info = CONFIG.find(r => r.id === rCurr)!;

  const renderCard = (i: number, modoAdmin: boolean) => {
    const chave = `${rCurr}_j${i + 1}`; const ctx = modoAdmin ? resultados : votos;
    const nA = getNome(rCurr, i, "A", modoAdmin ? resultados : votos); const nB = getNome(rCurr, i, "B", modoAdmin ? resultados : votos);
    const bStyle = { display: "block", width: "100%", padding: "12px", borderRadius: "12px", fontSize: "12px", textAlign: "left" as const, border: "1px solid #e2e8f0", marginBottom: "4px" };
    const sSel = { ...bStyle, backgroundColor: modoAdmin ? "#e11d48" : "#1d4ed8", color: "#ffffff", fontWeight: "bold", borderColor: modoAdmin ? "#be123c" : "#1e40af" };
    const sNot = { ...bStyle, backgroundColor: "#f8fafc", color: "#334155" };
    return (
      <div key={i} style={{ backgroundColor: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
        <p style={{ fontSize: "10px", fontWeight: "bold", color: "#94a3b8", marginBottom: "4px" }}>JOGO #{i + 1}</p>
        <button onClick={() => { if (modoAdmin) { const n = { ...resultados, [chave]: nA }; setResultados(n); localStorage.setItem("b_res", JSON.stringify(n)); } else { setVotos({ ...votos, [chave]: nA }); } }} style={ctx[chave] === nA ? sSel : sNot}>🎾 {nA}</button>
        <button onClick={() => { if (modoAdmin) { const n = { ...resultados, [chave]: nB }; setResultados(n); localStorage.setItem("b_res", JSON.stringify(n)); } else { setVotos({ ...votos, [chave]: nB }); } }} style={ctx[chave] === nB ? sSel : sNot}>🎾 {nB}</button>
      </div>
    );
  };
  if (tela === "login") {
    return (
      <div style={{ display: "flex", minHeight: "100vh", width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#1e3a8a", padding: "24px", color: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}><span style={{ fontSize: "48px" }}>🎾</span><h1 style={{ fontSize: "26px", fontWeight: "900", margin: "4px 0" }}>Bolão da Família Moreno</h1><p style={{ color: "#93c5fd", fontSize: "12px", fontWeight: "bold", margin: 0 }}>by Lãncio</p><p style={{ fontSize: "11px", color: "#bfdbfe", marginTop: "8px" }}>Apostas até: 13/08 às 11:30</p></div>
        <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", width: "100%", maxWidth: "340px", marginBottom: "20px", boxSizing: "border-box" }}>
          <form onSubmit={logar}>
            <input type="text" placeholder="Nome" value={inputN} onChange={e => setInputN(e.target.value)} style={{ display: "block", width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", marginBottom: "12px", boxSizing: "border-box", color: "#000" }} />
            <input type="password" placeholder="PIN" maxLength={4} value={inputP} onChange={e => setInputP(e.target.value)} style={{ display: "block", width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", marginBottom: "16px", textAlign: "center", boxSizing: "border-box", color: "#000" }} />
            <button type="submit" style={{ display: "block", width: "100%", backgroundColor: "#1d4ed8", color: "#ffffff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: "900", cursor: "pointer", marginBottom: "10px" }}>Entrar 🔐</button>
          </form>
          <button onClick={cadastrarAparelho} style={{ display: "block", width: "100%", backgroundColor: "#10b981", color: "#ffffff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: "900", cursor: "pointer" }}>Criar Nova Conta ✨</button>
        </div>
        <button onClick={() => { const p = prompt("Senha:"); if (p === "vovo123") setTela("admin"); else alert("Erro!"); }} style={{ background: "none", border: "none", color: "#93c5fd", fontSize: "11px", textDecoration: "underline", cursor: "pointer" }}>Área do Juiz ⚙️</button>
      </div>
    );
  }

  if (tela === "palpites") {
    return (
      <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "#f8fafc", padding: "16px", color: "#1e293b", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}><div><h1 style={{ fontSize: "16px", fontWeight: "900", color: "#1d4ed8", margin: 0 }}>{info.nome}</h1></div><span style={{ fontSize: "10px", fontWeight: "bold", backgroundColor: "#dbeafe", color: "#1d4ed8", padding: "4px 8px", borderRadius: "6px" }}>{info.pts} pts</span></header>
          <main>{Array.from({ length: info.total }).map((_, i) => renderCard(i, false))}</main>
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            {rCurr > 1 && <button onClick={() => setRCurr(rCurr - 1)} style={{ flex: 1, backgroundColor: "#e2e8f0", color: "#334155", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>← Voltar</button>}
            <button onClick={() => { 
              if (rCurr < 7) { 
                setRCurr(rCurr + 1); window.scrollTo(0, 0); 
              } else { 
                localStorage.setItem(`b_96_${user}`, JSON.stringify(votos)); 
                const codzap = `BOLAO:${user}||${JSON.stringify(votos)}`;
                navigator.clipboard.writeText(codzap);
                alert("Salvo! 🎾 O seu código do WhatsApp foi COPIADO automaticamente! Envie para o Juiz Lucio.");
                setTela("ranking"); 
              } 
            }} style={{ flex: 2, backgroundColor: "#1d4ed8", color: "#ffffff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>{rCurr === 7 ? "Salvar e Copiar p/ WhatsApp! 🚀" : "Avançar →"}</button>
          </div>
        </div>
      </div>
    );
  }

  if (tela === "admin") {
    return (
      <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "#fff1f2", padding: "16px", color: "#9f1239", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <header style={{ display: "flex", borderBottom: "1px solid #fecdd3", paddingBottom: "12px", marginBottom: "16px", justifyContent: "space-between", alignItems: "center" }}><div><h1 style={{ fontSize: "15px", fontWeight: "950", color: "#e11d48", margin: 0 }}>Área do Juiz ({info.nome})</h1><p style={{ fontSize: "10px", color: "#9f1239", margin: 0 }}>Marque em vermelho quem venceu</p></div><button onClick={() => { setRCurr(1); setTela("login"); }} style={{ padding: "6px 12px", backgroundColor: "#ffffff", border: "1px solid #fecdd3", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", color: "#e11d48", cursor: "pointer" }}>Sair Juiz</button></header>
          
          <div style={{ backgroundColor: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid #fecdd3", marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: "bold", margin: "0 0 6px 0", color: "#e11d48" }}>📥 IMPORTAR PALPITE DE PARENTE:</p>
            <input type="text" placeholder="Cole o código do WhatsApp aqui..." value={textoImportar} onChange={e => setTextoImportar(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "11px", marginBottom: "6px", color: "#000" }} />
            <button onClick={processarImportacao} style={{ width: "100%", backgroundColor: "#e11d48", color: "#ffffff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Adicionar Participante no Ranking 📥</button>
          </div>

          <main>{Array.from({ length: info.total }).map((_, i) => renderCard(i, true))}</main>
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            {rCurr > 1 && <button onClick={() => setRCurr(rCurr - 1)} style={{ flex: 1, backgroundColor: "#ffffff", border: "1px solid #fecdd3", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "13px", cursor: "pointer", color: "#e11d48" }}>← Voltar</button>}
            {rCurr < 7 && <button onClick={() => { setRCurr(rCurr + 1); window.scrollTo(0, 0); }} style={{ flex: 1, backgroundColor: "#e11d48", color: "#ffffff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>Próxima Fase →</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "#f8fafc", padding: "24px 16px", color: "#1e293b", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <header style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", position: "relative" }}><button onClick={() => { setRCurr(1); setTela("login"); }} style={{ position: "absolute", left: 0, top: "4px", background: "none", border: "none", color: "#64748b", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>← Sair</button><h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#1d4ed8", margin: 0 }}>Ranking da Família</h1></header>
        <main style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          {ranking.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}><span style={{ fontWeight: "bold", color: "#cbd5e1" }}>#{i + 1}</span><h3 style={{ fontWeight: "bold", fontSize: "14px", margin: 0 }}>{f.nome} {f.nome === user && "(Você)"}</h3></div>
              <div><span style={{ fontSize: "16px", fontWeight: "900", color: "#1d4ed8" }}>{f.pontos}</span> <span style={{ fontSize: "12px", color: "#94a3b8" }}>pts</span></div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
