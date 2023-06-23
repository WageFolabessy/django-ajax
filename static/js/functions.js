const handleAlert = (type, message) => {
    alertBox.innerHTML = `
    <div class="alert alert-${type}" role="alert">
        ${message}
    </div>
    `
}