/*
 *
 * A bot that attacks the player that sends a message or the nearest entity (excluding players)
 *
 */
const mineflayer = require('../../')

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node attack.js <host> <port> <version> [<name>] [<password>]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  auth: 'offline',
  version: process.argv[4],
  username: process.argv[5] ? process.argv[5] : 'attack',
  password: process.argv[6]
})

bot.on('spawn', () => {
    console.log(bot.physics)
    // bot.chat('Hello, I am a bot that attacks the player that sends a message or the nearest entity (excluding players)')
  bot.on('chat', (username, message) => {
    if (message === 'attack me') attackPlayer(username)
    else if (message === 'attack') attackEntity()
  })
})

bot.on('move', (pos) => {
    console.log(pos)
    console.log(`I am at ${pos.x}, ${pos.y}, ${pos.z}`)
    console.log(bot.blockAt(pos.offset(0, -1, 0))?.name)
})

function attackPlayer (username) {
  const player = bot.players[username]
  if (!player || !player.entity) {
    bot.chat('I can\'t see you')
  } else {
    bot.chat(`Attacking ${player.username}`)
    bot.attack(player.entity)
  }
}

function attackEntity () {
  const entity = bot.nearestEntity()
  if (!entity) {
    bot.chat('No nearby entities')
  } else {
    bot.chat(`Attacking ${entity.name ?? entity.username}`)
    bot.attack(entity)
  }
}
