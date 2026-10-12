/* Portfólio de Pablo Henrique Oliveira Rodrigues
   Interações do site, feitas só com JavaScript (sem bibliotecas). */

'use strict';

/* Tema claro/escuro: o botão troca o tema e a escolha fica salva no
   navegador (localStorage). */

const CHAVE_TEMA = 'portfolio-tema';
const botaoTema = document.getElementById('botao-tema');

function lerTemaSalvo() {
  try {
    return localStorage.getItem(CHAVE_TEMA);
  } catch (erro) {
    return null;
  }
}

function salvarTema(tema) {
  try {
    localStorage.setItem(CHAVE_TEMA, tema);
  } catch (erro) {
  }
}

function aplicarTema(tema) {
  const escuro = tema === 'escuro';

  document.documentElement.setAttribute('data-tema', tema);
  botaoTema.setAttribute('aria-pressed', String(escuro));
  botaoTema.querySelector('.botao-tema__icone').textContent = escuro ? '☀' : '☾';
  botaoTema.querySelector('.botao-tema__texto').textContent = escuro ? 'Tema claro' : 'Tema escuro';
}

function temaInicial() {
  return lerTemaSalvo() === 'claro' ? 'claro' : 'escuro';
}

aplicarTema(temaInicial());

botaoTema.addEventListener('click', function () {
  const atual = document.documentElement.getAttribute('data-tema');
  const novo = atual === 'escuro' ? 'claro' : 'escuro';

  aplicarTema(novo);
  salvarTema(novo);
});

/* Menu do celular: abre e fecha pelo botão e fecha ao escolher uma seção. */

const botaoMenu = document.getElementById('botao-menu');
const menu = document.getElementById('menu');
const linksMenu = menu.querySelectorAll('.menu__link');

function definirMenuAberto(aberto) {
  menu.classList.toggle('menu--aberto', aberto);
  botaoMenu.setAttribute('aria-expanded', String(aberto));
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

botaoMenu.addEventListener('click', function () {
  definirMenuAberto(!menu.classList.contains('menu--aberto'));
});

linksMenu.forEach(function (link) {
  link.addEventListener('click', function () {
    definirMenuAberto(false);
  });
});

/* Destaca no menu a seção que está aparecendo na tela. */

const secoes = document.querySelectorAll('main section[id]');

function marcarLinkAtivo(idSecao) {
  linksMenu.forEach(function (link) {
    const ativo = link.getAttribute('href') === '#' + idSecao;

    link.classList.toggle('menu__link--ativo', ativo);
    if (ativo) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        marcarLinkAtivo(entrada.target.id);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secoes.forEach(function (secao) {
    observador.observe(secao);
  });
}

/* Formulário de contato: confere se os campos foram preenchidos e se o
   e-mail é válido. Se tiver erro, mostra o aviso embaixo do campo. Se estiver
   tudo certo, limpa os campos e mostra a mensagem de sucesso. O envio é só
   simulado, porque o site não tem servidor. */

const formulario = document.getElementById('formulario-contato');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoMensagem = document.getElementById('mensagem');

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const regras = [
  {
    campo: campoNome,
    validar: function (valor) {
      if (valor === '') return 'Informe seu nome.';
      if (valor.length < 2) return 'O nome precisa ter pelo menos 2 caracteres.';
      return '';
    }
  },
  {
    campo: campoEmail,
    validar: function (valor) {
      if (valor === '') return 'Informe seu e-mail.';
      if (!FORMATO_EMAIL.test(valor)) return 'Digite um e-mail válido, como usuario@dominio.com.';
      return '';
    }
  },
  {
    campo: campoMensagem,
    validar: function (valor) {
      if (valor === '') return 'Escreva sua mensagem.';
      if (valor.length < 10) return 'A mensagem precisa ter pelo menos 10 caracteres.';
      return '';
    }
  }
];

function validarCampo(regra) {
  const erro = regra.validar(regra.campo.value.trim());
  const caixa = regra.campo.closest('.campo');

  caixa.classList.toggle('campo--invalido', erro !== '');
  caixa.querySelector('.campo__erro').textContent = erro;
  regra.campo.setAttribute('aria-invalid', String(erro !== ''));

  return erro === '';
}

regras.forEach(function (regra) {
  regra.campo.addEventListener('blur', function () {
    validarCampo(regra);
  });

  regra.campo.addEventListener('input', function () {
    if (regra.campo.closest('.campo').classList.contains('campo--invalido')) {
      validarCampo(regra);
    }
  });
});

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const resultados = regras.map(validarCampo);
  const primeiroInvalido = resultados.indexOf(false);

  if (primeiroInvalido !== -1) {
    regras[primeiroInvalido].campo.focus();
    return;
  }

  formulario.reset();
  abrirModal();
  regras.forEach(limparErro);
});

function limparErro(regra) {
  const caixa = regra.campo.closest('.campo');

  caixa.classList.remove('campo--invalido');
  caixa.querySelector('.campo__erro').textContent = '';
  regra.campo.removeAttribute('aria-invalid');
}

/* Janela de confirmação: abre depois do envio e fecha pelo botão, clicando
   fora dela ou com a tecla Esc. */

const modal = document.getElementById('modal-sucesso');
const botaoFecharModal = document.getElementById('modal-fechar');
let elementoComFocoAntes = null;

function abrirModal() {
  elementoComFocoAntes = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('sem-rolagem');
  botaoFecharModal.focus();
}

function fecharModal() {
  modal.hidden = true;
  document.body.classList.remove('sem-rolagem');
  if (elementoComFocoAntes) {
    elementoComFocoAntes.focus();
  }
}

botaoFecharModal.addEventListener('click', fecharModal);

modal.addEventListener('click', function (evento) {
  if (evento.target === modal) {
    fecharModal();
  }
});

document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') {
    if (!modal.hidden) {
      fecharModal();
    } else {
      definirMenuAberto(false);
    }
  }

  if (evento.key === 'Tab' && !modal.hidden) {
    evento.preventDefault();
    botaoFecharModal.focus();
  }
});

/* Faz os blocos aparecerem com uma animação quando entram na tela. */

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !semAnimacao) {
  const blocos = document.querySelectorAll(
    '.secao__cabecalho, .painel, .ficha, .linha-tempo__item, .projeto, .formulario'
  );

  const observadorEntrada = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('revelar--visivel');
        observadorEntrada.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  blocos.forEach(function (bloco) {
    bloco.classList.add('revelar');
    observadorEntrada.observe(bloco);
  });
}

/* Coloca o ano atual no rodapé. */

document.getElementById('ano-atual').textContent = new Date().getFullYear();
