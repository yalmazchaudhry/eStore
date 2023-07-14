const productsService = require("../services/productsService");

class ProductsController {
  getProducts = (req, res, next) => {
    productsService
      .getProducts(req, res, next)
      .then((response) => {
        res.status(200).json(
          response
          // products: response.products,
          // totalCount: response.totalCount,
        );
      })
      .catch((err) => {
        res.status(403).json({ error: err });
      });
  };
  addProduct = (req, res, next) => {
    productsService
      .addProduct(req, res, next)
      .then((message) => {
        res.status(200).json({ message: "Product created!" });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  };
  editProduct = (req, res, next) => {
    productsService
      .editProduct(req, res, next)
      .then(() => {
        res.status(200).json({ message: "Product updated!" });
      })
      .catch((err) => {
        res.status(403).json({ error: err });
      });
  };
  deleteProduct = (req, res, next) => {
    productsService
      .deleteProduct(req.params.id)
      .then(() => {
        res.status(200).json({ message: "Product deleted!" });
      })
      .catch((err) => {
        res.status(403).json({ error: err });
      });
  };
  importProducts = (req, res, next) => {
    productsService
      .importProducts(req, res, next)
      .then((message) => {
        res.status(200).json({ message: "Products imported!" });
      })
      .catch((err) => {
        res.status(403).json({ error: err });
      });
  };
}

module.exports = new ProductsController();
