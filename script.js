const API_URL = "https://67f0f3dcc733555e24abb7bb.mockapi.io/todo/todoo";
const form = document.querySelector(".searchers");
const nameInput = document.getElementById("name");
const numberInput = document.getElementById("number");
const contactList = document.getElementById("contact-list");

function showLoading(isLoading) {
  const loadingIndicator = document.createElement("div");
  loadingIndicator.classList.add("loading");
  loadingIndicator.textContent = "Kuting iltimos...";

  if (isLoading) {
    contactList.innerHTML = "";
    contactList.appendChild(loadingIndicator);
  } else {
    const loadingElem = document.querySelector(".loading");
    if (loadingElem) loadingElem.remove();
  }
}

async function fetchContacts() {
  showLoading(true);

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();
    contactList.innerHTML = "";

    if (data.length === 0) {
      contactList.innerHTML = "<p>No contacts found.</p>";
    } else {
      data.forEach((contact) => addContactToList(contact));
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
    alert("Xatolik yuz berdi. Kontaktlarni olish imkoni bo'lmadi.");
  } finally {
    showLoading(false);
  }
}

function addContactToList(contact) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <h2>Name: ${contact.name}</h2>
    <h3>Number: ${contact.number}</h3>
    <button class="delete" data-id="${contact.id}">❌ Delete</button>
  `;

  contactList.appendChild(card);

  const deleteButton = card.querySelector(".delete");
  deleteButton.addEventListener("click", async () => {
    await deleteContact(contact.id, card);
  });
}

async function deleteContact(id, card) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }

    card.remove();
    alert("Kontakt o'chirildi.");
  } catch (error) {
    console.error("Error deleting contact:", error);
    alert("Kontaktni o'chirishda xatolik yuz berdi.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const number = numberInput.value.trim();

  if (!name || !number) {
    alert("Iltimos, ism va raqam kiriting.");
    return;
  }

  const newContact = { name, number: number };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });

    if (!response.ok) {
      throw new Error("Failed to add contact");
    }

    const contact = await response.json();
    addContactToList(contact);
    form.reset();
    alert("Kontakt qo‘shildi!");
  } catch (error) {
    console.error("Error adding contact:", error);
    alert("Kontakt qo‘shishda xatolik yuz berdi.");
  }
});

fetchContacts();
