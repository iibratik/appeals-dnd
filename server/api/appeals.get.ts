export default defineEventHandler(() => {
    return {
        total: 100,
        page: 1,
        perPage: 10,
        items: [
            {
                id: 1,
                title: 'DOTA2',
                order: 1,
                children: [
                    { id: 1, title: 'Head', },
                    { id: 2, title: 'Weapon', },
                    { id: 3, title: 'Back', },
                    { id: 4, title: "Shoulders" },
                    { id: 5, title: "Arms" },
                    { id: 6, title: "Braces" },
                    { id: 7, title: "Collection" },
                    { id: 8, title: "Event" },
                    { id: 9, title: "Treasure" },
                    { id: 10, title: "Belt" },
                    { id: 11, title: "Legs" },
                    { id: 12, title: "Wards" },

                ]
            },
            {
                id: 2,
                title: 'CS2',
                order: 2,
                children: [
                    { id: 1, title: 'Gloves', },
                    { id: 2, title: 'Heavy', },
                    { id: 3, title: 'Knives', },
                    { id: 4, title: "Pistols" },
                    { id: 5, title: "Rifles" },
                    { id: 6, title: "SMGs" }
                ]
            },
        ]
    }
})