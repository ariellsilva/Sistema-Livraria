// 1. Inicializa o núcleo do Firebase usando o link CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// 2. Importa o Analytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// 3. Importa as funções de AUTENTICAÇÃO (Incluindo o updateProfile agora)
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// A sua configuração exata do projeto "dados-livraria"
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

// Inicializa os serviços básicos
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Ativa o serviço de Autenticação
const auth = getAuth(app);

// Seleciona o formulário do HTML
const formulario = document.getElementById("formulario-cadastro");

if (formulario) {
    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Pega o que o usuário digitou na tela
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            // 1. Envia os dados para a aba Authentication do Firebase
            const resultadoUnico = await createUserWithEmailAndPassword(auth, email, senha);
            
            // 2. Grava o nome real do usuário dentro do Firebase Auth criado
            await updateProfile(resultadoUnico.user, {
                displayName: nome
            });
            
            console.log("Usuário criado e perfil atualizado com sucesso:", resultadoUnico.user);
            alert("Cadastro realizado com sucesso!");
            
            // Redireciona para a página de login
            window.location.href = "login.html";
        } 
        catch (error) {
            console.error("Erro ao cadastrar:", error);
            
            // Seu tratamento de erros amigável guardado
            if (error.code === 'auth/weak-password') {
                alert('A senha precisa ter pelo menos 6 caracteres.');
            } else if (error.code === 'auth/email-already-in-use') {
                alert('Este e-mail já está em uso.');
            } else if (error.code === 'auth/invalid-email') {
                alert('Formato de e-mail inválido.');
            } else {
                alert('Erro no cadastro: ' + error.message);
            }
        }
    });
}