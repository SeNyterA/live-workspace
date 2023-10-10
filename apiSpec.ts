const apiSpec = {
  workspace: {
    teams: {
      create: 1,
      update: 1,
      findOne: 1,
      findAll: 1,
      remove: 1,

      editMembers: 1,
      removeMembers: 1,

      channels: {
        create: 1,
        update: 1,
        findOne: 1,
        findAll: 1,
        remove: 1,

        editMembers: 1,
        removeMembers: 1,

        sendMessage: 1,
        getAllMessages: 1
      },

      boards: {
        create: 1,
        update: 1,
        findOne: 1,
        findAll: 1,
        remove: 1,

        editMembers: 1,
        removeMembers: 1,

        createFields: 1,
        updateField: 1,
        removeField: 1,

        cards: {
          create: 1,
          update: 1,
          findOne: 1,
          findAll: 1,
          remove: 1,

          updateProperties: 1,

          blocks: {
            create: 1,
            update: 1,
            findOne: 1,
            findAll: 1,
            remove: 1
          }
        }
      }
    },
    groups: {
      create: 1,
      update: 1,
      findOne: 1,
      findAll: 1,
      remove: 1,

      editMembers: 1,
      removeMembers: 1,

      sendMessage: 1,
      getAllMessages: 1
    },
    directMessage: {
      update: 1,
      findOne: 1,
      findAll: 1,
      remove: 1,

      sendMessage: 1,
      getAllMessages: 1
    }
  },
  auth: {
    login: 1,
    register: 1,
    loginFirebase: 1
  },
  users: {
    find: 1
  }
}
