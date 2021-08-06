import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddNewAttemptsFieldsInUsersTable1628214585975
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'sign_in_attempts',
        type: 'integer',
        default: "'0'",
      }),
      new TableColumn({
        name: 'forgot_password_attempts',
        type: 'integer',
        default: "'0'",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', [
      new TableColumn({
        name: 'sign_in_attempts',
        type: 'integer',
      }),
      new TableColumn({
        name: 'forgot_password_attempts',
        type: 'integer',
      }),
    ]);
  }
}
