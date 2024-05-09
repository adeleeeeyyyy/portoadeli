function sendMail(){
  let parms = {
    name : document.getElementById("name").value,
    email : document.getElementById("email").value,
    message : document.getElementById("message").value,
  }
  
  emailjs.send('service_2enydma', 'template_1jjpxd1', parms).then(
  (response) => {
    console.log('SUCCESS!', response.status, response.text);
  },
  (error) => {
    console.log('FAILED...', error);
  },
);
}
