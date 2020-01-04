const { db, admin } = require('../Util/admin')

const firebaseConfig = require('../Util/config')


//GET ALL BLOGS
exports.getAllBlogs = (req, res) => {
    db
        .collection('blogs')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let blogs = [];
            data.forEach((doc) => {
                blogs.push({
                    blogId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userProfile: doc.data().userProfile,
                    blogImage: doc.data().blogImage
                })
            })
            return res.json(blogs);
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({ error: err.code })
        });
}

//POST BLOG
exports.postOneBlog = (req, res) => {
    /*
    if (req.body.textfield.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
    }
    */
    const newBlog = {
        body: req.body.textfield,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
        userProfile: req.user.profileUrl,
        blogImage: [`https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`]
    };
    db
        .collection('blogs')
        .add(newBlog)
        .then((doc) => {
            const resBlog = newBlog;
            resBlog.blogId = doc.id;
          //  res.json(resBlog)
        })
        .catch(err => {
            res.status(500).json({ error: 'someting worng' })
            console.error(err)
        })

    db.doc(`/users/${newBlog.userHandle}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'user not found' })
            }
            return doc.ref.update({ blogCount: doc.data().blogCount + 1 })
        })
}


//FETCH ONE BLOG
exports.getBlog = (req, res) => {
    let blogData = {};
    db.doc(`/blogs/${req.params.blogId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'blog not found' })
            }
            blogData = doc.data();
            blogData.blogId = doc.id
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('blogId', '==', req.params.blogId)
                .get()
        })
        .then((data) => {
            blogData.comments = [];
            data.forEach((doc) => {
                blogData.comments.push(doc.data())
            })
            return res.json(blogData)
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({ error: err.code })
        })
}

//COMMENT ON A COMMENT
exports.commentOnBlog = (req, res) => {
    if (req.body.body.trim() === '')
        return res.status(400).json({ comment: 'Must not be empty' })

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        blogId: req.params.blogId,
        userHandle: req.user.handle,
        userProfile: req.user.profileUrl
    }
    db.doc(`/blogs/${req.params.blogId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'blog not found' })
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
        })
        .then(() => {
            return db.collection('comments').add(newComment)
        })
        .then(() => {
            res.json(newComment)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: 'someting worng' })
        })

}

// LIKED BLOG
exports.likeBlog = (req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('blogId', '==', req.params.blogId)
        .limit(1);

    const blogDocument = db.doc(`/blogs/${req.params.blogId}`)

    let blogData

    blogDocument.get()
        .then((doc) => {
            if (doc.exists) {
                blogData = doc.data()
                blogData.blogId = doc.id
                return likeDocument.get()
            } else {
                return res.status(404).json({ error: 'blog not found' })
            }
        })
        .then((data) => {
            if (data.empty) {
                return db.collection('likes').add({
                    blogId: req.params.blogId,
                    userHandle: req.user.handle
                })
                    .then(() => {
                        blogData.likeCount++
                        return blogDocument
                            .update({ likeCount: blogData.likeCount })
                    })
                    .then(() => {
                        return res.json(blogData)
                    })
            } else {
                return res.status(400).json({ error: 'blog already liked' })
            }
        })
        .catch((err) => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}

//UNLIKED BLOG
exports.unlikeBlog = (req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('blogId', '==', req.params.blogId)
        .limit(1);

    const blogDocument = db.doc(`/blogs/${req.params.blogId}`)

    let blogData

    blogDocument.get()
        .then((doc) => {
            if (doc.exists) {
                blogData = doc.data()
                blogData.blogId = doc.id
                return likeDocument.get()
            } else {
                return res.status(404).json({ error: 'blog not found' })
            }
        })
        .then((data) => {
            if (data.empty) {
                return res.status(400).json({ error: 'blog not liked' })
            } else {
                return db.doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        blogData.likeCount--
                        return blogDocument
                            .update({ likeCount: blogData.likeCount })
                    })
                    .then(() => {
                        res.json(blogData)
                    })
            }
        })
        .catch((err) => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}

//DELETE BLOG
exports.deleteBlog = (req, res) => {
    const document = db.doc(`/blogs/${req.params.blogId}`)
    document.get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Blog not found' })
            }
            if (doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({ error: 'Unauthorized' })
            } else {
                return document.delete()
            }
        })
        .then(() => {
            res.json({ message: 'Blog deleted successfuly' })
        })
        .catch((err) => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })

    db.doc(`/users/${req.user.handle}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'user not found' })
            }
            return doc.ref.update({ blogCount: doc.data().blogCount - 1 })
        })
}




//UPLOAD BLOG IMAGE
exports.uploadBlogImage = (req, res, next) => {
    const BusBoy = require('busboy')
    const path = require('path')
    const os = require('os')
    const fs = require('fs')

    const busboy = new BusBoy({ headers: req.headers })

    let imageFileName
    let imageToBeUploaded = {}

    const files = []
    const fields = {}
    busboy.on('field', (key, value) => {
        fields[key] = value
    })

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, file, filename, encoding, mimetype);
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted' })
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1]
        imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`
        const filepath = path.join(os.tmpdir(), imageFileName)
        imageToBeUploaded = { filepath, mimetype }
        file.pipe(fs.createWriteStream(filepath))
    })
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(() => {
            files.push(`https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`)
        })
            .then(() => {
                req.body = fields
                req.files = files
                next()
            })
            .catch(next)
    })
    busboy.end(req.rawBody)
}

