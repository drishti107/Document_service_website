const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const modal = document.getElementById('serviceModal');
const modalTitle = document.getElementById('modalTitle');
const modalDocs = document.getElementById('modalDocs');
const serviceSelect = document.getElementById('serviceSelect');
let selectedService = '';

document.querySelectorAll('.service-card').forEach((card) => {
  card.querySelector('.service-select').addEventListener('click', () => {
    selectedService = card.dataset.service;
    modalTitle.textContent = selectedService;
    modalDocs.textContent = card.dataset.docs;
    modal.showModal();
  });
});

function closeModal() {
  modal.close();
}

document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('.modal-close-secondary').addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  const rect = modal.getBoundingClientRect();
  const isInside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;
  if (!isInside) closeModal();
});

document.querySelector('.modal-request').addEventListener('click', () => {
  serviceSelect.value = selectedService;
  closeModal();
  document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
});

const form = document.getElementById('serviceForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (event) => {
  const action = form.getAttribute('action');

  if (action.includes('YOUR_FORM_ID')) {
    event.preventDefault();
    formStatus.textContent = 'Please add your Formspree form ID in index.html before using this form.';
    formStatus.style.color = '#b54708';
    return;
  }

  event.preventDefault();
  formStatus.textContent = 'Submitting your request...';
  formStatus.style.color = '#155eef';

  try {
    const response = await fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Form submission failed');

    form.reset();
    formStatus.textContent = 'Your request has been submitted successfully.';
    formStatus.style.color = '#087a68';
  } catch (error) {
    formStatus.textContent = 'Unable to submit right now. Please contact us by phone or WhatsApp.';
    formStatus.style.color = '#b42318';
  }
});
