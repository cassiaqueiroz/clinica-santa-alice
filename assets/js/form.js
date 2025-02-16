class FormSubmit {
  constructor(settings) {
    this.settings = settings;
    this.forms = document.querySelectorAll(settings.form);
    if (this.forms.length) {
      this.init();
    }
  }

  displayMessage(form, message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(type === "success" ? "success-message" : "error-message");
    messageDiv.innerText = message;

    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    setTimeout(() => {
      messageDiv.remove();
    }, 4000);
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
    event.preventDefault();
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
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(this.getFormObject(form)).toString(),
      });

      const responseText = await response.text();
      console.log("Resposta do servidor:", responseText); // Verifica se algo estranho está sendo retornado

      if (response.ok) {
        this.displayMessage(form, this.settings.success, "success");
        form.reset();
      } else {
        this.displayMessage(form, this.settings.error, "error");
      }
    } catch (error) {
      this.displayMessage(form, this.settings.error, "error");
      console.error("Erro ao enviar:", error);
    } finally {
      button.disabled = false;
      button.innerText = "Enviar";
    }
  }

  init() {
    this.forms.forEach((form) => {
      form.addEventListener("submit", (event) => this.sendForm(event));
    });
  }
}

// eslint-disable-next-line no-new
new FormSubmit({
  form: "[data-form]",
  button: "[data-button]",
  success: "Sua mensagem foi enviada com sucesso!",
  error: "Não foi possível enviar sua mensagem. Tente novamente.",
});
