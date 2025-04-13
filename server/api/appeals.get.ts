export default defineEventHandler((event) => {
    const query = getQuery(event)

    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.perPage as string) || 10

    const gameTitles = [
      `DOTA2`, `CS2`, `Team Fortress`, `Half-Life`, `Portal`, `Left 4 Dead`,
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

    const allItems = gameTitles.slice(0, 100).map((title, index) => ({
      id: index + 1,
      title: `${title}`,
      order: index + 1,
      children: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
        id: j + 1,
        title: `item of ${title}`,
        order: j + 1 // Присваиваем order для каждого дочернего элемента
      }))
    }))

    const start = (page - 1) * perPage
    const end = start + perPage
    const paginatedItems = allItems.slice(start, end)

    return {
      total: allItems.length,
      page,
      perPage,
      totalPages: Math.ceil(allItems.length / perPage),
      items: paginatedItems,
    }
})
