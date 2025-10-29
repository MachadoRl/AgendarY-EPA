const elementoModal = document.getElementById("meuModalAlerta");
const meuModal = new bootstrap.Modal(elementoModal);

function popup(mensagem, titulo = "Aviso", urlParaRedirecionar = null) {
  const modalTitulo = document.getElementById("modalTitulo");
  const modalCorpo = document.getElementById("modalCorpo");

  modalTitulo.textContent = titulo;
  modalCorpo.textContent = mensagem;

  if (urlParaRedirecionar) {
    elementoModal.addEventListener(
      "hidden.bs.modal",
      () => {
        window.location.href = urlParaRedirecionar;
      },
      { once: true }
    );
  }

  meuModal.show();
}

const elementoModalConfirmar = document.getElementById("meuModalConfirmar");
const meuModalConfirmar = new bootstrap.Modal(elementoModalConfirmar);
const btnConfirmarAcao = document.getElementById("btn-confirmar-acao");

let acaoConfirmadaCallback = null;

function confirmar(mensagem, titulo, callbackAcao) {
  const modalTitulo = document.getElementById("modalConfirmarTitulo");
  const modalCorpo = document.getElementById("modalConfirmarCorpo");

  modalTitulo.textContent = titulo;
  modalCorpo.textContent = mensagem;

  acaoConfirmadaCallback = callbackAcao;

  meuModalConfirmar.show();
}

btnConfirmarAcao.addEventListener("click", () => {
  if (typeof acaoConfirmadaCallback === "function") {
    meuModalConfirmar.hide();
    acaoConfirmadaCallback();
    acaoConfirmadaCallback = null;
  }
});

emailjs.init("1w7L-SgLoNZrI9kZB");

const txtNome = document.getElementById("campo-nome");
const txtemail = document.getElementById("campo-email");
const btnCadastroUsuario = document.getElementById("btn-cadastro-usuario");
const nomeExibido = document.getElementById("nome-exibido");

function guardarUsuario(event) {
  event.preventDefault();

  const previewImg = document.getElementById("preview-img");
  const fotoBase64 = previewImg.src;

  if (!txtNome?.value || !txtemail?.value) {
    popup("Preencha todos os campos do usuário!");
    return;
  }

  if (!fotoBase64 || !fotoBase64.startsWith("data:image")) {
    popup("Por favor, escolha uma imagem de perfil!");
    return;
  }

  const Nome = txtNome.value;
  const Email = txtemail.value;

  if (fotoBase64 && fotoBase64.startsWith("data:image")) {
    localStorage.setItem("usuarioFoto", fotoBase64);
  }

  localStorage.setItem("usuarioNome", Nome);
  localStorage.setItem("usuarioEmail", Email);

  const templateParams = {
    nome: Nome,
    email: Email,
  };

  emailjs
    .send("Service_AgendarY", "template_ip9h3nh", templateParams)
    .then(() => {
      popup(
        "Cadastro concluído! Um e-mail de boas-vindas foi enviado.",
        "Sucesso!",
        "pages/menuInicial.html"
      );
    });
}

if (btnCadastroUsuario) {
  btnCadastroUsuario.addEventListener("click", guardarUsuario);
}

const nomeUsuario = localStorage.getItem("usuarioNome");
if (nomeExibido && nomeUsuario) {
  nomeExibido.textContent = nomeUsuario;
}

const botao = document.getElementById("btn-cadastrar-servico");
const listagem = document.getElementById("listagem");

const txtservico = document.getElementById("servico-cadastro");
const txtbairro = document.getElementById("bairro-cadastro");
const txtrua = document.getElementById("rua-cadastro");
const txtnumerocasa = document.getElementById("numero-cadastro");
const txtdescricao = document.getElementById("descricao-cadastro");

const inputFotoServico = document.getElementById("input-foto-servico");
const previewImgServico = document.getElementById("preview-img-servico");
const placeHolderTextServico = document.getElementById(
  "placeholder-text-servico"
);

const servicos = carregarServicos();

function guardarServico(event) {
  event.preventDefault();
  const fotoServicoBase64 = previewImgServico ? previewImgServico.src : "";

  if (
    !txtservico.value ||
    !txtbairro.value ||
    !txtrua.value ||
    !txtnumerocasa.value ||
    !txtdescricao.value
  ) {
    popup("Preencha todos os campos do serviço!");
    return;
  }

  if (!fotoServicoBase64 || !fotoServicoBase64.startsWith("data:image")) {
    popup("Por favor, adicione uma foto para o serviço!");
    return;
  }

  const obj = {
    servico: txtservico.value,
    bairro: txtbairro.value,
    rua: txtrua.value,
    numerocasa: txtnumerocasa.value,
    descricao: txtdescricao.value,
    foto: fotoServicoBase64,
  };

  servicos.push(obj);
  armazenarServicos();
  Listagem();

  popup(
    "Serviço cadastrado com sucesso!",
    "Sucesso!",
    "menuInicial.html" //
  );
}

if (botao) {
  botao.addEventListener("click", guardarServico);
}

