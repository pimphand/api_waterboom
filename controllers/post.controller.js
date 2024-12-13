const validator = require('fastest-validator');
const models = require('../models');

function save(req,res){
    const post = {
        title:req.body.title,
        content:req.body.content,
        imageUrl:req.body.image_url,
        categoryId:req.body.category_id,
        userId:req.userData.userId
    }

    const schema = {
        title:{type:"string",optional:false,max:"65"},
        content:{type:"string",optional:false,max:"1300"},
        categoryId:{type:"number",optional:false}
    }

    const vldator = new validator();
    const validationResponse = vldator.validate(post,schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message:"Validation failed",
            error:validationResponse
        });
    }

    models.Post.create(post).then(result =>{
        res.status(201).json({
            message:"Post created successfully",
            post:result
        });
    }).catch(error => {
        res.status(500).json({
            message:"Something wrong",
            error:error
        });            
    });

}

function show(req,res){
    const id = req.params.id;

    models.Post.findByPk(id).then(result => {
       if(result){
            res.status(200).json(result);
       }else{
            res.status(404).json({
                message:"Post not found!"
            });
       }
    }).catch(error => {
        res.status(500).json({
            message : "Something went to wrong!"
        });
    });
}

function index(req,res){
    
    models.Post.findAll().then(result => {
        if(result){
            res.status(200).json(result);
       }else{
            res.status(404).json({
                message:"Posts not found!"
            });
       }
    }).catch(error => {
        res.status(500).json({
            message : "Something went to wrong!"
        });
    });
}

function update(req,res){

    const id = req.params.id;

    const updatePost = {
        title:req.body.title,
        content:req.body.content,
        imageUrl:req.body.image_url,
        categoryId:req.body.category_id,
    }

    const userId = req.userData.userId;

    const schema = {
        title:{type:"string",optional:false,max:"65"},
        content:{type:"string",optional:false,max:"1300"},
        categoryId:{type:"number",optional:false}
    }

    const vldator = new validator();
    const validationResponse = vldator.validate(updatePost,schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message:"Validation failed",
            error:validationResponse
        });
    }

    models.Post.findByPk(id).then(result => {
        if(result){
            models.Post.update(updatePost,{where:{id:id, userId:userId}}).then(result =>{
                res.status(200).json({
                    message:"Post updated successfully",
                    post:updatePost
                });
            });
        }else{
             res.status(404).json({
                 message:"Post not found!"
             });
        }
     }).catch(error => {
         res.status(500).json({
             message : "Something went to wrong!"
         });
     });

}

function destroy(req,res){

    const id = req.params.id;
    const userId = req.userData.userId;

    models.Post.destroy({where:{id:id, userId:userId}}).then(result =>{
        if(result){
            res.status(200).json({
                message:"Post deleted successfully"
            });
       }else{
            res.status(404).json({
                message:"Post not found!"
            });
       }
    }).catch(error => {
        res.status(500).json({
            message:"Something wrong",
            error:error
        });            
    });

}

module.exports = {
    save:save,
    show:show,
    index:index,
    update:update,
    destroy:destroy
}