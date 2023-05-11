const cep = document.getElementById("cep");
const form = document.querySelector("form");
const btnCadastrar = document.querySelector("#btn-cadastrar");

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
          document.getElementById("cidade").value = data.localidade;
          document.getElementById("estados").value = data.uf;
        });
      })
      .catch((err) => {
        console.log("ERRO: ", err);
      });
  } else {
    document.getElementById("rua").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("complemento").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("estados").value = "Estado";
  }
});

const loadingIcon = document.getElementById("loading-icon");

btnCadastrar.addEventListener("click", () => {
  if (document.getElementById("estados").value == "Estado") {
    document.getElementById("estados").value = "";
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = [...formData.entries()];

  console.log(data);

  const cep = data[0][1];
  const rua = data[1][1];
  const bairro = data[2][1];
  const complemento = data[3][1];
  const cidade = data[4][1];
  const estados = data[5][1];

  const p = document.createElement("p");
  p.style.display = "none";
  if (complemento) {
    p.innerText = `${cep}: ${rua}, ${bairro}, ${complemento}, ${cidade}-${estados}`;
  } else {
    p.innerText = `${cep}: ${rua}, ${bairro}, ${cidade}-${estados}`;
  }
  document.getElementById("bq-resultado").appendChild(p);

  document.getElementById("cep").value = "";
  document.getElementById("rua").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("complemento").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("estados").value = "Estado";

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

const children = document.getElementById("bq-resultado").children;

const btnConsulta = document.getElementById("btn-consultar");
btnConsulta.addEventListener("click", () => {
  for (let i = 0; i < children.length; i++) {
    children[i].style.display = "block";
  }
});
