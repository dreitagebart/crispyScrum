
/**
 * Module dependencies.
 */

import mongoose from 'mongoose'

const tokenSchema = mongoose.Schema({
  accessToken: { type: String },
  accessTokenExpiresOn: { type: Date },
  client: { type: Object },  // `client` and `user` are required in multiple places, for example `getAccessToken()`
  clientId: { type: String },
  refreshToken: { type: String },
  refreshTokenExpiresOn: { type: Date },
  user: { type: Object },
  userId: { type: String }
})

const clientSchema = mongoose.Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUris: { type: Array }
})

const userSchema = mongoose.Schema({
  email: { type: String, default: '' },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String },
  username: { type: String }
})

const OAuthUsers = mongoose.model('OAuthUsers', userSchema)
const OAuthClients = mongoose.model('OAuthClients', clientSchema)
const OAuthTokens = mongoose.model('OAuthTokens', tokenSchema)

/**
 * Get access token.
 */

const getAccessToken = bearerToken => {
  // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
  return OAuthTokens.findOne({ accessToken: bearerToken }).lean()
}

/**
 * Get client.
 */

const getClient = (clientId, clientSecret) => {
  return OAuthClients.findOne({ clientId: clientId, clientSecret: clientSecret }).lean()
}

/**
 * Get refresh token.
 */

const getRefreshToken = refreshToken => {
  return OAuthTokens.findOne({ refreshToken: refreshToken }).lean()
}

/**
 * Get user.
 */

const getUser = (username, password) => {
  return OAuthUsers.findOne({ username: username, password: password }).lean()
}

/**
 * Save token.
 */

const saveToken = (token, client, user) => {
  let accessToken = new OAuthTokens({
    accessToken: token.accessToken,
    accessTokenExpiresOn: token.accessTokenExpiresOn,
    client: client,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresOn: token.refreshTokenExpiresOn,
    user: user,
    userId: user._id
  })
  // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
  return new Promise((resolve, reject) => {
    accessToken.save((err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  }).then(saveResult => {
    // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
    saveResult = saveResult && typeof saveResult === 'object' ? saveResult.toJSON() : saveResult

    // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
    let data = {}
    for (let prop in saveResult) data[prop] = saveResult[prop]

    // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
    data.client = data.clientId
    data.user = data.userId

    return data
  })
}

export const OauthModel = {
  getUser,
  saveToken,
  getAccessToken,
  getRefreshToken,
  getClient
}
