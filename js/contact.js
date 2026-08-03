/**
 * No backend involved in sending messages. On a valid submit, the button
 * morphs from "Send Message" into "Send via Email" and opens a prefilled
 * mailto: link so the visitor sends it from their own email app. Fill in
 * your real email below.
 *
 * WhatsApp sending was removed for now (no number set up yet). To bring it
 * back: add a WHATSAPP_NUMBER constant and open
 * `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bodyText)}`
 * the same way the mailto link is opened in openMailClient() below.
 */
const OWNER_EMAIL = "quillmotion@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("contactSuccess");
  const submitBtn = document.getElementById("submitBtn");
  const submitBtnContent = document.getElementById("submitBtnContent");
  let isReady = false;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (isReady) {
      openMailClient(buildMailtoLink(form));
      return;
    }

    const fields = readFields(form);
    if (!validate(form, fields)) {
      successMsg.classList.remove("is-visible");
      return;
    }

    isReady = true;
    morphButton(submitBtn, submitBtnContent);
    openMailClient(buildMailtoLink(form));
    successMsg.classList.add("is-visible");
  });
});

function readFields(form) {
  return {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    projectType: form.projectType.value,
    country: form.country.value.trim(),
    referrer: form.referrer.value,
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
  };
}

function buildMailtoLink(form) {
  const fields = readFields(form);
  const lines = [`New inquiry from ${fields.name}`, `Email: ${fields.email}`, `Service: ${fields.projectType}`];

  if (fields.country) lines.push(`Country: ${fields.country}`);
  if (fields.phone) lines.push(`Phone / WhatsApp: ${fields.phone}`);
  if (fields.referrer) lines.push(`Found us via: ${fields.referrer}`);
  lines.push("", fields.message);

  const bodyText = lines.join("\n");

  return (
    `mailto:${OWNER_EMAIL}` +
    `?subject=${encodeURIComponent("New project inquiry: " + fields.projectType)}` +
    `&body=${encodeURIComponent(bodyText)}`
  );
}

function openMailClient(mailtoLink) {
  window.location.href = mailtoLink;
}

function morphButton(submitBtn, content) {
  content.classList.add("is-morphing");
  setTimeout(() => {
    content.innerHTML =
      "Send via Email" +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4zM4 6l8 7 8-7"/></svg>';
    content.classList.remove("is-morphing");
    submitBtn.classList.add("is-ready");
  }, 200);
}

function validate(form, fields) {
  let isValid = true;

  toggleError(form.name.closest(".form-group"), !fields.name);
  if (!fields.name) isValid = false;

  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email);
  toggleError(form.email.closest(".form-group"), !hasValidEmail);
  if (!hasValidEmail) isValid = false;

  const hasService = Boolean(fields.projectType);
  toggleError(form.projectType.closest(".form-group"), !hasService);
  if (!hasService) isValid = false;

  const hasMessage = fields.message.length > 5;
  toggleError(form.message.closest(".form-group"), !hasMessage);
  if (!hasMessage) isValid = false;

  return isValid;
}

function toggleError(group, hasError) {
  group.classList.toggle("has-error", hasError);
}
