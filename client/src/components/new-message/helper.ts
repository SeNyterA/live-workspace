// export const formatTime = (timestamp: number) => {
//   const now = moment()
//   const time = moment(timestamp)
//   if (now.isSame(time, 'day')) {
//     return time.format('h:mm A')
//   }
//   if (now.diff(time, 'weeks') === 0) {
//     return time.fromNow()
//   }
//   return time.format('ddd, MMM Do')
// }

export const removeHtmlTags = (htmlString: string) => {
  return htmlString.replace(/<[^>]*>/g, ' ')
}

// export const groupMessagesByUser = (messages: Message[]) => {
//   const sortedMessages = messages.sort((a, b) => b.createdAt - a.createdAt)

//   return sortedMessages.reduce((pre, next) => {
//     if (pre.length) {
//       const lastGroup = pre[pre.length - 1]
//       const lastMsg = lastGroup[lastGroup.length - 1]

//       if (next.isSystem) {
//         const isSameUser = lastMsg.isSystem === next.isSystem

//         const timeDiff = Math.abs(lastMsg.createdAt - next.createdAt)

//         if (isSameUser && timeDiff < 60 * 1000) {
//           pre[pre.length - 1] = [next, ...pre[pre.length - 1]]
//         } else {
//           pre.push([next])
//         }
//       } else {
//         const isSameUser = lastMsg.createdById === next.createdById

//         const timeDiff = Math.abs(lastMsg.createdAt - next.createdAt)

//         if (isSameUser && timeDiff < 60 * 1000) {
//           pre[pre.length - 1] = [next, ...pre[pre.length - 1]]
//         } else {
//           pre.push([next])
//         }
//       }
//     } else {
//       pre.push([next])
//     }

//     return pre
//   }, [] as Message[][])
// }
