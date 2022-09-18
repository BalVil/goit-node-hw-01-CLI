const fs = require('fs').promises;
const path = require('path');

const absolutePath = path.join(__dirname, 'db/contacts.json');

const updateContactList = async contacts =>
  await fs.writeFile(absolutePath, JSON.stringify(contacts, null, 2));

async function listContacts() {
  try {
    const data = await fs.readFile(absolutePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read file', error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();

    //з yargs треба: const contactId = String(id);
    const contact = contacts.find(contact => contact.id === contactId);
    return contact || null;
  } catch (error) {
    console.error('Failed to read contact', error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    let idx = contacts.findIndex(user => user.id === contactId);
    if (idx === -1) {
      return null;
    }

    const [removedContact] = contacts.splice(idx, 1);
    await updateContactList(contacts);

    return removedContact;
  } catch (error) {
    console.error('Failed to remove contact', error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();

    const lastContactId = contacts[contacts.length - 1]?.id;
    const id = contacts.length ? (Number(lastContactId) + 1).toString() : '1';

    const newContact = { id, name, email, phone };

    contacts.push(newContact);
    await updateContactList(contacts);

    return newContact;
  } catch (error) {
    console.error('Failed to add contact', error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
