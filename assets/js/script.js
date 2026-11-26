// 🚨 Função Auto-Invocada (IIFE)
(function () {
    // ==========================================
    // AUDIO ENGINE - SONS SUAVES E MODERNOS (CORRIGIDO)
    // ==========================================
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    // ==========================================
    // ESTADOS GLOBAIS E CONFIGURAÇÕES SALVAS (LocalStorage)
    // ==========================================
    const CONFIG_KEY = "lstechinfo_infosec_config";
    let config = { sound: true, effects: false, theme: 'dark' };

    try {
        const savedConfig = localStorage.getItem(CONFIG_KEY);
        if (savedConfig) config = JSON.parse(savedConfig);
    } catch (e) { console.warn("Aviso: LocalStorage indisponível.", e); }

    let isSoundEnabled = config.sound;
    let isEffectsEnabled = config.effects;

    if (config.theme === 'light') {
        document.body.removeAttribute("data-theme");
        document.getElementById("theme-toggle").querySelector('.icon').textContent = "🌙";
    }

    if (!isEffectsEnabled) {
        document.body.classList.add("no-effects");
        document.getElementById("effects-toggle").classList.add("muted");
    } else {
        document.body.classList.remove("no-effects");
        document.getElementById("effects-toggle").classList.remove("muted");
    }

    if (!isSoundEnabled) {
        document.getElementById("sound-toggle").classList.add("muted");
    }

    function saveConfig() {
        try {
            config.sound = isSoundEnabled;
            config.effects = isEffectsEnabled;
            config.theme = document.body.hasAttribute("data-theme") ? 'dark' : 'light';
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (e) { }
    }

    // ==========================================
    // SISTEMA DE TOAST E MODAL (CRIADOR)
    // ==========================================
    const toastContainer = document.getElementById("toast-container");
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = `>_ ${message}`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("hide");
            toast.addEventListener("animationend", () => toast.remove());
        }, 2500);
    }

    const aboutBtn = document.getElementById("about-creator-btn");
    const creatorModal = document.getElementById("creator-modal");
    const closeModalBtn = document.getElementById("close-creator-modal");

    if (aboutBtn && creatorModal && closeModalBtn) {
        aboutBtn.addEventListener("click", () => {
            playSound('pop');
            creatorModal.classList.add("active");
            if (headerActions.classList.contains("open")) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });

        closeModalBtn.addEventListener("click", () => {
            playSound('pop');
            creatorModal.classList.remove("active");
        });

        creatorModal.addEventListener("click", (e) => {
            if (e.target === creatorModal) {
                playSound('pop');
                creatorModal.classList.remove("active");
            }
        });
    }

    // ==========================================
    // MENU HAMBÚRGUER (MOBILE)
    // ==========================================
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const headerActions = document.getElementById("header-actions");

    if (mobileMenuBtn && headerActions) {
        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = headerActions.classList.contains("open");
            if (isOpen) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            } else {
                headerActions.classList.add("open");
                mobileMenuBtn.setAttribute("aria-expanded", "true");
            }
            playSound('pop');
        });

        document.addEventListener("click", (e) => {
            if (headerActions.classList.contains("open") && !headerActions.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ==========================================
    // CONTROLES DE INTERFACE E AUDIO (SUAVE)
    // ==========================================
    function playSound(type) {
        if (!isSoundEnabled) return;
        initAudio();
        const now = audioCtx.currentTime;

        if (type === 'pop') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'correct') {
            [800, 1200].forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'triangle';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, now + i * 0.1);
                g.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.02);
                g.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.15);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.15);
            });
        } else if (type === 'wrong') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'victory') {
            [440, 554, 659, 880].forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'sine';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, now + i * 0.1);
                g.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.03);
                g.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.3);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.3);
            });
        }
    }

    const soundToggleBtn = document.getElementById("sound-toggle");
    const effectsToggleBtn = document.getElementById("effects-toggle");
    const themeToggleBtn = document.getElementById("theme-toggle");

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            isSoundEnabled = !isSoundEnabled;
            if (isSoundEnabled) {
                soundToggleBtn.classList.remove("muted");
                showToast("Áudio: ONLINE");
                playSound('pop');
            } else {
                soundToggleBtn.classList.add("muted");
                showToast("Áudio: OFFLINE");
            }
            saveConfig();
        });
    }

    if (effectsToggleBtn) {
        effectsToggleBtn.addEventListener("click", () => {
            isEffectsEnabled = !isEffectsEnabled;
            if (isEffectsEnabled) {
                effectsToggleBtn.classList.remove("muted");
                document.body.classList.remove("no-effects");
                showToast("Efeitos Visuais: ONLINE");
                playSound('pop');
            } else {
                effectsToggleBtn.classList.add("muted");
                document.body.classList.add("no-effects");
                showToast("Efeitos Visuais: OFFLINE");
                playSound('pop');
            }
            saveConfig();
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            playSound('pop');
            const icon = themeToggleBtn.querySelector('.icon') || themeToggleBtn;
            icon.classList.add("spin-icon");
            setTimeout(() => icon.classList.remove("spin-icon"), 400);

            if (document.body.hasAttribute("data-theme")) {
                document.body.removeAttribute("data-theme");
                setTimeout(() => icon.textContent = "🌙", 150);
                showToast("Modo Claro Ativado");
            } else {
                document.body.setAttribute("data-theme", "dark");
                setTimeout(() => icon.textContent = "☀️", 150);
                showToast("Modo Escuro Ativado");
            }
            saveConfig();
        });
    }

    // ==========================================
    // DETECÇÃO INTELIGENTE DE TECLADO FÍSICO
    // ==========================================
    window.addEventListener('keydown', function detectKeyboard(e) {
        if (e.key !== 'Unidentified' && !document.body.classList.contains('keyboard-active')) {
            document.body.classList.add('keyboard-active');
            window.removeEventListener('keydown', detectKeyboard);
        }
    });

    // ==========================================
    // SISTEMA ANTI-CHEAT (REFINADO)
    // ==========================================
    document.addEventListener('contextmenu', event => event.preventDefault());

    document.addEventListener('copy', event => {
        event.preventDefault();
        showToast("ACESSO NEGADO: Cópia restrita.");
    });
    document.addEventListener('cut', event => event.preventDefault());
    document.addEventListener('paste', event => event.preventDefault());
    document.addEventListener('dragstart', event => event.preventDefault());

    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
            (e.ctrlKey && (e.key === 'S' || e.key === 's')) ||
            (e.ctrlKey && (e.key === 'P' || e.key === 'p'))
        ) {
            e.preventDefault();
        }
    });

    // ==========================================
    // BANCO DE QUESTÕES - PARADIGMAS PYTHON
    // ==========================================
  const questions = [
        {
            question: "1. Python é considerada uma linguagem multiparadigma. O que essa característica significa?",
            options: [
                "Python precisa ser convertida obrigatoriamente para linguagem Assembly antes da execução.",
                "Python permite utilizar diferentes paradigmas de programação, como estruturado, orientado a objetos e funcional.",
                "Python não permite combinar diferentes formas de organização do código.",
                "Python somente permite o desenvolvimento utilizando programação orientada a objetos.",
                "Python executa exclusivamente programas desenvolvidos segundo o paradigma funcional."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE FUNDAMENTOS]</b> A alternativa correta é a <b>B</b>. Python é classificada como multiparadigma porque permite desenvolver soluções utilizando diferentes formas de organização da programação, incluindo programação estruturada, orientação a objetos e recursos associados ao paradigma funcional."
        },
        {
            question: "2. Considere a seguinte expressão:\n\n(True + 2) ** 2\n\nUtilizando Python para avaliar a expressão, é correto afirmar que:",
            options: [
                "A expressão vale 6.",
                "A expressão vale True.",
                "Não será possível efetuar a operação em virtude da incompatibilidade de tipos.",
                "A expressão vale 9.",
                "A expressão vale 1."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE OPERADORES]</b> A alternativa correta é a <b>D</b>. Em Python, em contexto numérico, `True` corresponde ao valor inteiro 1. Assim, `True + 2` resulta em 3. Em seguida, o operador `**` realiza a potenciação: 3² = 9."
        },
        {
            question: "3. Considere o código:\n\nidade = 17\nif idade >= 18:\n    print(\"Maior de idade\")\nelse:\n    print(\"Menor de idade\")\n\nQual será a saída apresentada?",
            options: [
                "Maior de idade",
                "17",
                "Menor de idade",
                "True",
                "O programa apresentará erro."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE CONDICIONAIS]</b> A alternativa correta é a <b>C</b>. A condição `idade >= 18` verifica se 17 é maior ou igual a 18. Como a expressão resulta em `False`, o bloco `else` será executado, apresentando 'Menor de idade'."
        },
        {
            question: "4. Como se chama a seguinte característica de uma linguagem de programação: \"um conjunto relativamente pequeno de construções primitivas pode ser combinado em um número, também, pequeno de maneiras para construir as estruturas de controle e de dados de uma linguagem de programação\"?",
            options: [
                "Confiabilidade.",
                "Recursividade.",
                "Expressividade.",
                "Ortogonalidade.",
                "Aliasing."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE FUNDAMENTOS]</b> A alternativa correta é a <b>D</b>. A característica descrita no enunciado corresponde à ortogonalidade, que está relacionada à possibilidade de combinar um conjunto relativamente pequeno de construções primitivas de maneiras consistentes para formar estruturas mais complexas."
        },
        {
            question: "5. Observe o código:\n\nfor numero in range(2, 11, 2):\n    print(numero)\n\nQual sequência será apresentada?",
            options: [
                "2, 4, 6, 8, 10",
                "2, 4, 6, 8",
                "1, 3, 5, 7, 9",
                "0, 2, 4, 6, 8, 10",
                "2, 3, 4, 5, 6, 7, 8, 9, 10"
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE LAÇOS]</b> A alternativa correta é a <b>A</b>. `range(2, 11, 2)` começa em 2, avança de 2 em 2 e termina antes de 11. Os valores gerados são 2, 4, 6, 8 e 10."
        },
        {
            question: "6. Analise o trecho de código, em Python 3, a seguir:\n\ndef fc(x, y):\n    s = 0\n    a = x.lower()\n    for i in a:\n        if (i == y):\n            s = s + 1\n    return s\n\na = 'Aracaju/Sergipe'\nx = fc(a, 'a') * 100\ny = fc(a, 'e') * 10\nz = fc(a, 'i')\nprint(x + y + z)\n\nO valor impresso pela função print, na última linha do trecho de código, é: (dica: a função lower retorna todas as letras de uma string em minúsculo)",
            options: [
                "132",
                "321",
                "111",
                "333",
                "123"
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE FUNÇÕES]</b> A alternativa correta é a <b>B</b>. Após `lower()`, a função conta as ocorrências das letras solicitadas. Há 3 ocorrências de 'a' (3 × 100 = 300), 2 ocorrências de 'e' (2 × 10 = 20) e 1 ocorrência de 'i' (1). Assim, 300 + 20 + 1 = 321."
        },
        {
            question: "7. Considere o código:\n\ncontador = 1\nwhile contador <= 4:\n    print(contador)\n    contador += 1\n\nQual será a saída?",
            options: [
                "0, 1, 2, 3",
                "1, 2, 3",
                "1, 2, 3, 4, 5",
                "1, 2, 3, 4",
                "O laço será infinito."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE LAÇOS]</b> A alternativa correta é a <b>D</b>. O contador começa em 1 e o `while` continua enquanto seu valor for menor ou igual a 4. Ao final de cada repetição, o contador aumenta uma unidade, imprimindo 1, 2, 3 e 4. Quando passa para 5, a condição se torna falsa."
        },
        {
            question: "8. A popularidade do Python se deve em grande parte à sua simplicidade. A sintaxe da linguagem é limpa e intuitiva, o que a torna fácil de aprender mesmo para iniciantes. Qual é a definição de um arquivo de script em Python?",
            options: [
                "É um arquivo de texto que contém sequências de erros para log.",
                "Uma inteligência artificial.",
                "É uma mensagem de erro gerada pelo compilador.",
                "É um arquivo de texto que contém instruções que compõem um programa Python.",
                "É uma mensagem de erro gerada pelos programadores."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE FUNDAMENTOS]</b> A alternativa correta é a <b>D</b>. Um script Python é um arquivo de texto contendo instruções escritas na linguagem Python que formam um programa ou parte dele."
        },
        {
            question: "9. Analise o código:\n\nnumero = 7\nif numero % 2 == 0:\n    print(\"Par\")\nelse:\n    print(\"Ímpar\")\n\nQual será a saída?",
            options: [
                "Par",
                "0",
                "Ímpar",
                "1",
                "False"
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE CONDICIONAIS]</b> A alternativa correta é a <b>C</b>. O operador `%` calcula o resto da divisão. Como 7 ÷ 2 possui resto 1, `7 % 2 == 0` é falso. Consequentemente, o `else` é executado e apresenta 'Ímpar'."
        },
        {
            question: "10. Uma das características mais importantes do Python é a sua comunidade ativa e vibrante. Existem muitas comunidades online dedicadas ao Python, que oferecem suporte e recursos para desenvolvedores de todos os níveis. Como um desenvolvedor Python pode comentar um código para facilitar futuras análises?",
            options: [
                "Usando &",
                "Usando #",
                "Usando !",
                "Usando $",
                "Usando %"
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE SINTAXE]</b> A alternativa correta é a <b>B</b>. Em Python, o caractere `#` inicia um comentário de uma linha. O interpretador desconsidera o conteúdo localizado depois desse símbolo naquela linha."
        },
        {
            question: "11. Observe:\n\ndef dobro(numero):\n    return numero * 2\n\nresultado = dobro(7)\nprint(resultado)\n\nQual valor será apresentado?",
            options: [
                "7",
                "9",
                "14",
                "49",
                "2"
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE FUNÇÕES]</b> A alternativa correta é a <b>C</b>. A função `dobro()` recebe o valor 7 e retorna `7 * 2`, resultando em 14. Esse valor é armazenado em `resultado` e apresentado pelo `print()`."
        },
        {
            question: "12. Dadas as afirmativas acerca das linguagens de programação Java, C++ e Python:\n\nI - Das três linguagens consideradas, apenas Python não possui suporte nativo a interfaces com sintaxe explícita como em Java e C++, embora permita a criação de interfaces por meio de classes abstratas.\nII - O Python possui nativamente o tipo privado, assim como C e Ruby.\nIII - Na linguagem Python, o decorator @staticmethods somente pode ser utilizado para qualificar métodos, não podendo ser utilizado para qualificar atributos.\n\nVerifica-se que está(ão) correta(s):",
            options: [
                "II e III, apenas.",
                "I e II, apenas.",
                "I, II e III.",
                "II, apenas.",
                "I e III, apenas."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>E</b>. A afirmativa I está correta no contexto apresentado, pois Python não utiliza a mesma sintaxe explícita de interfaces encontrada em linguagens como Java. A afirmativa II está incorreta. A afirmativa III está correta quanto à aplicação do decorator descrito a métodos."
        },
        {
            question: "13. Considere:\n\ntry:\n    resultado = 10 / 0\nexcept ZeroDivisionError:\n    print(\"Não é possível dividir por zero.\")\n\nQual é a finalidade do bloco 'except'?",
            options: [
                "Repetir a divisão até funcionar.",
                "Impedir que qualquer código Python seja executado.",
                "Tratar a exceção provocada pela divisão por zero.",
                "Converter automaticamente zero em um.",
                "Encerrar o interpretador Python."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE EXCEÇÕES]</b> A alternativa correta é a <b>C</b>. A operação `10 / 0` gera uma exceção `ZeroDivisionError`. O bloco `except ZeroDivisionError` captura especificamente esse tipo de problema e executa uma resposta controlada, evitando uma interrupção não tratada do programa."
        },
        {
            question: "14. (FGV/2018) Considere a seguinte definição da função f, declarada na sintaxe Python:\n\ndef f(n):\n    if n < 3:\n        return n - 1\n    else:\n        return f(n - 2) + f(n - 1)\n\nprint(f(10))\n\nAssinale o valor produzido pela execução do código acima.",
            options: [
                "21",
                "55",
                "13",
                "34",
                "17"
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE RECURSIVIDADE]</b> A alternativa correta é a <b>D</b>. A função é recursiva: para valores menores que 3, retorna `n - 1`; para os demais, calcula `f(n - 2) + f(n - 1)`. A sequência obtida é f(2)=1, f(3)=1, f(4)=2, f(5)=3, f(6)=5, f(7)=8, f(8)=13, f(9)=21 e f(10)=34."
        },
        {
            question: "15. Considere:\n\nimport math\nnumero = 81\nresultado = math.sqrt(numero)\nprint(resultado)\n\nQual será o resultado?",
            options: [
                "8.0",
                "9.0",
                "81.0",
                "40.5",
                "O programa apresentará erro."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE BIBLIOTECAS]</b> A alternativa correta é a <b>B</b>. `math.sqrt()` calcula a raiz quadrada do número recebido. Como √81 = 9, a função retorna `9.0`."
        },
        {
            question: "16. Os paradigmas de programação fornecem diferentes formas de estruturar a solução de problemas computacionais. Sobre o paradigma imperativo, assinale a alternativa correta.",
            options: [
                "É utilizado exclusivamente por linguagens de baixo nível.",
                "Não permite a utilização de funções ou subprogramas.",
                "Organiza a solução por meio de comandos que modificam o estado do programa ao longo da execução.",
                "Descreve apenas o resultado desejado, sem representar operações que modificam o estado do programa.",
                "Proíbe a utilização de variáveis e estruturas de repetição."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE PARADIGMAS]</b> A alternativa correta é a <b>C</b>. O paradigma imperativo descreve uma sequência de comandos que podem modificar o estado do programa durante sua execução. Variáveis, atribuições, decisões e repetições são recursos característicos dessa abordagem."
        },
        {
            question: "17. Considere:\n\nimport random\nnumero = random.randint(1, 10)\n\nO que a instrução random.randint(1, 10) faz?",
            options: [
                "Gera somente números pares entre 1 e 10.",
                "Gera um número inteiro aleatório entre 1 e 10, incluindo os limites.",
                "Gera obrigatoriamente o número 10.",
                "Gera um número decimal entre 1 e 10.",
                "Cria uma lista contendo os números de 1 a 10."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE BIBLIOTECAS]</b> A alternativa correta é a <b>B</b>. `randint(1, 10)` seleciona um número inteiro pseudoaleatório no intervalo informado, podendo retornar tanto 1 quanto 10."
        },
        {
            question: "18. Considere o código Python:\n\nnota1 = 8.0\nnota2 = 6.0\nmedia = (nota1 + nota2) / 2\nprint(f\"Média: {media:.2f}\")\n\nQual será a saída apresentada?",
            options: [
                "Média: 7",
                "Média: 14.00",
                "Média: 6.00",
                "Média: 7.00",
                "Média: 8.00"
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE FORMATAÇÃO]</b> A alternativa correta é a <b>D</b>. A média é calculada por (8.0 + 6.0) / 2 = 14 / 2 = 7.0. A formatação `.2f` determina duas casas decimais, produzindo 'Média: 7.00'."
        },
        {
            question: "19. Observe:\n\nimport time\nfor numero in range(3, 0, -1):\n    print(numero)\n    time.sleep(1)\n\nDesconsiderando o tempo de espera, qual sequência será apresentada?",
            options: [
                "1, 2, 3",
                "3, 2, 1",
                "3, 2, 1, 0",
                "0, 1, 2, 3",
                "3, 3, 3"
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE LAÇOS]</b> A alternativa correta é a <b>B</b>. `range(3, 0, -1)` começa em 3, reduz uma unidade a cada repetição e termina antes de chegar a 0. Assim, são produzidos 3, 2 e 1. `time.sleep(1)` apenas introduz uma pausa entre as execuções."
        },
        {
            question: "20. Observe o código:\n\nfor numero in range(1, 6):\n    print(numero)\n\nQual sequência será apresentada?",
            options: [
                "1, 6",
                "1, 2, 3, 4, 5, 6",
                "0, 1, 2, 3, 4",
                "1, 2, 3, 4, 5",
                "0, 1, 2, 3, 4, 5"
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE LAÇOS]</b> A alternativa correta é a <b>D</b>. `range(1, 6)` começa em 1 e produz valores até imediatamente antes de 6. Portanto, a sequência é 1, 2, 3, 4 e 5."
        },
        {
            question: "21. Considere:\n\ntry:\n    idade = int(input(\"Digite sua idade: \"))\nexcept ValueError:\n    print(\"Entrada inválida\")\nelse:\n    print(\"Entrada válida\")\nfinally:\n    print(\"Fim\")\n\nSe o usuário digitar 20, quais mensagens serão apresentadas depois da entrada?",
            options: [
                "Entrada inválida e Fim",
                "Apenas Entrada válida",
                "Entrada válida e Fim",
                "Apenas Fim",
                "O programa apresentará ValueError."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE EXCEÇÕES]</b> A alternativa correta é a <b>C</b>. `int(\"20\")` é uma conversão válida, portanto nenhuma exceção ocorre. O bloco `else` apresenta 'Entrada válida'. Independentemente do resultado, `finally` é executado e apresenta 'Fim'."
        },
        {
            question: "22. Analise:\n\nfor numero in range(1, 8):\n    if numero == 3:\n        continue\n    if numero == 6:\n        break\n    print(numero)\n\nQual será a saída?",
            options: [
                "1, 2, 4, 5, 7",
                "3, 6",
                "1, 2, 3, 4, 5",
                "1, 2, 4, 5",
                "1, 2, 3, 4, 5, 6, 7"
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE LAÇOS]</b> A alternativa correta é a <b>D</b>. Os valores 1 e 2 são impressos. Quando `numero` vale 3, `continue` pula o restante daquela iteração. 4 e 5 são impressos. Ao chegar a 6, `break` encerra o laço antes do `print()`. Portanto, a saída é 1, 2, 4, 5."
        },
        {
            question: "23. Considere:\n\nclass Aluno:\n    def __init__(self, nome):\n        self.nome = nome\n\naluno = Aluno(\"Carlos\")\nprint(aluno.nome)\n\nQual será a saída?",
            options: [
                "Aluno",
                "nome",
                "Carlos",
                "self",
                "O programa apresentará erro."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>C</b>. Ao criar `Aluno(\"Carlos\")`, o valor \"Carlos\" é recebido pelo parâmetro `nome` e atribuído a `self.nome`. O comando `print(aluno.nome)` acessa esse atributo e apresenta 'Carlos'."
        },
        {
            question: "24. Considere:\n\ndef calcular_media(n1, n2):\n    return (n1 + n2) / 2\n\nresultado = calcular_media(8, 6)\nprint(resultado)\n\nQual será o valor apresentado?",
            options: [
                "O programa não produzirá resultado porque uma função não pode retornar valores.",
                "7",
                "6",
                "14",
                "8"
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE FUNÇÕES]</b> A alternativa correta é a <b>B</b>. A função calcula (8 + 6) / 2 = 14 / 2 = 7. O comando `return` devolve esse resultado, que é armazenado em `resultado` e posteriormente apresentado."
        },
        {
            question: "25. Na Programação Orientada a Objetos, qual alternativa define corretamente uma classe?",
            options: [
                "É obrigatoriamente uma variável do tipo inteiro.",
                "É uma estrutura utilizada como modelo para criação de objetos.",
                "É um erro gerado durante a execução do programa.",
                "É exclusivamente uma função que não recebe parâmetros.",
                "É um laço utilizado para percorrer objetos."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>B</b>. Uma classe estabelece uma estrutura que pode definir atributos e métodos. A partir dela podem ser criados objetos, também chamados de instâncias."
        },
        {
            question: "26. Considere:\n\ntry:\n    numero = int(input(\"Digite um número: \"))\nexcept ValueError:\n    print(\"Valor inválido\")\nelse:\n    print(\"Valor aceito\")\n\nSe o usuário digitar Python, o que acontecerá?",
            options: [
                "O bloco else será executado antes do except.",
                "Será apresentada a mensagem 'Valor inválido'.",
                "O programa converterá automaticamente o texto para zero.",
                "O programa sempre será encerrado sem apresentar mensagens.",
                "Será apresentada a mensagem 'Valor aceito'."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE EXCEÇÕES]</b> A alternativa correta é a <b>B</b>. A tentativa de executar `int(\"Python\")` gera `ValueError`, pois o texto não representa um número inteiro válido. O `except ValueError` captura a exceção e apresenta 'Valor inválido'."
        },
        {
            question: "27. Observe:\n\nclass Televisao:\n    def __init__(self):\n        self.volume = 10\n\n    def aumentar_volume(self):\n        if self.volume < 100:\n            self.volume += 1\n\ntv = Televisao()\ntv.aumentar_volume()\ntv.aumentar_volume()\nprint(tv.volume)\n\nQual será o resultado?",
            options: [
                "10",
                "11",
                "12",
                "20",
                "100"
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>C</b>. O objeto começa com `volume = 10`. Cada chamada de `aumentar_volume()` soma uma unidade. Após a primeira chamada, o volume é 11; após a segunda, 12."
        },
        {
            question: "28. Considere:\n\nclass Televisao:\n    def __init__(self):\n        self.volume = 10\n\ntv1 = Televisao()\ntv2 = tv1\ntv2.volume = 50\nprint(tv1.volume)\n\nQual valor será apresentado?",
            options: [
                "10",
                "50",
                "60",
                "0",
                "O programa apresentará erro."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>B</b>. `tv2 = tv1` não cria uma nova televisão. As duas variáveis passam a referenciar o mesmo objeto. Portanto, quando `tv2.volume` é alterado para 50, `tv1.volume` também acessa esse mesmo valor."
        },
        {
            question: "29. Considere o código:\n\ndef saudacao(nome=\"Aluno\"):\n    return f\"Olá, {nome}!\"\n\nprint(saudacao())\n\nQual será a saída?",
            options: [
                "Olá, nome!",
                "Olá, Aluno!",
                "Aluno",
                "Olá!",
                "O programa apresentará erro porque nenhum argumento foi informado."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE FUNÇÕES]</b> A alternativa correta é a <b>B</b>. O parâmetro `nome` possui o valor padrão \"Aluno\". Como a função é chamada sem argumento, Python utiliza esse valor padrão, retornando 'Olá, Aluno!'."
        },
        {
            question: "30. Considere:\n\nclass Conta:\n    def __init__(self, titular, saldo):\n        self.titular = titular\n        self.saldo = saldo\n\n    def depositar(self, valor):\n        self.saldo += valor\n\nconta = Conta(\"Ana\", 500)\nconta.depositar(200)\nprint(conta.saldo)\n\nQual valor será apresentado?",
            options: [
                "200",
                "300",
                "500",
                "700",
                "1000"
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>D</b>. O objeto é criado com saldo inicial de 500. O método `depositar(200)` executa `self.saldo += valor`, resultando em 500 + 200 = 700."
        }
    ];

    
    const getAnswer = (q) => parseInt(atob(q._k));

    // ==========================================
    // VARIÁVEIS DE ESTADO E DOM PRINCIPAL
    // ==========================================
    const startScreen = document.getElementById("start-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");
    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const skipBtn = document.getElementById("skip-btn");
    const restartBtn = document.getElementById("restart-btn");
    const showReviewBtn = document.getElementById("show-review-btn");
    const shareBtn = document.getElementById("share-btn");
    const homeLink = document.getElementById("home-link");
    const questionAreaContainer = document.querySelector(".question-area");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const progressBar = document.getElementById("progress-bar");
    const questionTracker = document.getElementById("question-tracker");
    const quizActions = document.getElementById("quiz-actions");
    const explanationContainer = document.getElementById("explanation-container");
    const explanationText = document.getElementById("explanation-text");
    const scoreText = document.getElementById("score-text");
    const totalText = document.getElementById("total-text");
    const feedbackText = document.getElementById("feedback-text");
    const reviewContainer = document.getElementById("review-container");
    const reviewContent = document.getElementById("review-content");
    const historyContainer = document.getElementById("historico-container");
    const historyScoreText = document.getElementById("historico-acertos");
    const viewPastReviewBtn = document.getElementById("view-past-review-btn");
    const QUIZ_HISTORY_KEY = "lstechinfo_python_simulado";

    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let isReviewVisible = false;
    let timerInterval;
    let secondsElapsed = 0;
    let isTransitioning = false;

    const iconCheck = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const iconX = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const iconArrow = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

    // ==========================================
    // LÓGICA DO QUIZ E TRANSIÇÕES SEGURAS
    // ==========================================
    function startTimer() {
        secondsElapsed = 0;
        const timerElement = document.getElementById('quiz-timer');
        if (timerElement) timerElement.textContent = "00:00";
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            if (timerElement) {
                const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
                const s = (secondsElapsed % 60).toString().padStart(2, '0');
                timerElement.textContent = `${m}:${s}`;
            }
        }, 1000);
    }
    function stopTimer() { clearInterval(timerInterval); }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') return;

        if (quizScreen.classList.contains('active')) {
            const key = e.key.toLowerCase();
            const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 };

            if (!quizActions.classList.contains('is-answered')) {
                if (keyMap[key] !== undefined && optionsContainer.children[keyMap[key]]) {
                    e.preventDefault();
                    initAudio();
                    optionsContainer.children[keyMap[key]].click();
                    return;
                }
                if (key === 's') {
                    e.preventDefault();
                    initAudio();
                    skipBtn.click();
                    return;
                }
            } else if (e.code === 'Enter' || e.code === 'ArrowRight') {
                e.preventDefault();
                initAudio();
                if (!nextBtn.classList.contains("hidden-btn")) {
                    nextBtn.click();
                }
                return;
            }
        } else if (startScreen.classList.contains('active') && e.code === 'Enter') {
            e.preventDefault();
            initAudio();
            startBtn.click();
        }
    });

    startBtn.addEventListener("click", () => { playSound('pop'); startQuiz(); });
    nextBtn.addEventListener("click", () => { playSound('pop'); loadNextQuestion(); });
    skipBtn.addEventListener("click", () => { playSound('pop'); skipQuestion(); });
    restartBtn.addEventListener("click", () => { playSound('pop'); resetQuiz(); });
    showReviewBtn.addEventListener("click", () => { playSound('pop'); toggleReview(); });
    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            playSound('pop');
            exportReport();
        });
    }
    if (viewPastReviewBtn) {
        viewPastReviewBtn.addEventListener("click", () => {
            playSound('pop');
            openStoredReview();
        });
    }
    homeLink.addEventListener("click", () => window.location.reload());

    renderHistoryCard();

    function scrambleText(element, newText) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iterations = 0;
        const step = Math.max(1, Math.floor(newText.length / 20));

        const interval = setInterval(() => {
            element.innerText = newText.split('').map((letter, index) => {
                if (index < iterations) return newText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');

            if (iterations >= newText.length) {
                element.innerText = newText;
                clearInterval(interval);
            }
            iterations += step;
        }, 30);
    }

    function startQuiz() {
        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("hidden", "active");
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = Array(questions.length).fill(null);
        isTransitioning = false;
        isReviewVisible = false;
        updateScoreUI(0, questions.length);
        progressBar.style.background = `linear-gradient(90deg, var(--primary), var(--accent))`;
        progressBar.style.boxShadow = `0 0 10px var(--primary-glow)`;
        scoreText.classList.remove("pop-success");
        reviewContainer.classList.add("hidden");
        showReviewBtn.textContent = "Ver logs detalhados";
        startTimer();
        renderQuestion();
    }

    function renderQuestion() {
        isTransitioning = false;
        questionAreaContainer.classList.remove("slide-out-left");
        questionAreaContainer.classList.add("slide-in-right");
        quizActions.classList.remove("is-answered");

        nextBtn.classList.add("hidden-btn");
        skipBtn.classList.remove("hidden-btn");

        nextBtn.disabled = false;
        skipBtn.disabled = false;

        explanationContainer.classList.add("hidden");
        explanationContainer.style.display = "none";
        explanationText.innerHTML = "";

        optionsContainer.innerHTML = "";

        const stamp = document.getElementById("access-stamp");
        if (stamp) {
            stamp.classList.remove("show-granted", "show-denied");
            stamp.classList.add("hidden");
        }

        const currentQuestion = questions[currentQuestionIndex];

        if (isEffectsEnabled) {
            scrambleText(questionText, currentQuestion.question);
        } else {
            questionText.innerText = currentQuestion.question;
        }

        questionTracker.textContent = `Varredura de Nó ${currentQuestionIndex + 1} de ${questions.length}`;
        progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement("button");

            button.setAttribute("role", "radio");
            button.setAttribute("aria-checked", "false");
            button.setAttribute("aria-label", `Opção ${String.fromCharCode(65 + index)}: ${option}`);

            button.innerHTML = `<strong class="opt-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</strong> <span>${option}</span>`;
            button.classList.add("option-btn");

            if (isEffectsEnabled) {
                button.style.opacity = "0";
                button.style.transform = "translateY(10px)";
                button.style.animation = `fadeIn 0.3s ease ${index * 0.08}s forwards`;
            } else {
                button.style.opacity = "1";
                button.style.transform = "none";
                button.style.animation = "none";
            }

            button.addEventListener("click", () => { playSound('pop'); selectAnswer(button, index); });
            optionsContainer.appendChild(button);
        });
    }

    function selectAnswer(selectedButton, selectedIndex) {
        if (isTransitioning || quizActions.classList.contains("is-answered")) return;
        quizActions.classList.add("is-answered");

        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const correctIndex = getAnswer(currentQuestion);
        const isCorrect = selectedIndex === correctIndex;
        userAnswers[currentQuestionIndex] = selectedIndex;

        explanationText.innerHTML = currentQuestion.explanation;
        explanationContainer.classList.remove("hidden");
        explanationContainer.style.display = "block";

        Array.from(optionsContainer.children).forEach((btn) => {
            btn.disabled = true;
            btn.setAttribute("aria-disabled", "true");
        });
        selectedButton.setAttribute("aria-checked", "true");

        const stamp = document.getElementById("access-stamp");

        if (isCorrect) {
            playSound('correct');
            selectedButton.classList.add("correct");
            if (stamp && isEffectsEnabled) {
                stamp.textContent = "ACESSO CONCEDIDO";
                stamp.classList.remove("hidden");
                stamp.classList.add("show-granted");
                setTimeout(() => stamp.classList.remove("show-granted"), 1500);
            }
        } else {
            playSound('wrong');
            selectedButton.classList.add("wrong");
            if (optionsContainer.children[correctIndex]) {
                optionsContainer.children[correctIndex].classList.add("correct");
            }
            if (stamp && isEffectsEnabled) {
                stamp.textContent = "ACESSO NEGADO";
                stamp.classList.remove("hidden");
                stamp.classList.add("show-denied");
                setTimeout(() => stamp.classList.remove("show-denied"), 1500);
            }
        }

        score = calculateFinalScore();
        const answeredSoFar = userAnswers.filter(answer => answer !== null).length || 1;
        const accuracy = score / answeredSoFar;

        if (accuracy >= 0.8) {
            progressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            progressBar.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
        } else if (accuracy >= 0.5) {
            progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            progressBar.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.5)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            progressBar.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
        }

        skipBtn.classList.add("hidden-btn");
        nextBtn.classList.remove("hidden-btn");

        nextBtn.innerHTML = currentQuestionIndex < questions.length - 1 ? 'Próxima ➔ <span class="kbd-shortcut" aria-hidden="true">(Enter)</span>' : "Descriptografar Relatório";
        nextBtn.focus();
    }

    function skipQuestion() {
        if (isTransitioning || quizActions.classList.contains("is-answered")) return;
        quizActions.classList.add("is-answered");
        userAnswers[currentQuestionIndex] = -1;
        triggerNextAnimation();
    }

    function loadNextQuestion() {
        if (isTransitioning) return;
        triggerNextAnimation();
    }

    function triggerNextAnimation() {
        if (isTransitioning) return;
        isTransitioning = true;
        nextBtn.disabled = true;
        skipBtn.disabled = true;

        if (isEffectsEnabled) {
            questionAreaContainer.classList.remove("slide-in-right");
            questionAreaContainer.classList.add("slide-out-left");
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    renderQuestion();
                } else {
                    stopTimer();
                    showResults();
                }
            }, 300);
        } else {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                renderQuestion();
            } else {
                stopTimer();
                showResults();
            }
        }
    }

    function calculateFinalScore() {
        return questions.reduce((total, q, index) => {
            return total + (userAnswers[index] === getAnswer(q) ? 1 : 0);
        }, 0);
    }

    function updateScoreUI(finalScore, totalQuestions) {
        if (scoreText) scoreText.textContent = String(finalScore);
        if (totalText) totalText.textContent = String(totalQuestions);

        const totalWrapper = totalText ? totalText.parentElement : null;
        if (totalWrapper) {
            totalWrapper.style.whiteSpace = "nowrap";
            totalWrapper.style.display = "inline-flex";
            totalWrapper.style.alignItems = "baseline";
            totalWrapper.style.justifyContent = "center";
            totalWrapper.style.gap = "0.25rem";
        }
    }

    function showResults() {
        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("active", "hidden");
        resultScreen.classList.replace("hidden", "active");
        progressBar.style.width = "100%";

        score = calculateFinalScore();
        updateScoreUI(score, questions.length);

        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-total-text').textContent = `${m}m ${s}s`;
        const avg = secondsElapsed > 0 ? (secondsElapsed / questions.length).toFixed(1) : 0;
        document.getElementById('time-avg-text').textContent = `${avg}s`;

        const scoreCircleUI = document.getElementById("score-circle-ui");
        if (scoreCircleUI) scoreCircleUI.classList.remove("gold-glow");
        feedbackText.classList.remove("perfect-score-text");

        if (score === questions.length) {
            feedbackText.textContent = "🏆 Auditoria impecável! Domínio absoluto dos paradigmas em Python!";
            feedbackText.classList.add("perfect-score-text");
            playSound('victory');
            if (scoreCircleUI) scoreCircleUI.classList.add("gold-glow");
            if (typeof confetti === 'function' && isEffectsEnabled) confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#10b981', '#00ff88', '#00cc6a'] });
        } else if (score >= questions.length * 0.7) {
            feedbackText.textContent = "Build resistente! Sua base teórica em programação Python está bem sólida. 👍";
        } else {
            feedbackText.textContent = "Foram detectadas vulnerabilidades nos seus conhecimentos. Recomendo repassar a matriz do simulado. 📚";
        }

        saveQuizHistory();
        generateReviewContent();

        reviewContainer.classList.remove("hidden");
        isReviewVisible = true;
        showReviewBtn.textContent = "Ocultar logs";
        renderHistoryCard();
    }

    function generateReviewContent() {
        reviewContent.innerHTML = "";
        questions.forEach((q, index) => {
            const userAnswerIndex = userAnswers[index];
            const correctIndex = getAnswer(q);
            const isCorrect = userAnswerIndex === correctIndex;
            const skipped = userAnswerIndex === -1;
            const reviewBox = document.createElement("div");
            reviewBox.classList.add("review-item");

            let htmlContent = `<h4 style="white-space: pre-wrap; line-height: 1.6;">${q.question}</h4><div class="review-ans-group">`;
            
            if (isCorrect) {
                htmlContent += `<div class="review-ans-text correct">${iconCheck} <span><b>Resposta enviada: ${String.fromCharCode(65 + userAnswerIndex)})</b> ${q.options[userAnswerIndex]}</span></div>`;
            } else if (skipped) {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span>Questão pulada.</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            } else if (userAnswerIndex === null || userAnswerIndex === undefined || !q.options[userAnswerIndex]) {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span>Sem resposta registrada.</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            } else {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span><b>Resposta enviada: ${String.fromCharCode(65 + userAnswerIndex)})</b> ${q.options[userAnswerIndex]}</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            }
            htmlContent += `</div><div class="review-exp"><strong>💡 Output Técnico:</strong><p>${q.explanation}</p></div>`;
            reviewBox.innerHTML = htmlContent;
            reviewContent.appendChild(reviewBox);
        });
    }

    function getStoredHistory() {
        try {
            const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !Array.isArray(data.answers)) return null;
            return data;
        } catch (error) {
            console.warn("Não foi possível ler o histórico do quiz.", error);
            return null;
        }
    }

    function saveQuizHistory() {
        try {
            const safeAnswers = questions.map((_, index) => {
                const value = userAnswers[index];
                return Number.isInteger(value) ? value : null;
            });

            const payload = {
                score: calculateFinalScore(),
                total: questions.length,
                answers: safeAnswers,
                secondsElapsed,
                completedAt: new Date().toISOString(),
                pageUrl: window.location.href
            };

            localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(payload));
        } catch (error) {
            console.warn("Não foi possível salvar o histórico do quiz.", error);
        }
    }

    function renderHistoryCard() {
        if (!historyContainer || !historyScoreText) return;

        const history = getStoredHistory();
        if (!history) {
            historyContainer.classList.add("hidden");
            return;
        }

        const storedScore = Number.isFinite(Number(history.score)) ? Number(history.score) : 0;
        historyScoreText.textContent = String(storedScore);
        historyContainer.classList.remove("hidden");
    }

    function fillResultScreenFromCurrentState() {
        score = calculateFinalScore();
        updateScoreUI(score, questions.length);

        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-total-text').textContent = `${m}m ${s}s`;
        const avg = secondsElapsed > 0 ? (secondsElapsed / questions.length).toFixed(1) : 0;
        document.getElementById('time-avg-text').textContent = `${avg}s`;

        const scoreCircleUI = document.getElementById("score-circle-ui");
        if (scoreCircleUI) scoreCircleUI.classList.remove("gold-glow");
        feedbackText.classList.remove("perfect-score-text");

        if (score === questions.length) {
            feedbackText.textContent = "🏆 Auditoria impecável! Domínio absoluto dos paradigmas em Python!";
            feedbackText.classList.add("perfect-score-text");
            if (scoreCircleUI) scoreCircleUI.classList.add("gold-glow");
        } else if (score >= questions.length * 0.7) {
            feedbackText.textContent = "Build resistente! Sua base teórica em programação Python está bem sólida. 👍";
        } else {
            feedbackText.textContent = "Foram detectadas vulnerabilidades nos seus conhecimentos. Recomendo repassar a matriz do simulado. 📚";
        }

        generateReviewContent();
    }

    function openStoredReview() {
        const history = getStoredHistory();
        if (!history) {
            alert("Ainda não existe um gabarito salvo. Finalize uma simulação primeiro.");
            renderHistoryCard();
            return;
        }

        stopTimer();
        secondsElapsed = Number.isFinite(Number(history.secondsElapsed)) ? Number(history.secondsElapsed) : 0;
        userAnswers = questions.map((_, index) => {
            const value = history.answers[index];
            return Number.isInteger(value) ? value : null;
        });
        currentQuestionIndex = questions.length;
        isTransitioning = false;

        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("active", "hidden");
        quizScreen.classList.add("hidden");
        resultScreen.classList.replace("hidden", "active");

        fillResultScreenFromCurrentState();
        reviewContainer.classList.remove("hidden");
        isReviewVisible = true;
        showReviewBtn.textContent = "Ocultar logs";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function toggleReview() {
        isReviewVisible = !isReviewVisible;
        if (isReviewVisible) {
            reviewContainer.classList.remove("hidden");
            showReviewBtn.textContent = "Ocultar logs";
        } else {
            reviewContainer.classList.add("hidden");
            showReviewBtn.textContent = "Ver logs detalhados";
        }
    }

    // ==========================================
    // EXPORTAÇÃO INTELIGENTE (WHATSAPP + TEXTO DINÂMICO)
    // ==========================================
    async function exportReport() {
        const reportArea = document.getElementById("print-area");
        if (!reportArea) {
            showToast("Erro: Área de relatório não encontrada.");
            return;
        }

        if (typeof html2canvas !== "function") {
            showToast("Erro: Biblioteca html2canvas offline.");
            return;
        }

        const originalHTML = shareBtn.innerHTML;
        shareBtn.disabled = true;
        shareBtn.innerHTML = "Processando pacote...";

        try {
            const finalScore = calculateFinalScore();
            updateScoreUI(finalScore, questions.length);

            const categories = {
                'Fundamentos e Variáveis Python': [1, 3, 5, 7, 8, 12, 13, 16, 20, 21, 22],
                'Orientação a Objetos': [0, 2, 4, 6, 9, 10, 11, 14, 15, 23, 26, 27, 29],
                'Tkinter e Exceções': [17, 18, 24, 25, 28]
            };

            let missedCats = new Set();
            userAnswers.forEach((ans, i) => {
                if (ans !== getAnswer(questions[i])) {
                    for (let cat in categories) {
                        if (categories[cat].includes(i)) missedCats.add(cat);
                    }
                }
            });

            let improvementText = "";
            if (missedCats.size > 0) {
                improvementText = `⚠️ *Identifiquei vulnerabilidades nos seguintes tópicos:*\n- ${Array.from(missedCats).join('\n- ')}\n\n`;
            } else {
                improvementText = `🏆 *Build de sucesso! Nenhuma vulnerabilidade detectada.* Python master!\n\n`;
            }

            const pageUrl = window.location.href;
            const shareText = `🛡️ *Relatório LSTECHINFO TI | Python* 🛡️\n\n🎯 *Meu Desempenho:* ${finalScore} de ${questions.length} acertos!\n\n${improvementText}🔗 *Acesse o motor e teste seus conhecimentos:* ${pageUrl}`;

            const surfaceColor = getComputedStyle(document.body).getPropertyValue("--surface").trim() || null;
            const canvas = await html2canvas(reportArea, {
                backgroundColor: surfaceColor,
                scale: Math.min(2, window.devicePixelRatio || 1),
                useCORS: true
            });

            const fileName = `simulado-python-${finalScore}-de-${questions.length}.png`;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
            if (!blob) throw new Error("Falha ao renderizar a imagem.");

            const file = new File([blob], fileName, { type: "image/png" });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: "Relatório Python V2",
                    text: shareText,
                    files: [file]
                });
                return;
            }

            downloadCanvasImage(canvas, fileName);
            window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText), '_blank');
            showToast("Relatório salvo e texto copiado para o Zap!");

        } catch (error) {
            if (error && (error.name === "AbortError" || error.name === "NotAllowedError")) {
                console.info("Compartilhamento cancelado.");
            } else {
                console.error("Erro no export:", error);
                showToast("Erro ao compartilhar o relatório.");
            }
        } finally {
            shareBtn.disabled = false;
            shareBtn.innerHTML = originalHTML;
        }
    }

    function downloadCanvasImage(canvas, fileName) {
        const imageUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function resetQuiz() {
        resultScreen.classList.replace("active", "hidden");
        showReviewBtn.textContent = "Ver logs detalhados";
        isReviewVisible = false;
        reviewContainer.classList.add("hidden");
        startQuiz();
    }

    // ==========================================
    // ANIMAÇÃO DE FUNDO (CYBER TOPO)
    // ==========================================
    function initNetworkCanvas() {
        const canvas = document.getElementById('network-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = document.body.hasAttribute('data-theme') ? '#00ff88' : '#94a3b8';
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animate() {
            if (!document.body.classList.contains('no-effects')) {
                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                    for (let j = i; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 120) {
                            ctx.beginPath();
                            ctx.strokeStyle = document.body.hasAttribute('data-theme') ? `rgba(0, 255, 136, ${1 - distance / 120})` : `rgba(148, 163, 184, ${1 - distance / 120})`;
                            ctx.lineWidth = 1;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            } else {
                ctx.clearRect(0, 0, width, height);
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    window.addEventListener('load', initNetworkCanvas);

})();