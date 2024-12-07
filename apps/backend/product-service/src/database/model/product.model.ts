import mongoose, { Schema } from "mongoose";

export interface Productions {
  _id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Customers {
  _id?: string;
  name: string;
  contact: string; //phone
  email: string;
  loyaltyPoint?: number; //0-100
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Sales {
  _id?: string;
  customerId: mongoose.Schema.Types.ObjectId | string; //Customers
  product: Productions[];
  totalQuantity: number;
  totalPrice: number; //total
  createdAt?: Date; //sale date
  updatedAt?: Date;
}

//productions schema
const ProductionsSchema = new Schema<Productions>(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    barcode: { type: String },
    description: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const ProductionModel = mongoose.model<Productions>(
  "Production",
  ProductionsSchema
);
export { ProductionModel };
//customer schema
const CustomersSchema = new Schema<Customers>(
  {
    name: { type: String, required: true },
    contact: { type: String },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    loyaltyPoint: { type: Number, default: 0 },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const CustomerModel = mongoose.model<Customers>("Customer", CustomersSchema);
export { CustomerModel };
//Sales Schema
const SalesSchema = new Schema<Sales>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    product: {
      type: [ProductionsSchema],
      required: true,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const SaleModel = mongoose.model<Sales>("Sale", SalesSchema);
export { SaleModel };
