
 const BaseApi = 'http://localhost:3636';


 async function register(event){
   
   event.preventDefault();
  const  firstName = document.getElementById('firstname_id').value.trim();
  
   const lastName = document.getElementById('lastname_id').value.trim();
   
   const  emailUser = document.getElementById('email_id').value.trim();
   
  const  passUser = document.getElementById('password_id').value.trim();
   



   try {
    const response = await fetch(`${BaseApi}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,  // Use correct field name
        lastName: lastName,    // Use correct field name
        email: emailUser,
        password: passUser
      })
    });
    
  
    if (!response.ok) {
      //const errorData = await response.json();
      throw new Error(/*errorData.message || */'Registration failed');
    }
  
    const data = await response.json();
    if (data && data.message === 'User registered successfully') {
      console.log(data);
      window.location.href = './main.html';  // Redirect to main page after success
    }
  } catch (error) {
    console.error('Failed to register', error);
    alert('Registration failed: ' + error.message);  // Show an alert to the user
  }
  





 }
 document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('form');  // Select the form dynamically
  if (registerForm) {
    registerForm.addEventListener('submit', register);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('form-login');  // Select the form dynamically
  if (loginForm) {
    loginForm.addEventListener('submit', login);
  }
});


  async function login(event){
    event.preventDefault();


     const  emailUser = document.getElementById('email_id').value.trim();
   
     const  passUser = document.getElementById('password_id').value.trim();

     try{
      const response = await fetch(`${BaseApi}/auth/login`,{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({email:emailUser,password:passUser}),
      })
      if(!response.ok){
        alert('failed to loggin ')
        throw new Error('error logging user ',response);
        
      }
      const data = await response.json();
      if(data.token){
        const token = data.token;
        localStorage.setItem('token',token);
        window.location.href ='./main.html';
      }else{
        console.log('error in login function ');
        throw new Error('there is no token bro ');
        
      }

     }catch(error){
        console.log('error authentificating ');
        const p = document.getElementById('error-id');
        p.innerHTML = 'error authentification verify your credentiels';
     }
     
  }