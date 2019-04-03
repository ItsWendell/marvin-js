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
      find: ({ id, email, provider } = {}) => {
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
            .then(user => {
              resolve(user ? user.toJSON() : null);
            })
            .catch(err => resolve(null));
        });
      },

      insert: (user, oAuthProfile) => {
        const newUser = user;
        return new Promise((resolve, reject) => {
          // next-auth returns normalized user, so the rest of fields needed from oAuthProfile  must be added here
          if (newUser.intra42)
            newUser.intra42.login = oAuthProfile && oAuthProfile.login ? oAuthProfile.login : null;
          UserModel.create(newUser)
            .then(response => {
              if (!newUser._id && response._id) newUser._id = response._id;
              resolve(newUser);
            })
            .catch(err => reject(err));
        });
      },

      update: (user, oAuthProfile, field) => {
        const updateUser = user;
        return new Promise((resolve, reject) => {
          if (oAuthProfile && oAuthProfile.provider === 'Slack' && user.slack) {
            updateUser.slack.workspaceDomain = oAuthProfile.team.domain;
          }
          const mod = field && field.delete ? { $unset: { [field.delete]: 1 } } : updateUser;
          User.update({ _id: ObjectId(updateUser._id) }, mod, { new: true })
            .then(resp => {
              console.log('resp', resp);
              console.log('updateUser', updateUser, oAuthProfile);
              resolve(updateUser);
            })
            .catch(err => {
              console.log('ERROR:', err);
              reject(err);
            });
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
              email: user.email,
              slackId: user.slackId
            });
          });
        });
      }
    });
  });
};
