import Swal from 'sweetalert2';

export function validador_txtarea(){
  var txt = document.getElementById('textarea').value;
  if(txt==''){
    alert("Ingrese su comentario");
    return false
    }
    else{
      return true
    }
}

export function sa_modal(){
  Swal.fire({
    title: 'Ingrese su calificación',
    html: `<button><img src="./assets/img/estrella.png" alt="" style="height: 50px; width: 50px"></button>
    <button><img src="./assets/img/estrella.png" alt="" style="height: 50px; width: 50px"></button>
    <button><img src="./assets/img/estrella.png" alt="" style="height: 50px; width: 50px"></button>
    <button><img src="./assets/img/estrella.png" alt="" style="height: 50px; width: 50px"></button>
    <button><img src="./assets/img/estrella.png" alt="" style="height: 50px; width: 50px"></button>`,
    confirmButtonText: 'Guardar',
    focusConfirm: false,
    preConfirm: () => {
      const login = Swal.getPopup().querySelector('#login').value
      const password = Swal.getPopup().querySelector('#password').value
      if (!login || !password) {
        Swal.showValidationMessage(`Ingrese su calificación`)
      }
      return { login: login, password: password }
    }
  }).then((result) => {
    Swal.fire(`
      Login: ${result.value.login}
      Password: ${result.value.password}
    `.trim())
  })
}
