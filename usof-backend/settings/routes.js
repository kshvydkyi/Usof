'use strict'

module.exports = (app) => {
    const usersController = require('./../controller/usersController');
    const authController = require('./../controller/authController');
    const categoriesController = require('./../controller/categoriesController');
    const postController = require('./../controller/postController');
    const commentsController = require('./../controller/commentsController');
    const likeController = require('../controller/likeController');
    const {uploadAvatar, uploadPost} = require('./../middleware/uploadAvatar');
    const isAuthorized = require('../middleware/isAuthorized');
    //User module
    app.route('/api/users/:token').get(isAuthorized.isAutorised, usersController.getAllUsers);

    app.route('/api/get-user/:user_id').get(usersController.getUserById);

    app.route('/api/users/:token').post(isAuthorized.isAutorised, usersController.addNewUser);

    app.route('/api/users/avatar/:token').patch(isAuthorized.isAutorised, uploadAvatar.single('image'), usersController.uploadAvatar);

    app.route('/api/users/:user_id/:token').patch(isAuthorized.isAutorised, usersController.updateUserData);

    app.route('/api/check-token/:token').get(usersController.checkToken);

    app.route('/api/users/:user_id/:token').delete(isAuthorized.isAutorised, usersController.deleteUser);

    //Auth module
    app.route('/api/auth/registration').post(authController.registration);

    app.route('/api/auth/active/:token').get(authController.activeEmail);

    app.route('/api/auth/login').post(authController.login);

    app.route('/api/auth/logout/:token').post(authController.logout);

    app.route('/api/auth/password-reset').post(authController.passwordReset);

    app.route('/api/auth/password-reset/:confirm_token').post(authController.passwordResetWithConfirmToken);

    //Post Module
    app.route('/api/posts').get(postController.getActivePosts);

    app.route('/api/posts/:id').get(postController.getActivePostById);

    app.route('/api/posts/user/:id').get(postController.getPersonalPosts);

    app.route('/api/admin/posts/:token').get(isAuthorized.isAutorised, postController.getAllPosts);

    app.route('/api/admin/posts/:id/:token').get(isAuthorized.isAutorised, postController.getPostByIdAdmin);

    app.route('/api/posts/:id/categories').get(postController.getPostCategories);

    app.route('/api/posts/:token').post(isAuthorized.isAutorised, postController.createNewPost);

    app.route('/api/posts/:id/:token').patch(isAuthorized.isAutorised, postController.updatePostUser);

    app.route('/api/posts/update/image/:id/:token').patch(isAuthorized.isAutorised, uploadPost.single('image'), postController.updateImage);

    app.route('/api/posts/update-category/:id/:token').patch(isAuthorized.isAutorised, postController.updateCategoriesForPost);

    app.route('/api/admin/posts/set-status/:id/:token').patch(isAuthorized.isAutorised, postController.adminSetStatus);

    app.route('/api/posts/image/:token').post(isAuthorized.isAutorised, uploadPost.single('image'), postController.addPictureToPost);

    app.route('/api/posts/:id/:token').delete(isAuthorized.isAutorised, postController.deletePost);


    //Categories module
    app.route('/api/categories/:token').get(isAuthorized.isAutorised, categoriesController.getAllCategories)

    app.route('/api/categories/:id/:token').get(isAuthorized.isAutorised, categoriesController.getCategoryById)

    app.route('/api/categories/:id/posts/:token').get(isAuthorized.isAutorised, categoriesController.getAllPostsInCategory)

    app.route('/api/categories/:token').post(isAuthorized.isAutorised, categoriesController.createCategory)

    app.route('/api/categories/:id/:token').patch(isAuthorized.isAutorised, categoriesController.updateCategory)

    app.route('/api/categories/:id/:token').delete(isAuthorized.isAutorised, categoriesController.deleteCategory)

    //Comments module
    app.route('/api/posts/:id/comments/:token').post(isAuthorized.isAutorised, commentsController.createComment);

    app.route('/api/comments/:id').get(commentsController.getCommentByIdUser);

    app.route('/api/admin/comments/:id/:token').get(isAuthorized.isAutorised, commentsController.getCommentByIdAdmin);

    app.route('/api/posts/:id/comments').get(commentsController.getAllCommentsInPostUser);

    app.route('/api/posts/:id/comments/:token').get(isAuthorized.isAutorised, commentsController.getAllCommentsInPostAdmin);

    app.route('/api/comments/:id/:token').patch(isAuthorized.isAutorised, commentsController.updateComment);

    app.route('/api/admin/comments/set-status/:id/:token').patch(isAuthorized.isAutorised, commentsController.setStatusComment);

    app.route('/api/comments/:id/:token').delete(isAuthorized.isAutorised, commentsController.deleteComment);

    //Likes module
    app.route('/api/posts/:id/like/:token').post(isAuthorized.isAutorised, likeController.createPostLike);

    app.route('/api/comments/:id/like/:token').post(isAuthorized.isAutorised, likeController.createCommentLike);

    app.route('/api/posts/:id/like').get(likeController.getAllLikesPost);

    app.route('/api/comments/:id/like').get(likeController.getAllLikesComment);

    app.route('/api/posts/:id/like/:token').delete(isAuthorized.isAutorised, likeController.deleteLikePost);

    app.route('/api/comments/:id/like/:token').delete(isAuthorized.isAutorised, likeController.deleteLikeComment);

}


