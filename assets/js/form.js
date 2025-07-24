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
      
      const url = "https://formsubmit.co/ouvidoria@clinicasantaalicerj.com.br?redirect=confirmation-page.html";

      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(this.getFormObject(form)).toString(),
      });

      
      if (response.ok) {
        window.location.href = "confirmation-page.html";
      } else {
        
        console.error("Erro ao enviar:", response);
      }
    } catch (error) {
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

//
const formSubmitInstance = new FormSubmit({
  form: "[data-form]",
  button: "[data-button]",
});
