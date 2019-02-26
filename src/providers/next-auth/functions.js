import mongoose from 'mongoose';
import UserModel from '../../database/models/user';

const { ObjectId } = mongoose.Types;

export default () => {
  return new Promise((resolve, reject) => {
    return mongoose.connection
      ? resolve(UserModel)
      : reject(new Error('No connection to mongoose DB!'));
  }).then(User => {
    return Promise.resolve({
      // If a user is not found find() should return null (with no error).
      find: ({ id, email, provider, ...rest } = {}) => {
        let query = {};

        if (id) {
          query = { _id: ObjectId(id) };
        } else if (email) {
          query = { email };
        } else if (provider) {
          query = { [`${provider.name}.id`]: provider.id };
        }

        return new Promise((resolve, reject) => {
          User.findOne(query)
            .then(user => resolve(user ? user.toJSON() : null))
            .catch(err => reject(err));
        });
      },

      insert: (user, oAuthProfile) => {
        const insertUser = user;
        return new Promise((resolve, reject) => {
          // next-auth returns normalized user, so the rest of fields needed from oAuthProfile  must be added here
          if (insertUser.google)
            insertUser.forthytwo.login =
              oAuthProfile && oAuthProfile.login ? oAuthProfile.login : null;
          UserModel.create(insertUser)
            .then(response => {
              if (!insertUser._id && response._id) insertUser._id = response._id;
              resolve(insertUser);
            })
            .catch(err => reject(err));
        });
      },

      update: (user, profile, field) => {
        return new Promise((resolve, reject) => {
          const mod = field ? { $unset: { [field.delete]: 1 } } : user;

          User.update({ _id: ObjectId(user._id) }, mod, { new: true })
            .then(resp => resolve(user.toJSON()))
            .catch(err => reject(err));
        });
      },

      remove: id => {
        return new Promise((resolve, reject) => {
          User.remove({ _id: ObjectId(id) }, err => {
            if (err) return reject(err);
            return resolve(true);
          });
        });
      },

      serialize: user => {
        // Supports serialization from Mongo Object *and* deserialize() object
        if (user.id) {
          // Handle responses from deserialize()
          return Promise.resolve(user.id);
        }
        if (user._id) {
          // Handle responses from find(), insert(), update()
          return Promise.resolve(user._id);
        }
        return Promise.reject(new Error('Unable to serialise user'));
      },

      deserialize: id => {
        return new Promise((resolve, reject) => {
          User.findOne({ _id: ObjectId(id) }, (err, user) => {
            if (err) return reject(err);

            // If user not found (e.g. account deleted) return null object
            if (!user) return resolve(null);

            return resolve({
              id: user._id,
              displayName: user.name,
              email: user.email
            });
          });
        });
      }
    });
  });
};
