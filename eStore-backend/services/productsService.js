const productsRepository = require("../database/productsRepository");

class ProductsService {
  static getProducts = (req, res, next) => {
    const { userId, pageSize, search, sortDirection, sortColumn } = req.query;
    let { pageNumber } = req.query;
    const offset = parseInt(pageNumber, 10) * parseInt(pageSize, 10);
    const limit = parseInt(pageSize);
    return new Promise((resolve, rej) => {
      productsRepository
        .getProducts(userId, offset, limit, search, sortDirection, sortColumn)
        .then((products) => {
          resolve(products);
        })
        .catch((err) => {
          console.log(err);
          rej(err);
        });
    });
  };
  static addProduct = (req, res, next) => {
    const { name, barcode, price, quantity, user_id, description } = req.body;
    return new Promise((resolve, rej) => {
      productsRepository
        .addProduct({
          image: "http://localhost:8080/uploads/" + req.file.filename,
          name,
          barcode,
          price,
          quantity,
          user_id,
          description,
        })
        .then((message) => {
          resolve(message);
        })
        .catch((err) => {
          rej(err);
        });
    });
  };
  static editProduct(req, res, next) {
    const { name, barcode, price, quantity, user_id, description } = req.body;
    const id = req.params.id;
    console.log(id, req.body);
    return new Promise((resolve, reject) => {
      productsRepository
        .editProduct(id, {
          ...(req.file && {
            image: "http://localhost:8080/uploads/" + req.file.filename,
          }),
          name,
          barcode,
          price,
          quantity,
          user_id,
          description,
        })
        .then((message) => {
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
  static deleteProduct(id) {
    return new Promise((resolve, reject) => {
      productsRepository
        .deleteProduct(id)
        .then((message) => {
          console.log(message);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static importProducts(req, res, next) {
    const data = req.body;
    const promises = [];
    for (let i = 0; i < data.length; i++) {
      const productData = data[i];
      const product = {
        name: productData.Name,
        barcode: productData.Barcode,
        price: productData.Price,
        quantity: productData.Quantity,
        description: productData.Description,
        user_id: req.params.id,
      };

      const promise = productsRepository.addProduct(product);
      promises.push(promise);
    }
    return new Promise((resolve, rej) => {
      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log(error);
          rej(error);
        });
    });
  }
}
module.exports = ProductsService;
