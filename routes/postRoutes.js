import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';


import Post from '../mongodb/models/post.js';


dotenv.config(); //populate the dotenv file

const router = express.Router(); //creating new instance of router

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,

})


//GET ALL POSTS
router.route('/').get(async (req, res) => {

    try {
        const posts = await Post.find({});

        res.status(200).json({ success: true, data: posts });

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }



})



//Create a post
router.route('/').post(async (req, res) => {

    try {
        const { name, prompt, photo, creatorId } = req.body;

        console.log(name)
        const pohotUrl = await cloudinary.uploader.upload(photo);

        const newPost = await Post.create({ //Post schema from models we are using the .create function to add a new entry
            name,
            creatorId,
            prompt,
            photo: pohotUrl.url,

        })

        //status 201 is for newly created success posts and 204 is no content
        res.status(201).json({ success: true, data: newPost });

    } catch (error) {

        res.status(500).json({ success: false, message: error });

    }

});





router.route('/').delete(async (req, res) => {

    try {
        const { key, value } = req.body;


        const deletion = await Post.deleteMany({ [key]: value });
        console.log(deletion);

        res.status(200).send({ success: true, message: `Deleted ${deletion}` });
    } catch (error) {

        res.status(500).send({ success: false, message: error + ' & Deletion failed' });

    }


})




//get only user submitted images with the user sub id
router.route('/profile-posts').post(async (req, res) => {

    try {
        const { sub } = req.body;

        const posts = await Post.find({ creatorId: sub });
        res.status(200).json({ success: true, data: posts });

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }



})

//DELETE INDIVIDAUL USER POSTS
router.route('/profile-posts-delete').delete(async (req, res) => {

    try {
        const { prompt, photo } = req.body;
        const response = await Post.deleteOne({ prompt, photo });

        res.status(202).send({ success: true, message: response })

    } catch (error) {

        res.status(500).send({ success: false, message: error })

    }


})



















export default router; //must export router which will return the routes or new end point