function Listagem() {
  if (!listagem) return;
  let html = "";
  for (let i = 0; i < servicos.length; i++) {
    const obj = servicos[i];
    html += `
        <div class="col-3 p-2">
        <div class="itemServico p-3">
            <img src="${
              obj.foto || "https://placehold.co/200x160"
            }" alt="servicePhoto" class="rounded-3 mb-2 img-servico">
            <h3 class="primary-text-color">${obj.servico}</h3>
            <p class="fora-destaque limite-palavras">${obj.descricao}</p>
            <div class="dadosServico fora-destaque">
                <div>
                    <img src="../img/usuario.png" alt="Icon"> <span>${
                      nomeUsuario || "Usuário"
                    }</span>
                </div>
                <div>
                    <img src="../img/localidade.png" alt="Location"> 
                    <span>${obj.bairro}, ${obj.rua}, ${obj.numerocasa}</span>
                </div>
            </div>
            <div class="row">
            <div class="d-flex justify-content-end mt-2 col-8">
                <a href="../pages/menuCalendario.html" class="btn btn-gradient-sm" onclick="localStorage.setItem('servicoParaAgendar', '${
                  obj.servico
                }')">Agendar</a>
            </div>
            <div class="d-flex justify-content-end mt-2 col-3">
                    <a href="javascript:removerServico(${i})" id="img-deletar"><img src="../img/deleteIcon.png" alt=""></a>
                </div>
            </div>
            </div>
        </div>`;
  }
  listagem.innerHTML = html;
}

function removerServico(id) {
  servicos.splice(id, 1);
  armazenarServicos();
  Listagem();
  popup("Serviço removido.", "Aviso");
}

function armazenarServicos() {
  localStorage.setItem("MEMORIA", JSON.stringify(servicos));
}

function carregarServicos() {
  return JSON.parse(localStorage.getItem("MEMORIA")) || [];
}

const inputFoto = document.getElementById("input-foto");
const previewImg = document.getElementById("preview-img");
const placeHolderText = document.getElementById("placeholder-text");

if (inputFoto) {
  inputFoto.addEventListener("change", function (event) {
    const arquivo = event.target.files[0];

    if (arquivo) {
      const leitor = new FileReader();

      leitor.onload = function (e) {
        previewImg.src = e.target.result;
      };

      if (placeHolderText) {
        placeHolderText.style.display = "none";
      }

      leitor.readAsDataURL(arquivo);
    }
  });
}

if (inputFotoServico) {
  inputFotoServico.addEventListener("change", function (event) {
    const arquivo = event.target.files[0];

    if (arquivo) {
      const leitor = new FileReader();

      leitor.onload = function (e) {
        previewImgServico.src = e.target.result;
      };

      if (placeHolderTextServico) {
        placeHolderTextServico.style.display = "none";
      }

      leitor.readAsDataURL(arquivo);
    }
  });
}

Listagem();

function armazenarAgendados(listaParaSalvar) {
  localStorage.setItem("MEMORIA_AGENDADOS", JSON.stringify(listaParaSalvar));
}

function carregarAgendados() {
  return JSON.parse(localStorage.getItem("MEMORIA_AGENDADOS")) || [];
}

function exibirAgendamentos() {
  const campoAgendados = document.getElementById("lista-agendados");
  if (!campoAgendados) return;

  const listaAgendados = carregarAgendados();

  campoAgendados.innerHTML = "";

  if (listaAgendados.length === 0) {
    campoAgendados.innerHTML = `<li class="list-group-item border-0">Nenhum serviço agendado.</li>`;
  } else {
    listaAgendados.forEach((agendamento, i) => {
      campoAgendados.innerHTML += `
        <li class="list-group-item bg-servico rounded-3 p-3 border-0">
          <div class="row">
              <div class="col-10">
                  <img src=" ../img/calendarioRelogio.png" alt="logo calendario">
                  <span>${agendamento.data}</span> <br>
                  <span class="fw-bold">${agendamento.servico}</span>
              </div>
          <div class="col-1 m-auto">
          <a href="javaScript:removerAgendamento(${i})"><img src="../img/deleteIcon.png" alt=""></a>
          </div>
          
        </li>
      `;
    });
  }
}

function exibirAgendamentosConta() {
  const campoAgendadosConta = document.getElementById("lista-agendados-conta");
  if (!campoAgendadosConta) return;

  const listaAgendados = carregarAgendados();

  campoAgendadosConta.innerHTML = "";

  if (listaAgendados.length === 0) {
    campoAgendadosConta.innerHTML = `<li class="list-group-item border-0">Nenhum serviço agendado.</li>`;
  } else {
    listaAgendados.forEach((agendamento) => {
      campoAgendadosConta.innerHTML += `
        <li class="list-group-item bg-servico rounded-3 p-3 border-0 d-flex align-items-start flex-column">
                  <div class="">
                    <img src=" ../img/calendarioRelogio.png" alt="logo calendario">
                    <span>${agendamento.data}</span> <br>
                  </div>
                  <span class="fw-bold">${agendamento.servico}</span>
        </li>
      `;
    });
  }
}

