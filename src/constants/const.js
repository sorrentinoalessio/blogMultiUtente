import 'dotenv/config';
export const postStatus = {
  DELETED: 'deleted',
  OPEN: 'open',
  COMPLETED: 'completed',
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

const serverName = "https://alessio-be.longwavestudio.dev"
