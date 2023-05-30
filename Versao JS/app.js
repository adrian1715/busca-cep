const cep = document.getElementById("cep");
const form = document.querySelector("form");
const btnCadastrar = document.querySelector("#btn-cadastrar");
const estado = document.getElementById("estados");
const cidade = document.getElementById("cidade");
const loadingIcon = document.getElementById("loading-icon");

const cepPattern = /^[0-9]{5}-?[0-9]{3}$/;
let count = 0;

// carregando as opções de estado e cidade
document.addEventListener("DOMContentLoaded", () => {
  // carregando estados
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => a.nome.localeCompare(b.nome));
      data.forEach((state) => {
        const option = document.createElement("option");
        option.value = state.sigla;
        option.text = state.nome;
        estado.appendChild(option);
      });
    });

  // carregando cidades de acordo com o estado selecionado
  estado.addEventListener("change", function () {
    const selectedState = this.value;

    // para limpar cidades adicionadas anteriormente
    cidade.innerHTML = "<option selected hidden disabled>Cidade</option>";

    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`
    )
      .then((response) => response.json())
      .then((data) => {
        data.forEach((city) => {
          const option = document.createElement("option");
          option.value = city.nome;
          option.text = city.nome;
          cidade.appendChild(option);
        });
      });
  });
});

// para adicionar automaticamente os valores de endereço aos inputs de acordo com o cep inserido
cep.addEventListener("input", (e) => {
  e.preventDefault();

  let url = `http://viacep.com.br/ws/${cep.value}/json`;

  if (cep.value.match(cepPattern)) {
    fetch(url)
      .then((res) => {
        res.json().then((data) => {
          document.getElementById("rua").value = data.logradouro;
          document.getElementById("bairro").value = data.bairro;
          document.getElementById("complemento").value = data.complemento;
          estado.value = data.uf;

          // Trigger custom event estado select
          const event = new Event("change");
          estado.dispatchEvent(event);
          setTimeout(function () {
            cidade.value = data.localidade;
          }, 500); // pequeno intervalo para carregar as cidades, antes de selecionar uma delas
        });
      })
      .catch((err) => {
        console.log("ERRO: ", err);
      });
  } else {
    document.getElementById("rua").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("complemento").value = "";
    estado.value = "Estado";
    cidade.value = "Cidade";
  }
});

// limpa valor dos selects após o envio do formulário
btnCadastrar.addEventListener("click", () => {
  if (estado.value == "Estado" && cidade.value == "Cidade") {
    estado.value = "";
    cidade.value = "";
  }
});

// registrando os valores enviados
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (document.getElementById("msg")) {
    document.getElementById("msg").remove();
  }

  const formData = new FormData(form);
  const data = [...formData.entries()];

  console.log(data);

  // adicionando endereço
  const cep = data[0][1];
  const rua = data[1][1];
  const bairro = data[2][1];
  const complemento = data[3][1];
  const estados = data[4][1];
  const cidade = data[5][1];

  if (
    // verificando se o cep é válido e único
    cep.match(cepPattern) &&
    !Object.values(localStorage).some((value) => value.startsWith(cep))
  ) {
    // registrando endereço
    if (!localStorage.id) {
      localStorage.setItem("id", 1);
    } else {
      localStorage.setItem("id", parseInt(localStorage.id) + 1);
    }
    const localId = localStorage.id;

    if (complemento) {
      var item = `${cep}: ${rua}, ${bairro}, ${complemento}, ${cidade}-${estados}`;
    } else {
      var item = `${cep}: ${rua}, ${bairro}, ${cidade}-${estados}`;
    }
    localStorage.setItem(`address${localId}`, item);

    // adicionando novo endereço e botão de exclusão no painel de registros
    const p = document.createElement("p");
    p.innerText = item;
    p.id = p.innerText.match(/^([^:]+)/)[1];
    p.style.display = "none";
    painelResultados.appendChild(p);

    const btnExcluir = document.createElement("button");
    btnExcluir.classList.add("delete-btn", "btn", "btn-danger", "ml-2", "mb-1");
    btnExcluir.style.padding = "2px 8px";
    btnExcluir.innerText = "X";
    btnExcluir.style.display = "none";
    p.appendChild(btnExcluir);

    // mensagem de confirmação
    const msg = document.createElement("span");
    msg.setAttribute("id", "message");
    msg.innerText = "Cadastrado com sucesso!";
    msg.style.color = "green";

    if (loadingIcon.style.display !== "inline-block") {
      loadingIcon.style.display = "inline-block";
    } else {
      document.getElementById("message").replaceWith(loadingIcon);
    }

    setTimeout(function () {
      loadingIcon.replaceWith(msg);
      btnCadastrar.removeAttribute("disabled");
      btnConsulta.removeAttribute("disabled");
    }, 1000);

    btnCadastrar.setAttribute("disabled", "");
    btnConsulta.setAttribute("disabled", "");
  } else {
    // exibindo mensagem de cep inválido
    const msg = document.createElement("div");
    msg.setAttribute("id", "msg");
    msg.classList.add("alert", "alert-warning", "mt-4");
    msg.innerText = "CEP inválido!";
    document.querySelector(".card-body").appendChild(msg);
  }

  // limpando inputs
  document.getElementById("cep").value = "";
  document.getElementById("rua").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("complemento").value = "";
  document.getElementById("cidade").value = "Cidade";
  estado.value = "Estado";
});

// exibindo os registros ao carregar a página
const btnConsulta = document.getElementById("btn-consultar");
const painelResultados = document.querySelector("#bq-resultado");
const addresses = Object.keys(localStorage)
  .filter((key) => key.startsWith("address"))
  .map((key) => localStorage.getItem(key))
  .sort();

for (add of addresses) {
  const p = document.createElement("p");
  p.innerText = add;
  p.id = p.innerText.match(/^([^:]+)/)[1];
  p.style.display = "none";
  painelResultados.appendChild(p);

  const btnExcluir = document.createElement("button");
  btnExcluir.classList.add("delete-btn", "btn", "btn-danger", "ml-2", "mb-1");
  btnExcluir.style.padding = "2px 8px";
  btnExcluir.innerText = "X";
  btnExcluir.style.display = "none";
  p.appendChild(btnExcluir);
}

// exibindo os registros ao clicar em consultar
btnConsulta.addEventListener("click", () => {
  for (p of painelResultados.children) {
    p.style.display = "block";

    const btnExcluir = p.children[0];
    btnExcluir.style.display = "inline-block";

    // botão de exclusão de registro
    btnExcluir.addEventListener("click", () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const storedCep = localStorage.getItem(key).match(/^([^:]+)/)[1];

        if (storedCep == btnExcluir.parentElement.id) {
          localStorage.removeItem(key);
          btnExcluir.parentElement.remove();
        }
      }
    });
  }
});
