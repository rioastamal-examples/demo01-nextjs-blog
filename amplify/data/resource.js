import { a, defineData } from '@aws-amplify/backend';

// To maximize the performance and to reduce cost,
// consider to use DynamoDB best practices when
// modeling your data. The key is to know your
// application access pattern first. See:
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/data-modeling.html

// Amplify data model list() command uses scan() operation, 
// This is not optimal in most cases. This demo does not 
// implements some of the best practices to make it easy for 
// new comers to understand AWS Amplify Data

// Define schema for a blog post
const schema = a.schema({
  Post: a.model({
      postId: a.id().required(),
      title: a.string(),
      slug: a.string().required(),
      summary: a.string(),
      content: a.string(),
      published: a.boolean(),
      post_type: a.enum(['post', 'page', 'other']),
      authorId: a.id(),
      author: a.belongsTo('User', 'authorId'),
      comments: a.hasMany('Comment', 'postId'),
      tags: a.string().array(),
  })
  .secondaryIndexes((index) => [
    index('slug')
    .queryField('listBySlug')
  ])
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
      subdomain: a.string(),
      profile: a.string(),
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