import { getDb } from '../config/database';
import { User } from '../types';

export const UserModel = {
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const db = await getDb();
    const { lastID } = await db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [user.username, user.password, user.role]
    );

    if (lastID !== undefined) {
      return this.findById(lastID);
    } else {
      // handle the case where lastID is undefined
      throw new Error('Failed to get last ID');
    }
  },

  async findById(id: number): Promise<User> {
    const db = await getDb();
    const user = await db.get<User>('SELECT * FROM users WHERE id = ?', id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  },

  async findByUsername(username: string): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>('SELECT * FROM users WHERE username = ?', username);
  },

  async findAll(): Promise<User[]> {
    const db = await getDb();
    return db.all<User[]>('SELECT * FROM users');
  },

  async update(id: number, updates: Partial<User>): Promise<User> {
    const db = await getDb();
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.values(updates);
    values.push(id);

    await db.run(
      `UPDATE users SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    return this.findById(id);
  },

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM users WHERE id = ?', id);
  },

  async setResetToken(id: number, token: string, expires: Date): Promise<void> {
    const db = await getDb();
    await db.run('UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE id = ?', [
      token,
      expires.toISOString(),
      id,
    ]);
  },

  async clearResetToken(id: number): Promise<void> {
    const db = await getDb();
    await db.run('UPDATE users SET resetToken = NULL, resetTokenExpires = NULL WHERE id = ?', [id]);
  },
};
