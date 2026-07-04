// ==========================================
// 1. IMPORTAÇÕES E CONFIGURAÇÃO DO FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// Inicializa o Firebase e a Autenticação
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Variáveis de controle do usuário e carrinho
let usuarioAtual = null;
let carrinho = [];
const botaoSair = document.getElementById("botao-sair");

// ==========================================
// 2. CONTROLE DE AUTENTICAÇÃO E CARRINHO (UNIFICADO)
// ==========================================
const linkLogin = document.getElementById("link-login"); // Captura o link de Login

onAuthStateChanged(auth, (user) => {
    if (user) {
        usuarioAtual = user;
        carrinho = JSON.parse(localStorage.getItem(`carrinho-${usuarioAtual.uid}`)) || [];
        console.log(`Carrinho carregado para o usuário: ${usuarioAtual.email}`);
        
        // USUÁRIO LOGADO:
        if (botaoSair) botaoSair.style.display = "inline"; // Mostra o Sair
        if (linkLogin) linkLogin.style.display = "none";    // Esconde o Login
    } else {
        usuarioAtual = null;
        carrinho = [];
        
        // USUÁRIO DESLOGADO:
        if (botaoSair) botaoSair.style.display = "none";   // Esconde o Sair
        if (linkLogin) linkLogin.style.display = "inline";  // Mostra o Login
    }
});

// EVENTO DE LOGOUT: Quando clicar em Sair
if (botaoSair) {
    botaoSair.addEventListener("click", (event) => {
        event.preventDefault(); // Impede a página de pular pro topo pelo '#'
        
        signOut(auth).then(() => {
            alert("Desconectado com sucesso! Volte sempre. 👋");
            window.location.reload(); // Recarrega a página para limpar tudo na tela
        }).catch((error) => {
            console.error("Erro ao deslogar:", error);
        });
    });
}

// Vincula o evento apenas nos botões que adicionam ao carrinho
const botoesComprar = document.querySelectorAll("main button");
botoesComprar.forEach((botao) => {
    botao.addEventListener("click", (event) => {
        
        // 1. IGNORA se o botão for o "X" do modal
        if (event.target.closest("dialog")) {
            return; 
        }

        // 2. 🔥 NOVA TRAVA: IGNORA se for o botão "Comprar" (que só deve abrir o QR Code)
        if (event.target.innerText.trim().toLowerCase() === "comprar") {
            return; 
        }

        // Se passar das travas, significa que clicou no botão "Carrinho"!
        if (!usuarioAtual) {
            alert("🔒 Ops! Você precisa estar cadastrado e logado para adicionar itens ao carrinho.");
            window.location.href = "login.html";
            return;
        }

        const cardLivro = event.target.parentElement;
        const titulo = cardLivro.querySelector("h3").innerText;
        const imagem = cardLivro.querySelector("img").src;

        const livroSelecionado = {
            titulo: titulo,
            imagem: imagem,
            quantidade: 1
        };
        
        adicionarAoCarrinho(livroSelecionado);
    });
});

function adicionarAoCarrinho(livroNovo) {
    const livroExistente = carrinho.find(item => item.titulo === livroNovo.titulo);

    if (livroExistente) {
        livroExistente.quantidade += 1;
    } else {
        carrinho.push(livroNovo);
    }

    localStorage.setItem(`carrinho-${usuarioAtual.uid}`, JSON.stringify(carrinho));
    alert(`📚 "${livroNovo.titulo}" foi adicionado ao seu carrinho!`);
}

// ==========================================
// 3. FUNCIONAMENTO DA BARRA DE PESQUISA
// ==========================================
const pesquisa = document.getElementById("input-pesquisa");

if (pesquisa) {
    pesquisa.addEventListener("input", () => {
        const termo = pesquisa.value.toLowerCase().trim();
        
        // Seleciona todas as seções principais dentro do main
        const secoes = document.querySelectorAll("main section");

        secoes.forEach(secao => {
            const classeSecao = secao.className.toLowerCase();
            
            // Se a barra estiver vazia, mostra todas as seções normalmente
            if (termo === "") {
                secao.style.display = "";
                
                // Garante que todos os livros dentro dela voltem a aparecer
                const livros = secao.querySelectorAll('[class^="romance-"], [class^="terror-"], [class^="fantasia-"], [class^="lgbt-"]');
                livros.forEach(livro => livro.style.display = "");
                return;
            }

            // Se o que foi digitado for IGUAL ao nome da classe da seção (ex: "romance", "terror")
            if (classeSecao === termo) {
                secao.style.display = ""; // Mostra a seção inteira
                
                // Garante que todos os cards de livros dentro dela fiquem visíveis
                const livros = secao.querySelectorAll('[class^="romance-"], [class^="terror-"], [class^="fantasia-"], [class^="lgbt-"]');
                livros.forEach(livro => livro.style.display = "");
            } else {
                // Se não for o gênero digitado, esconde a seção inteira
                secao.style.display = "none";
            }
        });
    });
}
// ==========================================
// 4. FUNCIONAMENTO DOS BOTÕES DE FILTRO
// ==========================================
const conteudo = document.querySelectorAll("main section");
const botoes = document.querySelectorAll('.barra-pesquisa button');

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        const categorySelected = botao.id;

        if (categorySelected === "todos") {
            conteudo.forEach(secao => secao.style.display = 'block');
            return;
        }

        conteudo.forEach(secao => {
            const classeSecao = secao.className;
            
            if (categorySelected === 'horror' && classeSecao === 'terror') {
                secao.style.display = 'block';
            } else if (classeSecao === categorySelected) {
                secao.style.display = 'block';
            } else {
                secao.style.display = 'none';
            }
        });
    });
});

// ==========================================
// 5. TROCA DE IMAGEM NO HEADER (CARROSSEL)
// ==========================================
let passo = 0;

function mudar() {
    var imagem = document.getElementById("imagem");
    if (!imagem) return;

    if (passo == 0) {
        imagem.src = "produtos img/banner 2.png";
        passo = 1;
    } else if (passo == 1) {
        imagem.src = "produtos img/banner 1.png";
        passo = 0;
    }
}

function voltar() {
    var imagem = document.getElementById("imagem");
    if (!imagem) return;

    if (passo == 1) {
        imagem.src = "produtos img/banner 1.png";
        passo = 0;
    } else if (passo == 0) {
        imagem.src = "produtos img/banner 2.png";
        passo = 1;
    }
}

// Expõe as funções para os botões HTML (onclick)
window.mudar = mudar;
window.voltar = voltar;

// ==========================================
// 6. CONTROLE DO MODAL DE COMPRA
// ==========================================
const modal = document.getElementById("modal-qrcode");

function abrir(){
    // Só abre se o usuário estiver logado
    if (!usuarioAtual) {
        alert("🔒 Ops! Você precisa estar logado para ver o QR Code de compra.");
        window.location.href = "login.html";
        return;
    }
    if (modal) modal.showModal();
}

function fechar(){
    if (modal) modal.close();
}

// Expõe para o HTML (onclick)
window.abrir = abrir;
window.fechar = fechar;