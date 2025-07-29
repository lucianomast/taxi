import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificadoToConductores1700000000001 implements MigrationInterface {
  name = 'AddEmailVerificadoToConductores1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`conductores\` 
      ADD COLUMN \`emailVerificado\` TINYINT DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`conductores\` 
      DROP COLUMN \`emailVerificado\`
    `);
  }
} 