const nbt = require("prismarine-nbt");
module.exports = inject;

const difficultyNames = ["peaceful", "easy", "normal", "hard"];
//const gameModes = ['survival', 'creative', 'adventure']

// const dimensionNames = {
//   '-1': 'minecraft:nether',
//   0: 'minecraft:overworld',
//   1: 'minecraft:end'
// }

// const parseGameMode = gameModeBits => gameModes[(gameModeBits & 0b11)] // lower two bits

function inject(bot, options) {
  // function getBrandCustomChannelName () {
  //   if (bot.supportFeature('customChannelMCPrefixed')) {
  //     return 'MC|Brand'
  //   } else if (bot.supportFeature('customChannelIdentifier')) {
  //     return 'minecraft:brand'
  //   }
  //   throw new Error('Unsupported brand channel name')
  // }

  function handleStartGamePacketData(packet) {
    bot.game.levelType = packet.generator ?? (packet.generator === 2 ? "flat" : "default");
    bot.game.hardcore = packet.player_gamemode === "hardcore";
    bot.game.gameMode = packet.player_gamemode;

    bot.game.dimension = packet.dimension;

    // CODE BELOW MIGHT BE WRONG
    // if (bot.supportFeature('dimensionIsAnInt')) {
    //   bot.game.dimension = dimensionNames[packet.dimension]
    // } else if (bot.supportFeature('dimensionIsAString')) {
    //   bot.game.dimension = packet.dimension
    // } else if (bot.supportFeature('dimensionIsAWorld')) {
    //   bot.game.dimension = packet.worldName
    // } else {
    //   throw new Error('Unsupported dimension type in start_game packet')
    // }

    // if (packet.dimensionCodec) {
    //   bot.registry.loadDimensionCodec(packet.dimensionCodec)
    // }
    // CODE BELOW MIGHT BE WRONG FOR BEDROCK
    // if (bot.supportFeature('dimensionDataInCodec')) { // 1.19+
    //   if (packet.world_gamemode) { // login
    //     bot.game.dimension = packet.worldType.replace('minecraft:', '')
    //     const { minY, height } = bot.registry.dimensionsByName[bot.game.dimension]
    //     bot.game.minY = minY
    //     bot.game.height = height
    //   } else if (packet.dimension) { // respawn
    //     bot.game.dimension = packet.dimension.replace('minecraft:', '')
    //   }
    // } else if (bot.supportFeature('dimensionDataIsAvailable')) { // 1.18
    //console.log(bot.registry.dimensionsByName)
    //const { minY, height } = bot.registry.dimensionsByName[bot.game.dimension]
    // CODE BELOW SHOULD BE OPTIMIZED FOR BEDROCK
    if (bot.registry.dimensionsByName) {
      const { minY, height } = bot.registry.dimensionsByName[bot.game.dimension];
      bot.game.minY = minY;
      bot.game.height = height;
    } else {
      bot.game.minY = -64;
      bot.game.height = 384;
    }
    if (packet.difficulty) {
      bot.game.difficulty = difficultyNames[packet.difficulty];
    }

    // custom handling of itemstates. This should most likely be moved to prismarine-registry.
    bot.game.itemstates = {};
    bot.game.itemstatesByName = {};

    for (const item of packet.itemstates) {
      bot.game.itemstates[item.runtime_id] = item;
      bot.game.itemstatesByName[item.name] = item;
    }

    // custom handling of block data. This should most likely be moved to prismarine-registry.
    bot.game.blockProperties = {};
    bot.game.blockPropertiesByName = {};
    for (const block of packet.block_properties) {
      bot.game.blockProperties[block.runtime_id] = block;
      bot.game.blockPropertiesByName[block.name] = block;
    }
  }

  bot.game = {};

  // const brandChannel = getBrandCustomChannelName()
  // bot._client.registerChannel(brandChannel, ['string', []])

  bot._client.on("start_game", (packet) => {
    handleStartGamePacketData(packet);

    // bot.game.maxPlayers = packet.maxPlayers
    // if (packet.enableRespawnScreen) {
    //   bot.game.enableRespawnScreen = packet.enableRespawnScreen
    // }
    // if (packet.viewDistance) {
    //   bot.game.serverViewDistance = packet.viewDistance
    // }

    bot.emit("login");
    bot.emit("game");

    // varint length-prefixed string as data
    //bot._client.writeChannel(brandChannel, options.brand)
  });

  bot._client.on("respawn", (packet) => {
    //handleRespawnPacketData(packet)
    bot.emit("game");
  });

  // bot._client.on('game_state_change', (packet) => {
  //   if (packet?.reason === 4 && packet?.gameMode === 1) {
  //     bot._client.write('client_command', { action: 0 })
  //   }
  //   if (packet.reason === 3) {
  //     bot.game.gameMode = parseGameMode(packet.gameMode)
  //     bot.emit('game')
  //   }
  // })

  // bot._client.on('difficulty', (packet) => {
  //   bot.game.difficulty = difficultyNames[packet.difficulty]
  // })

  // bot._client.on(brandChannel, (serverBrand) => {
  //   bot.game.serverBrand = serverBrand
  // })

  // mimic the vanilla 1.17 client to prevent anticheat kicks
  // bot._client.on('ping', (data) => {
  //   bot._client.write('pong', {
  //     id: data.id
  //   })
  // })
}
