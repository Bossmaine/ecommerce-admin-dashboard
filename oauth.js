if (!localStorage.getItem("admin")) {
    location.href = "404.html"
} else if (localStorage.getItem("admin") === null) {
    location.href = "index.html"
}

   