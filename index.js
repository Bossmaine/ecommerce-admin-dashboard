//Sign up API 
function signUp(event) {
    event.preventDefault();
    
    const spinner = document.querySelector('.spinner')
    spinner.style.display = 'inline-block';

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const image = document.getElementById("photo").files[0];

    if (!name || !email || !password || !confirmPassword) {

        Swal.fire({
            icon: 'error',
            text: 'All fields with "*" are required!',
            confirmButtonColor: '#161a3b'
        })

        spinner.style.display = 'none';
        return;
    }

    if ( password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            text: 'Your password do not match!',
            confirmButtonColor: '#161a3b'
        })

        spinner.style.display = 'none';
        return;
    }

    const data = {
        name,
        email,
        password,
        image: image.name
    };

      
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
    };

      
    fetch('https://elehaus-backend.onrender.com/api/474892/admin/', requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.message === 'success') {

                spinner.style.display = 'none';

                Swal.fire({
                    icon: 'success',
                    text: 'Admin Created Successfully!',
                    confirmButtonColor: '#161a3b'
                })

                setTimeout(() => {
                    location.href = "index.html"
                }, 3000)
            }

            else {
                Swal.fire({
                    Icon: 'info',
                    text: 'Unable to Create Admin',
                    confirmButtonColor: '#161a3b'
                })
                getSpin.style.display = "none";

            }
        })
    .catch(error => error);
}

window.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      document.getElementById('sign-up').click();
    }
});


//Login API 
function logIn(event) {
    event.preventDefault();
    
    const spinner = document.querySelector('.spinner')
    spinner.style.display = 'inline-block';

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if ( !email || !password ) {

        Swal.fire({
            icon: 'error',
            text: 'All fields are required!',
            confirmButtonColor: '#161a3b'
        })

        spinner.style.display = 'none';
        return;
    }

    const data = {
        email,
        password,
    };

      
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
    };

      
    fetch('https://elehaus-backend.onrender.com/api/474892/admin/login', requestOptions)
        .then(response => response.json())
        .then(result => {
            localStorage.setItem('admin', JSON.stringify(result.token));
            const getItem = localStorage.getItem('admin');
            const theItem = JSON.parse(getItem);
            if (theItem) {
                location.href = "dashboard.html";
            }

            else {
                Swal.fire({
                    icon: 'error',
                    text: 'Invalid Login Credentials!',
                    confirmButtonColor: '#161a3b'
                })
                spinner.style.display = "none";
            }
        })
    .catch(error => error);
}

window.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      document.getElementById('log-in').click();
    }
});

