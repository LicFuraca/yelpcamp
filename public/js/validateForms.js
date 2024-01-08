const { default: bsCustomFileInput } = require('bs-custom-file-input')

;(function () {
    'use strict'

    bsCustomFileInput.init()

    var forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(function (form) {
        form.addEventListener(
            'submit',
            function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            },
            false
        )
    })
})()
