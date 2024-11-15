module.exports = inject

function inject (bot) {
  const ScoreBoard = require('../scoreboard')(bot)
  const scoreboards = {}

  bot._client.on('set_display_objective', (packet) => {
    //console.log(packet)
    // const { name, position } = packet
    // const scoreboard = scoreboards[name]
    //
    // if (scoreboard !== undefined) {
    //   bot.emit('scoreboardPosition', position, scoreboard, ScoreBoard.positions[position])
    //   ScoreBoard.positions[position] = scoreboard
    // }
    //
    // if (packet.action === 0) {
    //   const { name } = packet
    //   const scoreboard = new ScoreBoard(packet)
    //   scoreboards[name] = scoreboard
    //
    //   bot.emit('scoreboardCreated', scoreboard)
    // }
    //
    // if (packet.action === 2) {
    //   scoreboards[packet.name].setTitle(packet.displayText)
    //   bot.emit('scoreboardTitleChanged', scoreboards[packet.name])
    // }
  })

  bot._client.on('remove_objective', (packet) => {
    //console.log(packet)
    // bot.emit('scoreboardDeleted', scoreboards[packet.name])
    // delete scoreboards[packet.name]
  })

  bot._client.on('set_score', (packet) => {
    //console.log(packet)
    // const scoreboard = scoreboards[packet.scoreName]
    // if (scoreboard !== undefined && packet.action === 0) {
    //   const updated = scoreboard.add(packet.itemName, packet.value)
    //   bot.emit('scoreUpdated', scoreboard, updated)
    // }
    //
    // if (packet.action === 1) {
    //   if (scoreboard !== undefined) {
    //     const removed = scoreboard.remove(packet.itemName)
    //     return bot.emit('scoreRemoved', scoreboard, removed)
    //   }
    //
    //   for (const sb of Object.values(scoreboards)) {
    //     if (packet.itemName in sb.itemsMap) {
    //       const removed = sb.remove(packet.itemName)
    //       return bot.emit('scoreRemoved', sb, removed)
    //     }
    //   }
    // }
  })

  bot.scoreboards = scoreboards
  bot.scoreboard = ScoreBoard.positions
}
