import {
    auth,
    provider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from "./firebase-config.js";


// ---------- ELEMENTOS ----------
const loginSection = document.getElementById("login-section");
const criarSection = document.getElementById("criar-section");
const recuperarSection = document.getElementById("recuperar-section");

// Botões principais
const btnLoginEmail = document.getElementById("btn-login-email");
const btnGoogle = document.getElementById("btn-google-login");
const btnCriarConta = document.getElementById("btn-criar-conta");
const btnRecuperar = document.getElementById("btn-recuperar");

// Navegação entre telas
document.getElementById("link-criar-conta").onclick = () => {
    loginSection.classList.add("d-none");
    criarSection.classList.remove("d-none");
};

document.getElementById("link-recuperar").onclick = () => {
    loginSection.classList.add("d-none");
    recuperarSection.classList.remove("d-none");
};

document.getElementById("voltar-login1").onclick = () => {
    criarSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
};

document.getElementById("voltar-login2").onclick = () => {
    recuperarSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
};

// ---------- LOGIN COM EMAIL ----------
btnLoginEmail.addEventListener("click", async () => {
    const email = document.getElementById("email-login").value.trim();
    const senha = document.getElementById("senha-login").value;

    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "index.html";
    } catch (err) {
        alert("Erro ao entrar: " + traduzErro(err.code));
    }
});

// ---------- LOGIN GOOGLE ----------
btnGoogle.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
        window.location.href = "index.html";
    } catch (err) {
        alert("Erro ao entrar com Google: " + traduzErro(err.code));
    }
});

// ---------- CRIAR CONTA ----------
btnCriarConta.addEventListener("click", async () => {
    const email = document.getElementById("email-criar").value.trim();
    const senha = document.getElementById("senha-criar").value;

    try {
        await createUserWithEmailAndPassword(auth, email, senha);
        alert("Conta criada com sucesso!");

        criarSection.classList.add("d-none");
        loginSection.classList.remove("d-none");

    } catch (err) {
        alert("Erro ao criar conta: " + traduzErro(err.code));
    }
});

// ---------- RECUPERAR SENHA ----------
btnRecuperar.addEventListener("click", async () => {
    const email = document.getElementById("email-recuperar").value.trim();

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Email enviado para redefinir sua senha!");

        recuperarSection.classList.add("d-none");
        loginSection.classList.remove("d-none");

    } catch (err) {
        alert("Erro ao redefinir senha: " + traduzErro(err.code));
    }
});

// ---------- TRADUZIR ERROS ----------
function traduzErro(code) {
    const erros = {
        "auth/invalid-email": "Email inválido.",
        "auth/user-not-found": "Usuário não encontrado.",
        "auth/wrong-password": "Senha incorreta.",
        "auth/email-already-in-use": "Este email já está em uso.",
        "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
        "auth/popup-closed-by-user": "Você fechou a janela de login.",
        "auth/popup-blocked": "O navegador bloqueou o pop-up."
    };

    return erros[code] || "Ocorreu um erro inesperado.";
}
