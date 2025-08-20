import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// Forzamos la colección 'products' (evita problemas de pluralización)
export default mongoose.model('Product', productSchema, 'products');
