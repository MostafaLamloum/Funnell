  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const auth = firebaseApp.auth();
  const db = firebaseApp.firestore();

function displayUsers() {
  const container = document.getElementById("data")
  db.collection("users")
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          const dataEl = document.createElement("li")
          dataEl.innerHTML = `
            <div class="name">${doc.data().name}</div>
            <div>${doc.data().email}</div>
            <button onclick='deleteUser("${doc.id}")'>X</button>
          `;
          dataEl.id = doc.id
          container.appendChild(dataEl)
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}


  function deleteUser(id) {
    console.log(id)
    db.collection("users").doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
      document.getElementById(id).remove()
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
  }

//listen for auth status changes
function authState() {
  auth.onAuthStateChanged(user => {
      if (user) {
        console.log('user logged in: ', user);
        // document.getElementById("user").innerHTML = user.email
        // document.getElementById("user").setAttribute("href", "/user.html")
        // document.getElementById("logout").style.display = "block"
      } else {
        console.log('user logged out', user);
        // document.getElementById("user").innerHTML = "Login"
        // document.getElementById("user").setAttribute("href", "./login.html")
        // document.getElementById("logout").style.display = "none"
      }
  });
}

window.onload = function() {
  authState();
};

//registration form
const signupForm = document.querySelector('#signup-form');
if(signupForm !== null){ 
  signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
    
    // get user info
    const name = document.getElementById("username").value;
    const em = signupForm['email'].value;
    const pass = signupForm['password'].value;
    
    console.log(name)
    // sign up the user
    auth.createUserWithEmailAndPassword(em, pass).then(cred => {
      db.collection("users").add({
        name: name,
        email: em,
      })
      .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
      // close & reset the signup form
      const sideForm = document.querySelector('#side-form');
      // M.Sidenav.getInstance(sideForm).close();
      signupForm.reset();
    });
  });
}

//user login 
const loginForm = document.querySelector('#login-form');
if(loginForm !== null) {
    btnLogin.addEventListener('click', (e) => {
      e.preventDefault();
      
      // get user info
      const email = loginForm['login-email'].value;
      const password = loginForm['login-password'].value;

      // log the user in
      auth.signInWithEmailAndPassword(email, password).then((cred) => {
        // reset form
        loginForm.reset();
        window.location.href ="./index.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        const errorEl = document.getElementById("error");
        errorEl.style.display = "block";
        errorEl.innerHTML = errorMessage
      });
    });
  }

// user logout
const logout = document.querySelector('#logout');
if(logout !== null) {
  logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    authState()
  });
}
















