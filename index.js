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

const naira = `&#8358;`;

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

      
    fetch('http://localhost:7100/api/474892/admin/login', requestOptions)
        .then(response => response.json())
        .then(result => {
            localStorage.setItem('admin', JSON.stringify(result));
            const getItem = localStorage.getItem('admin');
            const theItem = JSON.parse(getItem);
            if (theItem) {
                console.log(theItem)
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

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;
    const admin = theToken.admin

    const adminName = document.getElementById('admin-name')
    // const adminImg = document.getElementById('admin-img')

    adminName.innerHTML = `${admin.name}`
    // adminImg.setAttribute('src', admin.image)

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
            
            const getSales = document.getElementById('total-sales');
            const getRevenue = document.getElementById('total-revenue');
            const getCustomers = document.getElementById('total-customers');
            const getPendingOrders = document.getElementById('pending-orders');
            const getProducts = document.getElementById('total-products');
            const getDeliveres = document.getElementById('total-delivered');
            const getTableDetails = document.getElementById('order-table');

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
                    .slice(0, 10);
            
                data.map((order) => {
                    const paymentStatusColor = order.isPaid ? 'green' : 'red';
                    const orderStatusColor = order.orderStatus === 'pending' ? 'red' : 'green';
            
                    tableData += `
                        <tr onclick="tableDetails(${order._id})">
                            <th scope="row">${order.orderRef}</th>
                            <td>${naira + order.totalPrice.toLocaleString()}</td>
                            <td style="color: ${paymentStatusColor}">${order.isPaid ? 'Paid' : 'Not Paid'}</td>
                            <td style="color: ${orderStatusColor}">${order.orderStatus}</td>
                        </tr>
                    `;
                });
            }

            getTableDetails.innerHTML = tableData

        }
    })
    .catch( error => error)
}

function tableDetails(id) {
    console.log(id);
}

function signOut() {
    localStorage.clear();
    location.href = "index.html"
}

