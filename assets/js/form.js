class FormSubmit {
  constructor(settings) {
    this.settings = settings;
    this.form = document.querySelector(settings.form);
    this.formButton = document.querySelector(settings.button);
    if (this.form) {
      this.url = this.form.getAttribute("action");
    }
    this.sendForm = this.sendForm.bind(this);
  }

  displaySuccess() {
    const successMessage = document.createElement("div");
    successMessage.classList.add("success-message");
    successMessage.innerText = this.settings.success;
    this.form.parentNode.insertBefore(successMessage, this.form.nextSibling);
  }

  displayError() {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.innerText = this.settings.error;
    this.form.parentNode.insertBefore(errorMessage, this.form.nextSibling);
  }

  getFormObject() {
    const formObject = {};
    const fields = this.form.querySelectorAll("[name]");
    fields.forEach((field) => {
      formObject[field.getAttribute("name")] = field.value.trim();
    });
    return formObject;
  }

  validateFields() {
    let isValid = true;
    const fields = this.form.querySelectorAll("[name]");

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

  onSubmission(event) {
    event.preventDefault();
    this.formButton.disabled = true;
    this.formButton.innerText = "Enviando...";
  }

  async sendForm(event) {
    try {
      if (!this.validateFields()) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
      }
      this.onSubmission(event);
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(this.getFormObject()).toString(),
      });

      if (response.ok) {
        this.displaySuccess();
      } else {
        this.displayError();
      }
    } catch (error) {
      this.displayError();
      console.error("Erro ao enviar:", error);
    } finally {
      this.formButton.disabled = false;
      this.formButton.innerText = "Agendar";
    }
  }

  init() {
    if (this.form) {
      this.formButton.addEventListener("click", this.sendForm);
    }
    return this;
  }
}

const formSubmit = new FormSubmit({
  form: "[data-form]",
  button: "[data-button]",
  success: "Sua mensagem foi enviada com sucesso!",
  error: "Não foi possível enviar sua mensagem. Tente novamente.",
});
formSubmit.init();