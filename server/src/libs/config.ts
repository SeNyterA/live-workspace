export const variblesConfig = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/trello',
  SERVER_PORT: process.env.SERVER_PORT || 8420,
  JWT_SECRET: process.env.JWT_SECRET || 'Som3thinGSe3cret',

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'AKIA5NBPAY3HJCP6UB6J',
  AWS_SECRET_ACCESS_KEY:
    process.env.AWS_SECRET_ACCESS_KEY ||
    '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-southeast-2',

  BUCKET_NAME: process.env.BUCKET_NAME || 'trello-liveboard'
}
