// Configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// Función para validar correo
function validarCorreo(correo) {
  const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return regex.test(correo);
}

// Login con email y contraseña
document.getElementById("formLogin").addEventListener("submit", function(e) {
  e.preventDefault();
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value.trim();

  if (!validarCorreo(correo)) {
    Swal.fire({
      icon: "error",
      title: "Correo inválido",
      text: "Por favor ingresa un correo electrónico válido."
    });
    return;
  }

  if (clave.length < 6) {
    Swal.fire({
      icon: "error",
      title: "Contraseña muy corta",
      text: "La contraseña debe tener al menos 6 caracteres."
    });
    return;
  }

  // Autenticación con Firebase
  auth.signInWithEmailAndPassword(correo, clave)
    .then((userCredential) => {
      Swal.fire({
        icon: "success",
        title: "Acceso concedido",
        text: "Redirigiendo...",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location.href = "http://localhost/prograweb/inicio.html";
      });
    })
    .catch((error) => {
      let errorMessage = "Ocurrió un error al iniciar sesión";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuario no encontrado";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta";
      }
      
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: errorMessage
      });
    });
});

// Login con Google
document.getElementById("googleLogin").addEventListener("click", function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      Swal.fire({
        icon: "success",
        title: "Bienvenido con Google",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location.href = "http://localhost/prograweb/inicio.html";
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error al autenticar con Google",
        text: error.message
      });
    });
});

// Login con Facebook
document.getElementById("facebookLogin").addEventListener("click", function() {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      Swal.fire({
        icon: "success",
        title: "Bienvenido con Facebook",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location.href = "http://localhost/prograweb/inicio.html";
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error al autenticar con Facebook",
        text: error.message
      });
    });
});

// Registro de nuevo usuario
document.getElementById("registerLink").addEventListener("click", function(e) {
  e.preventDefault();
  
  Swal.fire({
    title: 'Crear nueva cuenta',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Correo electrónico">' +
      '<input id="swal-input2" type="password" class="swal2-input" placeholder="Contraseña">' +
      '<input id="swal-input3" type="password" class="swal2-input" placeholder="Confirmar contraseña">',
    focusConfirm: false,
    preConfirm: () => {
      const email = document.getElementById('swal-input1').value;
      const password = document.getElementById('swal-input2').value;
      const confirmPassword = document.getElementById('swal-input3').value;
      
      if (!validarCorreo(email)) {
        Swal.showValidationMessage('Ingresa un correo electrónico válido');
        return false;
      }
      
      if (password.length < 6) {
        Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
      
      if (password !== confirmPassword) {
        Swal.showValidationMessage('Las contraseñas no coinciden');
        return false;
      }
      
      return { email, password };
    }
  }).then((result) => {
    if (result.value) {
      const { email, password } = result.value;
      
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          Swal.fire({
            icon: 'success',
            title: '¡Cuenta creada!',
            text: 'Tu cuenta ha sido creada exitosamente',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = "http://localhost/prograweb/inicio.html";
          });
        })
        .catch((error) => {
          let errorMessage = "Ocurrió un error al crear la cuenta";
          if (error.code === "auth/email-already-in-use") {
            errorMessage = "Este correo ya está registrado";
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: errorMessage
          });
        });
    }
  });
});