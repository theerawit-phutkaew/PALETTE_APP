const functions = require('firebase-functions');

const express = require("express");

const FBAuth = require('./Util/FBAuth')

const { db, admin } = require('./Util/admin')

const cors = require('cors');

const fileUpload = require('./Util/cloud-function-file-upload')

const blogUpload = require('./Util/cloud-function-blog-upload')

const firebaseConfig = require('./Util/config')



const app = express().use(cors({ origin: true }))
fileUpload("/profile", app)
blogUpload('/post', app)


const {
    getAllBlogs,
    postOneBlog,
    getBlog,
    commentOnBlog,
    likeBlog,
    unlikeBlog,
    deleteBlog,
    uploadBlogImage,

} = require('./handlers/blogs')
const {
    signup,
    login,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead,
    uploadUserProfile,
} = require('./handlers/users')


//Blogs Routes
app.get('/blogs', getAllBlogs);
app.get('/blog/:blogId', getBlog);
app.post('/blog/:blogId/comment', FBAuth, commentOnBlog);
app.get('/blog/:blogId/like', FBAuth, likeBlog)
app.get('/blog/:blogId/unlike', FBAuth, unlikeBlog)
app.delete('/blog/:blogId', FBAuth, deleteBlog)
app.post('/postBlog', FBAuth, uploadBlogImage, postOneBlog)


app.get('/postBlog', function (req, res) {
    res.end('<html><head></head><body>\
               <form method="post" enctype="multipart/form-data">\
                <input type="text" name="textfield" ><br />\
                <input type="file" name="filefield"><br />\
                <input type="submit">\
              </form>\
            </body></html>');
})


//User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead)






app.post("/profile", FBAuth, function (req, response, next) {
    uploadImageToStorage(req.files.file[0])
        .then(metadata => {
            response.status(200).json(metadata[0]);
            next();
        })
        .then(() => {
            const profileUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({ profileUrl })
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ error });
            next();
        });
});

const uploadImageToStorage = file => {
    const storage = admin.storage();
    const imageExtension = file.originalname.split('.')[file.originalname.split('.').length - 1]
    imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`
    return new Promise((resolve, reject) => {
        const fileUpload = storage.bucket().file(imageFileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: "image/jpeg"
            }
        });
        blobStream.on("error", error => reject(error));
        blobStream.on("finish", () => {
            fileUpload.getMetadata()
                .then(metadata => resolve(metadata))
                .catch(error => reject(error));
        });
        blobStream.end(file.buffer);
    });
}




////////////////////////////////////////


app.post("/post", FBAuth, function (req, response, next) {
    uploadBlogImageToStorage(req.files.file[0])
        .then(metadata => {
            response.status(200).json(metadata[0]);
            next();
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ error });
            next();
        });
}, postOneBlog);


const uploadBlogImageToStorage = file => {
    const storage = admin.storage();
    const imageExtension = file.originalname.split('.')[file.originalname.split('.').length - 1]
    imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`
    return new Promise((resolve, reject) => {
        const fileUpload = storage.bucket().file(imageFileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: "image/jpeg"
            }
        });
        blobStream.on("error", error => reject(error));
        blobStream.on("finish", () => {
            fileUpload.getMetadata()
                .then(metadata => resolve(metadata))
                .catch(error => reject(error));
        });
        blobStream.end(file.buffer);
    });
}








exports.api = functions.region('us-central1').https.onRequest(app);

exports.createNotificationOnLike = functions
    .region('us-central1')
    .firestore
    .document('likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/blogs/${snapshot.data().blogId}`)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        blogId: doc.id
                    })
                }
            })
            .catch((err) =>
                console.error(err))
    })

exports.createNotificationOnComment = functions
    .region('us-central1')
    .firestore
    .document('comments/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/blogs/${snapshot.data().blogId}`)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        blogId: doc.id
                    })
                }
            })
            .catch((err) =>
                console.error(err))
    })

exports.deleteNotificationOnUnLike = functions
    .region('us-central1')
    .firestore
    .document('likes/{id}')
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((err) =>
                console.err(err))
    })

exports.onBlogDelete = functions
    .region('us-central1')
    .firestore.document('/blogs/{blogId}')
    .onDelete((snapshot, context) => {
        const blogId = context.params.blogId
        const batch = db.batch()
        return db.collection('comments').where('blogId', '==', blogId).get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                })
                return db.collection('likes').where('blogId', '==', blogId).get()
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/likes/${doc.id}`))
                })
                return db.collection('notifications').where('blogId', '==', blogId).get()
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                })
                return batch.commit()
            })
            .catch((err) => console.error(err))
    })

exports.onUserImageChange = functions
    .region('us-central1')
    .firestore.document('/users/{userId}')
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        if (change.before.data().profileUrl !== change.after.data().profileUrl) {
            console.log('image has change');

            let batch = db.batch();
            return db.collection('blogs').where('userHandle', '==', change.before.data().handle)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const blog = db.doc(`/blogs/${doc.id}`)
                        batch.update(blog, { userProfile: change.after.data().profileUrl })
                    })
                    return batch.commit()
                })
        } else return true
    })

