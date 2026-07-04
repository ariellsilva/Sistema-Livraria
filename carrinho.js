// 1. IMPORTAÇÕES E CONFIGURAÇÃO DO FIREBASE (Igual ao seu outro arquivo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSqG-8e3r2uW_XNVbO_nXqnHmmKpdKbIs",
    authDomain: "dados-livraria.firebaseapp.com",
    databaseURL: "https://dados-livraria-default-rtdb.firebaseio.com",
    projectId: "dados-livraria",
    storageBucket: "dados-livraria.firebasestorage.app",
    messagingSenderId: "505409810627",
    appId: "1:505409810627:web:3a89b606f30588f4603276",
    measurementId: "G-TR4BRZQL6D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const containerCarrinho = document.getElementById("itens-do-carrinho");
const painelUsuario = document.getElementById("identificacao-usuario");

// Espera o Firebase dizer quem está logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário logado! 

        // 1. Mostra o painel de identificação
        if (painelUsuario) {
            painelUsuario.style.display = "block";
            
            // Se o usuário não tiver um "displayName" cadastrado, usamos a primeira parte do e-mail como nome
            const nomeUsuario = user.displayName || user.email.split('@')[0];
            
            painelUsuario.innerHTML = `
                <p style="margin: 0; font-size: 14px; color: #555;">
                    Carrinho de: <strong style="color: #000; font-size: 16px;">${nomeUsuario}</strong> 
                    (${user.email})
                </p>
            `;
        }

        // 2. Busca o carrinho específico dele:
        let carrinho = JSON.parse(localStorage.getItem(`carrinho-${user.uid}`)) || [];
        exibirCarrinho(carrinho);

    } else {
        // Ninguém está logado
        if (painelUsuario) painelUsuario.style.display = "none"; // Esconde o painel

        if (containerCarrinho) {
            containerCarrinho.innerHTML = "<p>🔒 Por favor, faça login para ver seus itens no carrinho.</p>";
        }
    }
});

// 3. FUNÇÃO QUE RENDERIZA OS ITENS NA TELA
function exibirCarrinho(carrinho) {
    if (!containerCarrinho) return; // Segurança caso o elemento sumisse

    if (carrinho.length === 0) {
        containerCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        containerCarrinho.innerHTML = carrinho.map(item => `
            <div class="item-carrinho" style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; display: flex; align-items: center; gap: 15px;">
                <img src="${item.imagem}" alt="${item.titulo}" width="60">
                <div>
                    <h3>${item.titulo}</h3>
                    <p>Quantidade: ${item.quantidade}</p>
                </div>
            </div>
        `).join("");
    }
}