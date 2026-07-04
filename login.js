import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// 🔴 CORREÇÃO: Importando o signInWithEmailAndPassword que estava faltando
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// 🔴 CORREÇÃO: Nome diferente para evitar o conflito de duplicidade
const formularioLogin = document.getElementById("formulario-login");

formularioLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailLogin = document.getElementById("email-login").value;
    const senhaLogin = document.getElementById("senha-login").value;

    try {
        const usuarioLogado = await signInWithEmailAndPassword(auth, emailLogin, senhaLogin);
        console.log("Usuário logado com sucesso:", usuarioLogado.user);
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
    } 
    catch (error) {
        console.error("Erro ao fazer login:", error);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            alert('E-mail ou senha incorretos. Verifique os dados.');
        } else {
            alert('Erro ao entrar: ' + error.message);
        }
    }
});