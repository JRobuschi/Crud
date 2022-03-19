const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {

		// Obtener listado de productos y FILTRARLOS por categoría
		// Productos con categoría in sale y visited

		const inSaleProducts = products.filter((product) => product.category === 'in-sale');
		const visitedProducts = products.filter((product) => product.category === 'visited');


		// Paso los datos a la vista
		// Segundo parametro datos a enviar a la vista
		return res.render('index', { inSaleProducts, visitedProducts })



	},
	search: (req, res) => {
		// Do the magic
	},
};

module.exports = controller;
