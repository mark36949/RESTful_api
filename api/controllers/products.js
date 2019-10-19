const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = (req,res,next) => {
	// res.status(200).json({
	// 	message: 'Handling GET requests to /products'
	// });
	Product.find()
		.select('name price _id productImage')
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				products: docs.map(doc =>{
					return {
						name: doc.name,
						price: doc.price,
						_id: doc._id,
						productImage: doc.productImage,
						request: {
							type: 'GET',
							url: 'http://localhost:8080/products/'+ doc._id
						}
					}
				})
			}
			console.log(docs);
			// if(docs.length >=0){
				res.status(200).json(response);
			// }else{
			// 	res.status(404).json({
			// 		message: 'No entries found'
			// 	})
			// }
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

exports.products_create_product = (req,res,next)=> {
	// const product = {
	// 	name: req.body.name,
	// 	price: req.body.price
	// };
	console.log(req.file)

	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	})

	product
		.save()
		.then(result =>{
			console.log(result);
			res.status(201).json({
				message: "Created product successfully",
				createdProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://localhost:8080/products/'+ result._id
					}
				}
			});
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({error: err});
		});
}

exports.products_get_product = (req,res,next)=> {
	const id = req.params.productId;
	// if (id === 'special') {
	// 	res.status(200).json({
	// 		message: 'You discovered the special ID',
	// 		id: id
	// 	})
	// }else{
	// 	res.status(200).json({
	// 		message: 'You passed an ID'
	// 	});
	// }
	Product.findById(id)
		.select('name price _id productImage')
		.exec()
		.then(doc =>{
			console.log("From database",doc);
			if(doc){
				res.status(200).json({
					product: doc,
					request:{
						type: 'GET',
						description: 'Get all products',
						url: 'http://localhost:8080/products'
					}
				})
			}else{
				res.status(404).json({message: 'No valid entry found for provided ID'});
			}
			
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({error: err});
		});
}

exports.products_update_product = (req,res,next)=> {
	// res.status(200).json({
	// 	message: 'Updated product!'
	// });
	const id = req.params.productId;
	const updateOps = {};

	for(const ops of req.body){
		updateOps[ops.propName] = ops.value;
	}

	Product.update({_id:id},{ $set: updateOps})
		.exec()
		.then(result =>{
			console.log(result);
			res.status(200).json({
				message: 'Product updated',
				request:{
					type:'GET',
					url: 'http://localhost:8080/products/'+ id
				}
			});
		})
		.catch(err => {
			console.log(err);
		})
}

exports.products_delete_product =(req,res,next)=> {
	// res.status(200).json({
	// 	message: 'Delete product!'
	// });
	const id = req.params.productId;
	Product.remove({_id:id})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product deleted',
				request: {
					type:'POST',
					url: 'http://localhost:8080/products',
					data: {
						name: 'String',
						price: 'Number'
					}
				}
			});
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			})
		});
}