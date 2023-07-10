let uploadImage = '';

function uploadFile() {
    const file = document.getElementById("photo").files[0]
    const spinOverlay = document.querySelector('.pagemodal')
    spinOverlay.style.display = 'block'
    const cloudName = 'dbkjq1g8x'
    const formData = new FormData()
    formData.append('file', file)
    formData.append('image', file)
    formData.append('upload_preset', 'vztcrln6')
    formData.append('cloud_name', cloudName)

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData
    }).then(res => res.json())
    .then(data=> {
        console.log(data)
        uploadImage = data.url
        spinOverlay.style.display = 'none'

    })
    .catch(err=> {
        console.log(err)
        spinOverlay.style.display = 'none'
    })    
}

//Sign up API 
function signUp(event) {
    event.preventDefault();
    
    const spinner = document.querySelector('.pagemodal')
    spinner.style.display = 'inline-block';

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

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
        image: uploadImage
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

const naira = `&#8358;`;

//Login API 
function logIn(event) {
    event.preventDefault();
    
    const spinner = document.querySelector('.pagemodal')
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

      
    fetch('http://localhost:7100/api/474892/admin/login', requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.message === 'success') {
                localStorage.setItem('admin', JSON.stringify(result));
                location.href = 'dashboard.html'
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


function adminDashboard() {

    const myPageModal = document.querySelector(".pagemodal");
    myPageModal.style.display = "block";

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;
    const admin = theToken.admin

    if (!token) {
        location.href = 'index.html'
    }

    const placeHolderName = document.getElementById('name');
    const placeHolderEmail = document.getElementById('email');

    placeHolderEmail.setAttribute('placeholder', admin.email )
    placeHolderName.setAttribute('placeholder', admin.name)

    const dashReq = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "authorization" :`Bearer ${token}`
        }
    }

    fetch('http://localhost:7100/api/474892/admin/dashboard', dashReq)
    .then(response => response.json())
    .then( result => {
        console.log(result)
        if (result.message === 'success') {
            
            const adminName = document.getElementById('admin-name')
            const adminImg = document.getElementById('admin-img')
            const getSales = document.getElementById('total-sales');
            const getRevenue = document.getElementById('total-revenue');
            const getCustomers = document.getElementById('total-customers');
            const getPendingOrders = document.getElementById('pending-orders');
            const getProducts = document.getElementById('total-products');
            const getDeliveres = document.getElementById('total-delivered');
            const getTableDetails = document.getElementById('order-table');
            

            adminName.innerHTML = `${result.data.name}`
            adminImg.setAttribute('src', result.data.image)
            getSales.innerHTML = `${result.data.totalSales}`;
            getRevenue.innerHTML = `${naira+result.data.totalRevenue.toLocaleString()}`;
            getCustomers.innerHTML = `${result.data.totalUsers}`;
            getPendingOrders.innerHTML = `${result.data.pendingOrdersCount}`;
            getProducts.innerHTML = `${result.data.totalProducts}`;
            getDeliveres.innerHTML = `${result.data.deliveredOrdersCount}`;

            let tableData = '';

            if (result.data.newOrders.length > 0) {
                const data = result.data.newOrders
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 10); // Sort orders by createdAt in descending order and take the first 10
            
                data.map((order) => {
                    const paymentStatusColor = order.isPaid ? 'green' : 'red';
                    const orderStatusColor = order.orderStatus === 'Delivered' ? 'green' : 'red';
            
                    const createdAt = new Date(order.createdAt);
                    const formattedDate = createdAt.toLocaleDateString();
                    const formattedTime = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
                    tableData += `
                        <tr onclick="tableDetails(${order._id})">
                            <th scope="row">${order.orderRef}</th>
                            <td>${formattedDate} ${formattedTime}</td>
                            <td style="color: ${paymentStatusColor}">${naira + order.totalPrice.toLocaleString()}</td>
                            <td style="color: ${paymentStatusColor}">${order.isPaid ? 'Paid' : 'Not Paid'}</td>
                            <td style="color: ${orderStatusColor}">${order.orderStatus}</td>
                        </tr>
                    `;
                });
            }

            getTableDetails.innerHTML = tableData
            myPageModal.style.display = "none";
        }
    })
    .catch( error => {
        console.error(error)
        location.href = 'index.html'
    })

}

function updateAdmin(event) {
    event.preventDefault();
    
    const spinner = document.querySelector('.pagemodal')
    spinner.style.display = 'inline-block';

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const warn = document.getElementById('input-warning')
    const success  = document.getElementById('input-success')
    const failed  = document.getElementById('input-failed')
    const image = uploadImage;

    if ( !name && !email && !image ) {
        spinner.style.display = 'none';
        warn.style.display = 'inline-block';
    }

    warn.style.display = 'none';

    const data = {
        name,
        email,
        image,
    };

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          "authorization" :`Bearer ${token}`
        },
    };

    fetch('http://localhost:7100/api/474892/admin/update/profile', requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.message === 'success') {
                success.style.display = 'inline-bock';
                setTimeout(()=>location.reload(),3000);
            } else {
                failed.style.display = 'inline-block';
            }
        })
    .catch(error => error);
}

function sendOtp(event) {
    event.preventDefault();

    const spinner = document.querySelector('.spinner')
    spinner.style.display = 'inline-block';

    const email = document.getElementById('email').value;
    const getEmailForm = document.getElementById('email-form')
    const otpForm = document.getElementById('otp-form')

    if (!email) {
        Swal.fire({
            icon: 'error',
            text: 'Email is required!',
            confirmButtonColor: '#161a3b'
        })

        spinner.style.display = 'none';
        return;
    }

    console.log(email)

    const data = {
        email,
    };

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
    };

    fetch('https://elehaus-backend.onrender.com/api/474892/admin/otp', requestOptions)
    .then(response => response.json())
    .then(result => {
        if (result.message === 'success') {
            Swal.fire({
                icon: 'success',
                text: 'OTP sent!',
                confirmButtonColor: '#161a3b'
            })
            getEmailForm.style.display = 'none'
            otpForm.style.display = 'block' 
            spinner.style.display = 'none';

        } else {
            Swal.fire({
                icon: 'error',
                text: 'User not found!',
                confirmButtonColor: '#161a3b'
            })
            spinner.style.display = 'none';
        }
    })
    .catch(error => error)
}

function checkInput(input, nextInputId) {
    if (input.value.length === 1) {
      document.getElementById(nextInputId).focus();
    } else if (input.value.length > 1) {
      input.value = input.value.slice(0, 1);
    }
}

function tableDetails(id) {
    console.log(id);
}

function signOut() {
    localStorage.clear();
    location.href = "index.html"
}

