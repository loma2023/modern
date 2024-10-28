const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const ModernSchema = new Schema({
  Username: String,
  Phone: String,
  Email: String,
  Address: String,
  Password: String,
  VoiceMessage: String,
  Notifications: String,
  DarkMood: String,

  NameCompany: String,
  TypeCompany: String,
  LogoCompany: String,
  CityCompany: String,
  AddressCompany: String,
  PhoneCompany1: String,
  PhoneCompany2: String,

  Plan: String,
  ActivedAt: Date,
  PaymentWay: String,
  CreatedAt: Date,
  UpdatedAt: { type: Date, default: Date.now },

  //  Notifications Array
  NotificationsData: [{
    Username: String,
    Text: String,
    Icon: String,
    ReadBy: [{ User: String }],
    CreatedAt: Date,
  },],
  //  Users Array
  UsersData: [{
    Username: String,
    Email: String,
    Phone: String,
    Address: String,
    Password: String,
    Permissions: Array,
    CreatedAt: Date,
    VoiceMessage: String,
    Notifications: String,
    DarkMood: String,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],
  //  Customers Array
  CustomersData: [{
    Name: String,
    City: String,
    Address: String,
    Phone: String,
    Balance: Number,
    BalanceType: String,
    CreatedBy: String,
    CreatedAt: Date,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],
  //  Time Customers Array
  TimeCustomersData: [{
    Name: String,
    DocDate: String,
    Statment: String,
    Total: Number,
    CreatedBy: String,
    CreatedAt: Date,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],
  //  Suppliers Array
  SuppliersData: [{
    Name: String,
    City: String,
    Address: String,
    Phone: String,
    Balance: Number,
    BalanceType: String,
    CreatedBy: String,
    CreatedAt: Date,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],
  //  Time Customers Array
  TimeSuppliersData: [{
    Name: String,
    DocDate: String,
    Statment: String,
    Total: Number,
    CreatedBy: String,
    CreatedAt: Date,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],
  //  Revenues Array
  RevenuesData: [{
    Name: String,
    Type: String,
    AmountType: String,
    Amount: Number,
    CreatedBy: String,
    CreatedAt: Date,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],
  //  Expenses Array
  ExpensesData: [{
    Name: String,
    Type: String,
    AmountType: String,
    Amount: Number,
    CreatedBy: String,
    CreatedAt: Date,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],
  //  Products Array
  ProductsData: [{
    Name: String,
    Barcode: String,
    MinQty: Number,
    Balance: Number,
    Units: Array,
    CreatedBy: String,
    CreatedAt: Date,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],
  //  General Array 
  GeneralData: [{
    DocNu: String,
    DocType: String,
    DocDate: String,
    Name: String,
    Statment: String,
    Debit: String,
    Credit: String,
    SubDebit: String,
    SubCredit: String,
    Total: Number,
    // تفاصيل الفاتورة *******
    TypeAmount: String,
    SubTotal: Number,
    Discount: Number,
    Products: Array,
    CreatedBy: String,
    CreatedAt: Date,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],
});

ModernSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

const ModernUser = mongoose.model("ModernUser", ModernSchema);
module.exports = ModernUser;