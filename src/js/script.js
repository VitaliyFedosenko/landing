const menuBtn = document.querySelector('.menu-burger__btn');
const menu = document.querySelector('.header__menu');
const menuAnim = document.querySelector('.menu-burger__line');


menuBtn.addEventListener('click', function() {
    menu.classList.toggle('header__menu__active');
    menuAnim.classList.toggle('menu-burger__line--anim');
})

// ========================= Contact Us ====================

const form = document.getElementById('form');
const userName = document.getElementById('formName');
const userEmail = document.getElementById('formEmail');
const userMessage = document.getElementById('formMessage');


form.addEventListener('submit', e => { 
    e.preventDefault();

    
   const status = validateInputs();
   if (!status) {   
       return;
   }

   const xhr = new XMLHttpRequest();
   
   xhr.open(
       'post',
       'https://hup7d519i8.execute-api.us-east-1.amazonaws.com/dev/messages'
   );

   xhr.send(JSON.stringify({    
       'name': userName.value,
       'email': userEmail.value,
       'message': userMessage.value,
   }
   ));

   xhr.onload = function() {    
    if (xhr.response == 'ok' && xhr.status == 200) {
        const popupBtn = document.getElementById('popup-btn')

        document.getElementById('send-popup').classList.add('active');
        popupBtn.addEventListener('click', () => {  
            document.getElementById('send-popup').classList.remove('active');
        })
        form.reset();
    }
   };

   return false;
});

function setError (element, message) {    
    const contactItem = element.parentElement;
    const errorDisplay = contactItem.querySelector('.error');

    errorDisplay.innerText = message;
    contactItem.classList.add('error');
}

function setSuccess (element) { 
    const contactItem = element.parentElement;
    const errorDisplay = contactItem.querySelector('.error');

    errorDisplay.innerText = '';
    contactItem.classList.remove('error');
}

function isValidName (userName) {   
    return /[A-Za-zА-Яа-яЁё]/.test(userName);
}

function isValidEmail (userEmail) {
    const re = /[a-z0-9\.\-]+@[a-z0-9\.\-]+\.[a-z]{1,3}/;
    return re.test(userEmail);
}

function validateInputs() {  
    const userNameValue = userName.value.trim();
    const userEmailValue = userEmail.value.trim();
    
    let status = false;


    if(userNameValue.length == 0)  {       
        setError(userName, 'is required!');
    }  
    
    if (!isValidName(userNameValue)) {
        
        setError(userName, 'must contain only letters');
    } else {    
        setSuccess(userName);
        status = true;
    }



    if(userEmailValue == 0) {

        status = false;

        setError(userEmail, 'is required!');
    } else if
        (!isValidEmail(userEmailValue)) {
            status = false;
            setError(userEmail, 'provide a valid email address')
        } else {
            setSuccess(userEmail);
        }

       
    return status;

};









