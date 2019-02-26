import mongoose from 'mongoose';
import User from '../../database/models/user';

export default () => {
    return new Promise((resolve, reject) => {
        return mongoose.connection ? resolve(User) : reject('Error! No connection with DB')
    })
        .then(User => {
            return Promise.resolve({
                // If a user is not found find() should return null (with no error).
                find: ({ id, email, provider } = {}) => {
                    let query = {}

                    if (id) {
                        query = { _id: ObjectId(id) }
                    } else if (email) {
                        query = { email: email }
                    } else if (provider) {
                        query = { [`${provider.name}.id`]: provider.id }
                    }

                    return new Promise((resolve, reject) => {
                        User
                            .findOne(query)
                            .then(user => resolve(user ? user.toJSON() : null))
                            .catch(err => reject(err))
                    })
                },

                insert: (user, oAuthProfile) => {
                    return new Promise((resolve, reject) => {
                        // next-auth returns normalized user, so the rest of fields needed from oAuthProfile  must be added here
                        if (user.google)
                            user.forthytwo.login = oAuthProfile && oAuthProfile.login ? oAuthProfile.login : null
                        User
                            .create(user)
                            .then(response => {
                                if (!user._id && response._id) user._id = response._id
                                resolve(user)
                            })
                            .catch(err => reject(err))
                    })
                },

                update: (user, profile, field) => {
                    return new Promise((resolve, reject) => {
                        const mod = field ? { $unset: { [field.delete]: 1 } } : user

                        User
                            .update({ _id: ObjectId(user._id) }, mod, { new: true })
                            .then(resp => resolve(user.toJSON()))
                            .catch(err => reject(err))
                    })
                },

                remove: (id) => {
                    return new Promise((resolve, reject) => {
                        User.remove({ _id: ObjectId(id) }, (err) => {
                            if (err) return reject(err)
                            return resolve(true)
                        })
                    })
                },

                serialize: (user) => {
                    // Supports serialization from Mongo Object *and* deserialize() object
                    if (user.id) {
                        // Handle responses from deserialize()
                        return Promise.resolve(user.id)
                    } else if (user._id) {
                        // Handle responses from find(), insert(), update()
                        return Promise.resolve(user._id)
                    } else {
                        return Promise.reject(new Error("Unable to serialise user"))
                    }
                },

                deserialize: (id) => {
                    return new Promise((resolve, reject) => {
                        User.findOne({ _id: ObjectId(id) }, (err, user) => {
                            if (err) return reject(err)

                            // If user not found (e.g. account deleted) return null object
                            if (!user) return resolve(null)

                            return resolve({
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                emailVerified: user.emailVerified,
                                admin: user.admin || false
                            })
                        })
                    })
                },
            })
        })
}