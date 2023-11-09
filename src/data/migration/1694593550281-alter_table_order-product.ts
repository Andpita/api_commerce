import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableOrderProduct1694593550281 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public.order_product ALTER COLUMN price TYPE float8 USING price::float8;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(``);
  }
}
