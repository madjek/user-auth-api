import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../constants/roles';

export async function seedDatabase() {
  try {
    const users = await UserModel.findAll();
    if (users.length > 0) return; // Already seeded

    console.log('Seeding database with initial data...');

    // Seed admin user
    await AuthService.register('admin', 'admin123', ROLES.ADMIN);

    // Seed regular users
    await AuthService.register('user1', 'password1');
    await AuthService.register('user2', 'password2');
    await AuthService.register('user3', 'password3');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
