const cep = document.getElementById("cep");
const form = document.querySelector("form");
const btnCadastrar = document.querySelector("#btn-cadastrar");
const estado = document.getElementById("estados");
const cidade = document.getElementById("cidade");

const loadingIcon = document.getElementById("loading-icon");
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
  const pattern = /^[0-9]{5}-?[0-9]{3}$/;

  if (cep.value.match(pattern)) {
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
  count++;

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

  if (complemento) {
    localStorage.setItem(
      `address${count}`,
      `${cep}: ${rua}, ${bairro}, ${complemento}, ${cidade}-${estados}`
    );
  } else {
    localStorage.setItem(
      `address${count}`,
      `${cep}: ${rua}, ${bairro}, ${cidade}-${estados}`
    );
  }

  // limpando inputs
  document.getElementById("cep").value = "";
  document.getElementById("rua").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("complemento").value = "";
  cidade.value = "Cidade";
  estado.value = "Estado";

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
});

// exibe os registros
const btnConsulta = document.getElementById("btn-consultar");
const addresses = Object.keys(localStorage)
  .filter((key) => key.startsWith("address"))
  .map((key) => localStorage.getItem(key));

btnConsulta.addEventListener("click", () => {
  for (add of addresses) {
    const p = document.createElement("p");
    p.innerText = add;
    p.appendChild(btn);
    document.getElementById("bq-resultado").appendChild(p);
  }
});
