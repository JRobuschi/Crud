const fs = require('fs');
const path = require('path');
const { measureMemory } = require('vm');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {products})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		
		const idToFind = req.params.id
		const product = products.find ( p =>  p.id == idToFind )
		const discounted = Math.round(product.price - (product.price * product.discount) / 100)
		
		return res.render ('detail', { product,discounted })
	},

	// Create - Form to create
	create: (req, res) => {
		const idToFind = req.params.id
		const product = products.find ( p =>  p.id == idToFind )
		return res.render ('product-create-form', {product})
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const newProduct =  req.body;
		const newProductImage = req.file;
	
		if (req.file && newProductImage.size < 3145728) {
			
		controller.createNewProduct(newProduct,newProductImage)	
		
		products.push (newProduct)

		controller.dbReWrite()

		res.redirect ('/products')

	} else if (req.file && newProductImage.size > 3145729) {
		res.send('El archivo es demasiado pesado')
	} else {
		res.send ('No adjuntaste ninguna imagen')
	}
	},

	// Update - Form to edit
	edit: (req, res) => {
		const idToFind = req.params.id
		const product = products.find ( p =>  p.id == idToFind )
		
		return res.render ('product-edit-form', {product})
	},
	// Update - Method to update
	update: (req, res) => {
		
				const idToFind = req.params.id
				const productIndex = products.findIndex(product => product.id == idToFind )
				const editedProduct = req.body;
		
				products[productIndex].name = editedProduct.name;
				products[productIndex].price = Number(editedProduct.price);
				products[productIndex].discount = Number(editedProduct.discount);
				if (req.body.category == '') {
					products[productIndex].category = products[productIndex].category;
				}else{
					products[productIndex].category = editedProduct.category
				}
				products[productIndex].description = editedProduct.description;
				if (req.file) {
				products[productIndex].image = req.file.filename;
				}
				controller.dbReWrite()
		
		return res.redirect('/products')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		
		const idToFind = req.params.id
		const deletedProducts = products.filter ( p =>  p.id != idToFind )
		
		fs.writeFileSync(productsFilePath, JSON.stringify(deletedProducts, null, 2))
		return res.redirect('/products')
	
		//return res.redirect('/products') 
	},
	dbReWrite() { 
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))
	},
	createNewProduct: function (newProduct,newProductImage) {

		newProduct.id = controller.asignIdToProduct();
		newProduct.price = Number(newProduct.price);
		newProduct.image = newProductImage.filename;
		
		if (newProduct.discount == '') {
			newProduct.discount = 0
		} else {
			newProduct.discount = Number(newProduct.discount)
		}
	},
	asignIdToProduct: function () {
		return products[products.length -1].id +1;
	}
};

module.exports = controller;