class FormSubmit {
  constructor(settings) {
    this.settings = settings;
    this.forms = document.querySelectorAll(settings.form);
    if (this.forms.length) {
      this.init();
    }
  }

  displayMessage(form, message, type) {
    // Creating a message container within the form without affecting the entire page
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(type === "success" ? "success-message" : "error-message");
    messageDiv.innerText = message;

    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    setTimeout(() => {
      messageDiv.remove();
    }, 4000); // Message disappears after 4 seconds
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

    if (!this.validateFields(form)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    button.disabled = true;
    button.innerText = "Enviando...";

    try {
      const url = form.getAttribute("action");

      // Send a POST request without causing a page redirect
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(this.getFormObject(form)).toString(),
      });

      const responseText = await response.text();
      console.log("Resposta do servidor:", responseText); // Verifies if something strange is returned

      if (response.ok) {
        // Display success message in the form
        this.displayMessage(form, this.settings.success, "success");
        form.reset(); // Reset the form after submission
        this.reloadFormSection(form); // Reload the form section without affecting the entire page
      } else {
        // Display error message
        this.displayMessage(form, this.settings.error, "error");
      }
    } catch (error) {
      // Display error message if the request fails
      this.displayMessage(form, this.settings.error, "error");
      console.error("Erro ao enviar:", error);
    } finally {
      button.disabled = false;
      button.innerText = "Enviar";
    }
  }

  reloadFormSection(form) {
    // Reload the form section without reloading the entire page
    const section = form.closest(".form-section"); // Ensure the form is inside a section with the `.form-section` class
    if (section) {
      // Clear the section's content
      section.innerHTML = "";

      // Clone the form and add it back to the section
      const formClone = form.cloneNode(true); // Clone the form
      section.appendChild(formClone); // Append the cloned form back to the section
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
  form: "[data-form]",
  button: "[data-button]",
  success: "Sua mensagem foi enviada com sucesso!",
  error: "Não foi possível enviar sua mensagem. Tente novamente.",
});
