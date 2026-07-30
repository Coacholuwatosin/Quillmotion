/**
 * No backend involved in sending messages. The form builds a prefilled
 * mailto: / WhatsApp (wa.me) link from the visitor's input, then lets them
 * pick which app sends it. Fill in your real email/phone below.
 */
const OWNER_EMAIL = "quillmotion@gmail.com";
const OWNER_WHATSAPP = "10000000000"; // country code + number, digits only, no +/spaces

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const sendOptions = document.getElementById("sendOptions");
  const successMsg = document.getElementById("contactSuccess");
  const emailBtn = document.getElementById("sendEmailBtn");
  const whatsappBtn = document.getElementById("sendWhatsappBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = {
      name: form.name.value.trim(),
      contactMethod: form.contactMethod.value.trim(),
      projectType: form.projectType.value,
      message: form.message.value.trim(),
    };

    if (!validate(form, fields)) {
      sendOptions.classList.remove("is-visible");
      successMsg.classList.remove("is-visible");
      return;
    }

    const bodyText =
      `New inquiry from ${fields.name}\n` +
      `Contact: ${fields.contactMethod}\n` +
      `Project type: ${fields.projectType}\n\n` +
      `${fields.message}`;

    emailBtn.href =
      `mailto:${OWNER_EMAIL}` +
      `?subject=${encodeURIComponent("New project inquiry: " + fields.projectType)}` +
      `&body=${encodeURIComponent(bodyText)}`;

    whatsappBtn.href = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(bodyText)}`;
    whatsappBtn.target = "_blank";
    whatsappBtn.rel = "noopener";

    sendOptions.classList.add("is-visible");
    successMsg.classList.add("is-visible");
  });
});

function validate(form, fields) {
  let isValid = true;

  toggleError(form.name.closest(".form-group"), !fields.name);
  if (!fields.name) isValid = false;

  const hasContact = fields.contactMethod.length > 3;
  toggleError(form.contactMethod.closest(".form-group"), !hasContact);
  if (!hasContact) isValid = false;

  const hasMessage = fields.message.length > 5;
  toggleError(form.message.closest(".form-group"), !hasMessage);
  if (!hasMessage) isValid = false;

  return isValid;
}

function toggleError(group, hasError) {
  group.classList.toggle("has-error", hasError);
}
