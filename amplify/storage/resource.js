import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amp-demo01-blog',
  access: (allow) => ({
    'media/blog/{entity_id}/*': [
      // {entity_id} is the token that is replaced with the user identity id
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
  })
});