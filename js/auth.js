// Este evento garante que o script só rode após o HTML carregar
document.addEventListener("DOMContentLoaded", () => {
    
    // =================================================================
    // INICIALIZAÇÃO E REFERÊNCIAS
    // =================================================================
    const auth = firebase.auth();

    // Referências dos Formulários
    const formLogin = document.getElementById("form-login");
    const formCadastro = document.getElementById("form-cadastro");
    const formEsqueciSenha = document.getElementById("form-esqueci-senha");

    // Referências dos Links/Botões de navegação
    const linkCadastro = document.getElementById("link-cadastro");
    const linkEsqueciSenha = document.getElementById("link-esqueci-senha");
    const linkLoginCadastro = document.getElementById("link-login-cadastro");
    const linkLoginEsqueci = document.getElementById("link-login-esqueci");

    // Botões de ação
    const btnGoogleLogin = document.getElementById("btn-google-login");
    const btnLogout = document.getElementById("btn-logout"); // (Este botão está na navbar)

    // Divisor "ou" e botão Google (para esconder na tela de "esqueci senha")
    const divisorOu = document.getElementById("divisor-ou");
    
    // =================================================================
    // 1. PERSISTÊNCIA (MANTER LOGADO) E REDIRECIONAMENTO
    // =================================================================
    auth.onAuthStateChanged((user) => {
        const path = window.location.pathname.split("/").pop();

        if (user) {
            console.log("Usuário logado:", user.uid);
            if (path === "index.html" || path === "") {
                window.location.href = "clientes.html";
            }
        } else {
            console.log("Nenhum usuário logado.");
            if (path !== "index.html" && path !== "") {
                window.location.href = "index.html";
            }
        }
    });

    // =================================================================
    // 2. NAVEGAÇÃO ENTRE FORMULÁRIOS (Login, Cadastro, Esqueci)
    // =================================================================

    function mostrarForm(formParaMostrar) {
        formLogin.classList.add("d-none");
        formCadastro.classList.add("d-none");
        formEsqueciSenha.classList.add("d-none");

        // Oculta/Mostra o botão Google
        if (formParaMostrar === formEsqueciSenha) {
            btnGoogleLogin.classList.add("d-none");
            divisorOu.classList.add("d-none");
        } else {
            btnGoogleLogin.classList.remove("d-none");
            divisorOu.classList.remove("d-none");
        }

        formParaMostrar.classList.remove("d-none");
    }

    if (linkCadastro) {
        linkCadastro.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarForm(formCadastro);
        });
    }

    if (linkEsqueciSenha) {
        linkEsqueciSenha.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarForm(formEsqueciSenha);
        });
    }

    if (linkLoginCadastro) {
        linkLoginCadastro.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarForm(formLogin);
        });
    }

    if (linkLoginEsqueci) {
        linkLoginEsqueci.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarForm(formLogin);
        });
    }

    // =================================================================
    // 3. FUNÇÕES DE AUTENTICAÇÃO
    // =================================================================

    // --- LOGIN COM E-MAIL E SENHA ---
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const senha = document.getElementById("login-senha").value;

            auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    return auth.signInWithEmailAndPassword(email, senha);
                })
                .then((userCredential) => {
                    // Sucesso. O onAuthStateChanged vai redirecionar.
                    console.log("Login com email/senha bem-sucedido.");
                })
                .catch((error) => {
                    console.error("Erro no login:", error);
                    alert("Erro: " + error.message);
                });
        });
    }

    // --- CADASTRO COM E-MAIL E SENHA ---
    if (formCadastro) {
        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("cadastro-email").value;
            const senha = document.getElementById("cadastro-senha").value;
            const confirmaSenha = document.getElementById("cadastro-confirma-senha").value;

            if (senha !== confirmaSenha) {
                alert("As senhas não conferem.");
                return;
            }
            if (senha.length < 6) {
                alert("A senha deve ter no mínimo 6 caracteres.");
                return;
            }

            auth.createUserWithEmailAndPassword(email, senha)
                .then((userCredential) => {
                    // Sucesso. O onAuthStateChanged vai redirecionar.
                    console.log("Conta criada com sucesso.");
                })
                .catch((error) => {
                    console.error("Erro ao criar conta:", error);
                    alert("Erro: " + error.message);
                });
        });
    }

    // --- ESQUECI MINHA SENHA ---
    if (formEsqueciSenha) {
        formEsqueciSenha.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("esqueci-email").value;

            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert("E-mail de redefinição enviado com sucesso! Verifique sua caixa de entrada.");
                    mostrarForm(formLogin); // Volta para o login
                })
                .catch((error) => {
                    console.error("Erro ao enviar e-mail de redefinição:", error);
                    alert("Erro: " + error.message);
                });
        });
    }

    // --- LOGIN COM GOOGLE ---
    if (btnGoogleLogin) {
        btnGoogleLogin.addEventListener("click", () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            auth.signInWithPopup(provider)
                .then((result) => {
                    // Sucesso. O onAuthStateChanged vai redirecionar.
                    console.log("Login com Google bem-sucedido.");
                })
                .catch((error) => {
                    console.error("Erro no login com Google:", error);
                    alert("Erro ao logar com Google: " + error.message);
                });
        });
    }

    // --- LOGOUT ---
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            console.log("Fazendo logout...");
            auth.signOut()
                .then(() => {
                    // O onAuthStateChanged vai detectar e redirecionar.
                    console.log("Logout bem-sucedido.");
                })
                .catch((error) => {
                    console.error("Erro ao fazer logout:", error);
                });
        });
    }

});

