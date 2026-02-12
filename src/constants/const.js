import 'dotenv/config';
export const postStatus = {
  DELETED: 'deleted',
  DRAFT: 'draft',
  PUBLIC: 'public',
  ARCHIVED: 'archived'
}

export const userStatus = {
  ACTIVE: 'active',
  PENDING: 'pending',
  DELETED: 'deleted',
  ARCHIVED: 'archived'
}

export const privateKey = process.env.PRIVATE_KEY

export const publicKey = process.env.PUBLIC_KEY

export const actions = {
  COMMENT_POST: 'commentPost'
}

const serverName = "https://alessio-be.longwavestudio.dev"
