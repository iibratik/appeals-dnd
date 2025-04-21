export default defineEventHandler((event) => {
  const query = getQuery(event)

  const page = parseInt(query.page as string) || 1
  const perPage = parseInt(query.perPage as string) || 10


  const gameTitles = [
    `CS2`, `DOTA2`, `Team Fortress`, `Half-Life`, `Portal`, `Left 4 Dead`,
    `Cyberpunk 2077`, `Witcher 3`, `GTA V`, `Red Dead Redemption`, `Apex Legends`,
    `Valorant`, `League of Legends`, `PUBG`, `Overwatch`, `Call of Duty`, `Battlefield`,
    `Minecraft`, `Roblox`, `Fortnite`, `Starfield`, `Skyrim`, `Fallout`, `Elden Ring`,
    `Dark Souls`, `Resident Evil`, `Metal Gear`, `Hades`, `Among Us`, `Terraria`,
    `Hollow Knight`, `Celeste`, `Stardew Valley`, `Don't Starve`, `RimWorld`, `Cities: Skylines`,
    `SimCity`, `The Sims`, `Far Cry`, `Assassin’s Creed`, `Hitman`, `Control`, `Alan Wake`,
    `The Last of Us`, `Uncharted`, `God of War`, `Spider-Man`, `Detroit Become Human`,
    `Until Dawn`, `Heavy Rain`, `Tomb Raider`, `BioShock`, `Mass Effect`, `Dragon Age`,
    `XCOM`, `Divinity Original Sin`, `Baldur’s Gate`, `Pathfinder`, `Diablo`, `Torchlight`,
    `World of Warcraft`, `Runescape`, `Lineage`, `Black Desert`, `Lost Ark`, `New World`,
    `Warframe`, `Destiny 2`, `Sea of Thieves`, `No Man’s Sky`, `Ark: Survival`, `Rust`,
    `DayZ`, `Subnautica`, `Raft`, `Valheim`, `Satisfactory`, `Factorio`, `Oxygen Not Included`,
    `Kerbal Space Program`, `Slay the Spire`, `Loop Hero`, `Inscryption`, `Dead Cells`,
    `Enter the Gungeon`, `FTL`, `Undertale`, `Cuphead`, `Banished`, `Frostpunk`,
    `This War of Mine`, `Gris`, `Inside`, `Limbo`, `Journey`, `Firewatch`, `Oxenfree`,
    `Spiritfarer`, `Kena: Bridge of Spirits`, `Stray`, `Hi-Fi Rush`
  ]


  const gameData = gameTitles.slice(0, 100).map((title, index) => ({
    id: index + 1,
    title: `${title}`,
    order: index + 1,
    children: [
      { id: 1, title: `Item 1 of ${title}`, order: 1 },
      { id: 2, title: `Item 2 of ${title}`, order: 2 },
      { id: 3, title: `Item 3 of ${title}`, order: 3 },
    ]
  }))

  const start = (page - 1) * perPage
  const end = start + perPage
  const paginatedItems = gameData.slice(start, end)

  return {
    total: gameData.length,
    page,
    perPage,
    totalPages: Math.ceil(gameData.length / perPage),
    items: paginatedItems,
  }
})
