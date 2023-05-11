// const cep = document.getElementById("cep");
// const formCadastro = document.querySelector("#cadastro");
// const btnCadastrar = document.querySelector("#btn-cadastrar");

// cep.addEventListener("input", (e) => {
//   e.preventDefault();

//   let url = `http://viacep.com.br/ws/${cep.value}/json`;
//   const pattern = /^[0-9]{5}-?[0-9]{3}$/;

//   if (cep.value.match(pattern)) {
//     fetch(url)
//       .then((res) => {
//         res.json().then((data) => {
//           document.getElementById("rua").value = data.logradouro;
//           document.getElementById("bairro").value = data.bairro;
//           document.getElementById("complemento").value = data.complemento;
//           document.getElementById("cidade").value = data.localidade;
//           document.getElementById("estados").value = data.uf;
//         });
//       })
//       .catch((err) => {
//         console.log("ERRO: ", err);
//       });
//   } else {
//     document.getElementById("rua").value = "";
//     document.getElementById("bairro").value = "";
//     document.getElementById("complemento").value = "";
//     document.getElementById("cidade").value = "";
//     document.getElementById("estados").value = "Estado";
//   }
// });

// const loadingIcon = document.getElementById("loading-icon");

// btnCadastrar.addEventListener("click", () => {
//   if (document.getElementById("estados").value == "Estado") {
//     document.getElementById("estados").value = "";
//   }
// });
