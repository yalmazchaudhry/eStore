const express = require("express");

const productsController = require("../controllers/productsController");
const authMiddleware = require("../middlewares/is-Auth");
const upload = require("../helpers/upload");

const router = express.Router();

router.get(
  "/products",
  authMiddleware.verifyLogin,
  productsController.getProducts
);

// router.get(
//   "/productsLazy",
//   authMiddleware.verifyLogin,
//   productsController.getProductsLazy
// );

router.post(
  "/add-product",
  authMiddleware.verifyLogin,
  upload.single("file"),
  productsController.addProduct
);
router.put(
  "/edit-product/:id",
  authMiddleware.verifyLogin,
  upload.single("file"),
  productsController.editProduct
);
router.post(
  "/import-products/:id",
  authMiddleware.verifyLogin,
  upload.none(),
  productsController.importProducts
);
router.delete(
  "/delete-product/:id",
  authMiddleware.verifyLogin,
  productsController.deleteProduct
);

module.exports = router;
