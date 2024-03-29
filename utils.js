import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let idUser = req.user._id;
    let userPath = `public/uploads/${idUser}`;
    let userProfilePath = `public/uploads/${idUser}/profiles`;
    let userProfileFotoPath = `public/uploads/${idUser}/profiles/fotoPerfil`;
    let userProfileDniFrentePath = `public/uploads/${idUser}/profiles/DniFrente`;
    let userProfileDniDorsoPath = `public/uploads/${idUser}/profiles/DniDorso`;
    let uploadPath = "";
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userProfilePath, { recursive: true });
      fs.mkdirSync(userProfileFotoPath);
      fs.mkdirSync(userProfileDniFrentePath);
      fs.mkdirSync(userProfileDniDorsoPath);
    }
    if (file.fieldname === "fotoPerfil") {
      uploadPath = userProfileFotoPath;
    }
    if (file.fieldname === "dniFrente") {
      uploadPath = userProfileDniFrentePath;
    }
    if (file.fieldname === "dniDorso") {
      uploadPath = userProfileDniDorsoPath;
    }

    cb(null, path.join(__dirname, uploadPath));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploader = multer({
  storage,
  onError: function (err, next) {
    console.log(err);
    next();
  },
});

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

export const calcularTotalProductosCarrrito = (cart) => {
  return parseInt(
    cart.products.reduce(
      (acc, product) => acc + product.quantity * product.product.price,
      0
    )
  );
};

export const generateProducts = (numOfProducts) => {
  let products = [];
  for (let i = 0; i < numOfProducts; i++) {
    products.push(gereateProduct());
  }
  return products;
};

export const gereateProduct = () => {
  return {
    ObjectId: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.urlLoremFlickr(),
    code: faker.number.int({ min: 1, max: 999 }),
    stock: faker.number.int({ min: 10, max: 500 }),
    status: true,
    category: faker.commerce.department(),
  };
};

export const generateRandomCode = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

export default __dirname;
