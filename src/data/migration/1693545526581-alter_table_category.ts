import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCategory1693545526581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      alter table public.category add unique(name)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(``);
  }
}
