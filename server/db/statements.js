const createUserTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            bio TEXT, 
            is_admin BOOLEAN DEFAULT 0
        )
    `
    db.prepare(sql).run();
}

const createCommitteesTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS committees (
            committee_id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_id INTEGER NOT NULL,
            chair_id INTEGER NOT NULL, 
            members { member #: userid, member #: userid, ... },
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        )
    `
    db.prepare(sql).run();
}

// const createMembersTable = () => {
//     const sql = `
//         CREATE TABLE IF NOT EXISTS members (
//             committee_id INTEGER FOREIGN KEY NOT NULL UNIQUE,
//             member_id INTEGER NOT NULL
//         )
//     `
//     db.prepare(sql).run();
// }

// const createMotionsTable = () => {
//     const sql = `
//         CREATE TABLE IF NOT EXISTS members (
//             motion_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             committee_id INTEGER NOT NULL, 
//             user_id INTEGER NOT NULL,
//             title TEXT NOT NULL,
//             description TEXT NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         )
//     `
//     db.prepare(sql).run();
// }
