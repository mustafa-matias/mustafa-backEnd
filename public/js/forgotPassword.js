const forgotPassword = document.getElementById('forgotPassword');

forgotPassword.addEventListener('submit', e => {
    e.preventDefault();
    const email = forgotPassword.email.value.toLowerCase();

    fetch('/api/sessions/forgotPassword', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
        .catch(function (err) {
            console.info(err + " url: " + url);
        });
}
)
