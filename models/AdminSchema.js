const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const AdminSchema = new Schema({
  Username: String,
  Phone: String,
  Email: String,
  Address: String,
  Password: String,
  VoiceMessage: { type: String, default: "false" },
  Notifications: { type: String, default: "true" },
  DarkMood: { type: String, default: "false" },

  NameCompany: String,
  TypeCompany: String,
  LogoCompany: { data: Buffer, contentType: String },
  CityCompany: String,
  AddressCompany: String,
  PhoneCompany1: String,
  PhoneCompany2: String,

  CreatedAt: Date,
  UpdatedAt: { type: Date, default: Date.now },

  //  GeneralData Array
  GeneralData: [{
    DocDate: String,
    Name: String,
    Plan: String,
    PaymentWay: String,
    Total: Number,
    System: String,
    CreatedAt: Date,
    UpdatedAt: { type: Date, default: Date.now },
  },],

  //  Notifications Array
  NotificationsData: [{
    Username: String,
    Text: String,
    Icon: String,
    ReadBy: [{ User: String }],
    CreatedAt: Date,
  },],

  //  Messages Array
  MessagesData: [{
    Name: String,
    Email: String,
    Message: String,
    System: String,
    CreatedAt: Date,
  },],

});

AdminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;