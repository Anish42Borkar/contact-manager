import { constants } from "../constant.js";
import asyncHandler from "express-async-handler";
import Contact from "../models/contactModel.js";

// @desc get contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
  // req.user : is comming from token validator middleware
  console.log(req, " #####id");
  const contactsList = await Contact.find({
    user_id: req.user.id,
  });
  res.status(200).json(contactsList);
});

// @desc create contacts
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory !");
  }

  const user_id = req.user.id;

  const addContact = await Contact.create({ name, email, phone, user_id });
  res.status(201).json(addContact);
});

// @desc get contact
// @route GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const findContact = await Contact.findById(id);
  if (!findContact) {
    res.status(404);
    throw new Error("No record found");
  }
  res.status(200).json(findContact);
});

// @desc update contact
// @route PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const findContact = await Contact.findById(id);
  if (!findContact) {
    res.status(404);
    throw new Error("No record found");
  }

  if (findContact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user don`t have permission");
  }

  const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json(contact);
});

// @desc delete contact
// @route DELEET /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const findContact = await Contact.findById(id);
  if (!findContact) {
    res.status(404);
    throw new Error("No record found");
  }

  if (findContact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user don`t have permission");
  }

  const contact = await Contact.deleteOne({ _id: id });

  res.status(200).json(contact);
});

export { getContacts, getContact, createContact, updateContact, deleteContact };
