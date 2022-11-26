  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const auth = firebaseApp.auth();




//listen for auth status changes
function authState() {
  auth.onAuthStateChanged(user => {
      if (user) {
        console.log('user logged in: ', user);
        document.getElementById("user").innerHTML = user.email
        document.getElementById("user").setAttribute("href", "/user.html")
        document.getElementById("logout").style.display = "block"
      } else {
        console.log('user logged out', user);
        document.getElementById("user").innerHTML = "Login"
        document.getElementById("user").setAttribute("href", "./login.html")
        document.getElementById("logout").style.display = "none"
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
    const name = signupForm['username'].value;
    const em = signupForm['email'].value;
    const pass = signupForm['password'].value;
    
    console.log(name)
    // sign up the user
    auth.createUserWithEmailAndPassword(em, pass).then(cred => {
      db.collection("users").add({
        name: name,
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
      });

    });
  }

// user logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
  authState()
});