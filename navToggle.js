document.addEventListener("DOMContentLoaded", function(event) {
    event.preventDefault();
    
    const showNavbar = () => {
        const toggle = document.getElementById('header-toggle')
        const nav = document.getElementById('nav-bar')
        const bodypd = document.getElementById('body-pd')
        const  headerpd = document.getElementById('header')
        
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
            toggle.classList.toggle('bx-x')
            bodypd.classList.toggle('body-pd')
            headerpd.classList.toggle('body-pd')
        })

    }
    
    showNavbar()
    
    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')
    
    function colorLink() {
        if(linkColor)   {
            linkColor.forEach(l=> l.classList.remove('active'))
            this.classList.add('active')
        }
    }

    linkColor.forEach(l=> l.addEventListener('click', colorLink))
    
    // Your code to run since DOM is loaded and ready

});
