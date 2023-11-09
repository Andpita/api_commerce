import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCart1693811193505 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE CART ADD ACTIVE BOOLEAN NOT NULL `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE CART DROP ACTIVE`);
  }
}
