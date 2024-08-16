import { a, defineData } from '@aws-amplify/backend';

// Define schema for a blog post
const schema = a.schema({
  Post: a.model({
      postId: a.id().required(),
      title: a.string(),
      slug: a.string(),
      summary: a.string(),
      content: a.string(),
      published: a.boolean(),
      type: a.enum(['post', 'page', 'other']),
      authorId: a.id(),
      author: a.belongsTo('User', 'authorId'),
      comments: a.hasMany('Comment', 'postId'),
      tags: a.string().array(),
  })
  .identifier(['postId'])
  .authorization(allow => [
    // Allow public to read the post
    allow.publicApiKey().to(['read']),
    
    // Allow owner to do anything for their post
    allow.owner(),

    // ADMINS rule them all
    allow.group('ADMINS')
  ]),

  User: a.model({
      userId: a.id().required(),
      name: a.string(),
      email: a.string(),
      posts: a.hasMany('Post', 'authorId'),
      comments: a.hasMany('Comment', 'authorId'),
  })
  .identifier(['userId'])
  .authorization(allow => [    
    // Only owner can update their own profile
    // They should not able to delete them self
    allow.owner().to(['create', 'read', 'update']),

    // ADMINS rule them all
    allow.group('ADMINS')
  ]),

  Comment: a.model({
      commentId: a.id().required(),
      content: a.string(),
      postId: a.id(),
      authorId: a.id(),
      post: a.belongsTo('Post', 'postId'),
      author: a.belongsTo('User', 'authorId'),
  })
  .identifier(['commentId'])
  .authorization(allow => [
    // Allow public to read the comment
    allow.publicApiKey().to(['read']),

    // Allow only owner to create and delete the comment
    allow.owner().to(['create', 'read', 'delete']),

    // ADMINS rule them all
    allow.group('ADMINS')
  ]),
});

// Used for code completion / highlighting when making requests from frontend
// export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});