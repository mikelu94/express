function makeSubmitListener(action){
  const form = document.getElementById(`${action}-form`);
  const errorMessage = document.querySelector('article.message.is-danger');
  const urlSearchParams = new URLSearchParams(window.location.search);

  form.addEventListener('submit', async event => {
    event.preventDefault();

    // reset errors
    while(errorMessage.firstChild){
      errorMessage.removeChild(errorMessage.firstChild);
    }

    const email = form.email.value;
    const password = form.password.value;
    
    try{
      const res = await fetch(`/${action}`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if(data.errors){
        const errorMessageBody = document.createElement('div');
        errorMessageBody.setAttribute('class', 'message-body');
        errorMessageBody.textContent = Object.values(data.errors).join(', ');
        errorMessage.appendChild(errorMessageBody);
      }
      if(data.success){
        if(urlSearchParams.has('redirect')){
          location.assign(urlSearchParams.get('redirect'))
        }
        else{
          location.assign('/');
        }
      }
    }
    catch(err){
      console.log(err);
    }
  });
}