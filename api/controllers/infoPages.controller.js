import { ImportantContacts, PostOrders } from '../models/infoPages.model.js';

export const importantContacts = async (req, res, next) => {
  const { content } = req.body;
  try {
    let contact = await ImportantContacts.findOne();
    if (!contact) {
      contact = new ImportantContacts({ content });
    } else {
      contact.content = content;
    }
    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const getImportantContacts = async (req, res, next) => {
  try {
    const contact = await ImportantContacts.findOne();
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const postOrders = async (req, res, next) => {
  const { content } = req.body;
  try {
    let orders = await PostOrders.findOne();
    if (!orders) {
      orders = new PostOrders({ content });
    } else {
      orders.content = content;
    }
    await orders.save();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getPostOrders = async (req, res, next) => {
  try {
    const orders = await PostOrders.findOne();
    res.status(200).json(orders);
  } catch {
    next(error);
  }
};
