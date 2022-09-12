const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
// by default: const uuid = crypto.randomUUID();
// const uuid = crypto.randomBytes(10).toString("hex");

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read file", error.message);
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contact = contacts.find((contact) => contact.id === `${contactId}`);

    if (!contact) {
      return "No contact found";
    }

    return contact;
  } catch (error) {
    console.error("Failed to read contact", error.message);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    let match = contacts.findIndex((contact) => contact.id === contactId);
    if (match < 0) {
      return "No contact found";
    }

    const contact = contacts.splice(match, 1);
    fs.writeFile(contactsPath, JSON.stringify(contacts));

    return contact;
  } catch (error) {
    console.error("Failed to remove contact", error);
  }
}

async function addContact(name, email, phone) {
  try {
    //   const contacts = await listContacts();
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);

    const lastContactId = contacts[contacts.length - 1]?.id;
    const newContactId = !contacts.length
      ? "1"
      : (Number(lastContactId) + 1).toString();

    // const uuid = crypto.randomBytes(10).toString("hex");

    contacts.push({ id: newContactId, name, email, phone });
    fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts;
  } catch (error) {
    console.error("Failed to add contact", error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
