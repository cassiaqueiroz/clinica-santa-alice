class FormSubmit {
  constructor(settings) {
    this.settings = settings;
    this.forms = document.querySelectorAll(settings.form);
    if (this.forms.length) {
      this.init();
    }
  }

  getFormObject(form) {
    const formObject = {};
    const fields = form.querySelectorAll("[name]");
    fields.forEach((field) => {
      formObject[field.getAttribute("name")] = field.value.trim();
    });
    return formObject;
  }

  validateFields(form) {
    let isValid = true;
    const fields = form.querySelectorAll("[name]");

    fields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("error");
        isValid = false;
      } else {
        field.classList.remove("error");
      }

      // Email validation
      if (field.getAttribute("name") === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          field.classList.add("error");
          isValid = false;
        } else {
          field.classList.remove("error");
        }
      }
    });

    return isValid;
  }

  async sendForm(event) {
    event.preventDefault(); // Prevents the default form submission and page redirect
    const form = event.target;
    const button = form.querySelector(this.settings.button);

    // Validate fields before sending (optional step, you can remove if not necessary)
    if (!this.validateFields(form)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    button.disabled = true; // Disable the button to prevent multiple submissions
    button.innerText = "Enviando..."; // Change button text to "Enviando..."

    try {
      // Use the formsubmit.co URL as the action
      const url = "https://formsubmit.co/ouvidoria@clinicasantaalicerj.com.br?redirect=confirmation-page.html";

      // Send a POST request to formsubmit.co
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(this.getFormObject(form)).toString(),
      });

      // Redirect to the confirmation page after submission
      if (response.ok) {
        window.location.href = "confirmation-page.html"; // Redirect to the confirmation page
      } else {
        // If needed, you could handle failure here, but for now we are skipping this
        console.error("Erro ao enviar:", response);
      }
    } catch (error) {
      console.error("Erro ao enviar:", error); // Handle any fetch errors
    } finally {
      button.disabled = false; // Enable the button again after submission attempt
      button.innerText = "Enviar"; // Reset button text
    }
  }

  init() {
    this.forms.forEach((form) => {
      // When the form is submitted, the sendForm function is triggered
      form.addEventListener("submit", (event) => this.sendForm(event));
    });
  }
}

// Initialize the FormSubmit class with the configuration parameters
const formSubmitInstance = new FormSubmit({
  form: "[data-form]",  // Selector for the form
  button: "[data-button]",  // Selector for the submit button
});