function exibirEmail() {
  const campoEmail = document.getElementById("exibir-email");

  if (campoEmail) {
    const storageEmail = localStorage.getItem("usuarioEmail");
    campoEmail.textContent = storageEmail;
  }
}

function quantidadeAgendados() {
  const qtdAgendados = document.getElementById("qtd-agendados");

  if (qtdAgendados) {
    const listaAgendados = carregarAgendados();
    qtdAgendados.innerHTML = listaAgendados.length;
  }
}

function removerAgendamento(id) {
  let listaAgendados = carregarAgendados();
  listaAgendados.splice(id, 1);
  armazenarAgendados(listaAgendados);
  exibirAgendamentos();
  popup("Agendamento removido.", "Aviso");
}

function agendarHorario(event) {
  event.preventDefault();

  const inputCalendario = document.getElementById("input-calendario");
  if (!inputCalendario.value) {
    popup("Por favor, selecione data e hora!");
    return;
  }

  const servicoAgendado = localStorage.getItem("servicoParaAgendar");

  const dataObj = new Date(inputCalendario.value);
  const dataFormatada =
    dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    }) +
    `, ${dataObj.getHours()}:${String(dataObj.getMinutes()).padStart(2, "0")}`;

  const novoAgendamento = {
    servico: servicoAgendado || "Serviço",
    data: dataFormatada,
  };

  const listaAgendados = carregarAgendados();
  listaAgendados.push(novoAgendamento);
  armazenarAgendados(listaAgendados);

  exibirAgendamentos();
  window.open("../pages/success.html", "_self");
}

const tituloMesAno = document.getElementById("titulo-mes-ano");
const corpoCalendario = document.getElementById("corpo-calendario");
const btnMesAnterior = document.getElementById("btn-mes-anterior");
const btnProximoMes = document.getElementById("btn-proximo-mes");
const inputCalendario = document.getElementById("input-calendario");
const formularioAgendamento = document.querySelector("main form");

if (tituloMesAno && corpoCalendario && btnMesAnterior) {
  let dataAtual = new Date(2025, 9, 1);
  let diaSelecionadoElemento = null;

  function renderizarCalendario() {
    corpoCalendario.innerHTML = "";
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    let nomeMes = dataAtual.toLocaleDateString("pt-br", { month: "long" });
    tituloMesAno.textContent = `${
      nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)
    } ${ano}`;

    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();

    let dia = 1;

    for (let i = 0; i < 6; i++) {
      const linha = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const celula = document.createElement("td");

        if ((i === 0 && j < primeiroDiaSemana) || dia > ultimoDiaMes) {
          celula.classList.add("dia-fora-mes");
        } else {
          celula.textContent = dia;
          celula.classList.add("dia-calendario");
          celula.classList.add("dia-mes");

          celula.dataset.data = `${ano}-${String(mes + 1).padStart(
            2,
            "0"
          )}-${String(dia).padStart(2, "0")}`;

          dia++;
        }
        linha.appendChild(celula);
      }
      corpoCalendario.appendChild(linha);
      if (dia > ultimoDiaMes) break;
    }
  }

  function mudarMes(direcao) {
    dataAtual.setMonth(dataAtual.getMonth() + direcao);
    renderizarCalendario();
    inputCalendario.value = "";
    if (diaSelecionadoElemento) {
      diaSelecionadoElemento.classList.remove("selecionado");
    }
  }

  function selecionarDia(event) {
    if (event.target && event.target.classList.contains("dia-calendario")) {
      const dataClicada = event.target.dataset.data;

      let horaMinuto = "09:00";
      if (inputCalendario.value) {
        const partesData = inputCalendario.value.split("T");
        if (partesData.length === 2) horaMinuto = partesData[1];
      }

      inputCalendario.value = `${dataClicada}T${horaMinuto}`;

      if (diaSelecionadoElemento) {
        diaSelecionadoElemento.classList.remove("selecionado");
      }

      event.target.classList.add("selecionado");
      diaSelecionadoElemento = event.target;
    }
  }

  btnMesAnterior.addEventListener("click", () => mudarMes(-1));
  btnProximoMes.addEventListener("click", () => mudarMes(1));
  corpoCalendario.addEventListener("click", selecionarDia);

  if (formularioAgendamento) {
    formularioAgendamento.addEventListener("submit", agendarHorario);
  }

  renderizarCalendario();
}

function sairConta() {
  const acaoDeSair = () => {
    localStorage.clear();
    popup("Volte sempre!", "Até logo!", "../index.html");
  };

  confirmar(
    "Tem certeza que deseja voltar para a página inicial?",
    "Confirmar Saída",
    acaoDeSair
  );
}

function exibirImagem() {
  const fotoSalva = localStorage.getItem("usuarioFoto");
  const localFoto = document.getElementById("perfil-foto");

  if (fotoSalva) {
    if (localFoto) {
      localFoto.src = fotoSalva;
    }
  }
}

exibirAgendamentos();
exibirAgendamentosConta();
exibirEmail();
exibirImagem();
quantidadeAgendados();
