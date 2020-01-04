const { db, admin } = require('../Util/admin')

const firebaseConfig = require('../Util/config')

const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../Util/validators')


//SIGNUP
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const { valid, errors } = validateSignupData(newUser);

    if (!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png'

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'this handle is already taken' })
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
                blogCount: 0,
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials)
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email is already is use' })
            } else if (err.code === 'auth/weak-password') {
                return res.status(400).json({ password: 'password more 6 character' })
            } else {
                return res.status(500).json({ general: 'Someting worng please try again' })
            }
        })
}


//LOGIN
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateLoginData(user);

    if (!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({ token })
        })
        .catch((err) => {
            console.error(err)
            //auth/wrong-password
            //auth/user-not-user
            return res
                .status(403)
                .json({ general: 'Wrong credentials, please try again' })

        })
}


//ADD USER DETAILS
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body)

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added successfuly' })
        })
        .catch((err) => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}


//GET OWN USER DETAILS
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then((doc) => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db
                    .collection('likes')
                    .where('userHandle', '==', req.user.handle)
                    .get()
            }
        })
        .then((data) => {
            userData.likes = [];
            data.forEach((doc) => {
                userData.likes.push(doc.data())
            })
            return db
                .collection('notifications')
                .where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc')
                .limit(10)
                .get()
        })
        .then((data) => {
            userData.notifications = []
            data.forEach((doc) => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    blogId: doc.data().blogId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id
                })
            })
            return db
                .collection('blogs')
                .where('userHandle', '==', req.user.handle)
                .orderBy('createdAt', 'desc')
                .get()
        })
        .then((data) => {
            userData.authUserBlogs = []
            data.forEach((doc) => {
                userData.authUserBlogs.push({
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
            return res.json(userData)
        })
        .catch((err) => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}

//GET ANY USER DETAILS
exports.getUserDetails = (req, res) => {
    let userData = {}
    db.doc(`/users/${req.params.handle}`).get()
        .then((doc) => {
            if (doc.exists) {
                userData.user = doc.data()
                return db
                    .collection('blogs')
                    .where('userHandle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get()
            } else {
                return res.status(404).json({ error: 'user not found' })
            }
        })
        .then((data) => {
            userData.blogs = []
            data.forEach((doc) => {
                userData.blogs.push({
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
            return res.json(userData)
        })
        .catch((err) => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}



//MARK NOTIFICATIONS READ
exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach((notificationId) => {
        const notification = db.doc(`/notifications/${notificationId}`)
        batch.update(notification, { read: true })
    })
    batch.commit()
        .then(() => {
            return res.json({ message: 'Notifications marked read' })
        })
        .catch((err) => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}


//UPLOAD USER IMAGE
exports.uploadUserProfile = (req, res) => {
    const BusBoy = require('busboy')
    const path = require('path')
    const os = require('os')
    const fs = require('fs')

    const busboy = new BusBoy({ headers: req.headers })

    let imageFileName
    let imageToBeUploaded = {}

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
        })
            .then(() => {
                const profileUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`
                return db.doc(`/users/${req.user.handle}`).update({ profileUrl })
            })
            .then(() => {
                return res.json({ message: 'Image Uploaded successfully' })
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: err.code })
            })
    })
    busboy.end(req.rawBody)
}


