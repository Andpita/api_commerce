import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertRootInUser1675770516769 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      INSERT INTO public."user"(
        name, email, cpf, type_user, phone, password)

      VALUES ('root', 'andpita47@gmail.com', '08615334960', 2, '48999002067', '$2b$08$R2aI5araH3vyoLf4r0Fdnu14qEXDy7VmwRTf7afPgKly.Doyc1j/6');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DELETE FROM public."user"
            WHERE email like 'root@root.com';
    `);
  }
}
