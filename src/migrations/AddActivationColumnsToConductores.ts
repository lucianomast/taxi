import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActivationColumnsToConductores1700000000000 implements MigrationInterface {
  name = 'AddActivationColumnsToConductores1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`conductores\` 
      ADD COLUMN \`codigoActivacion\` VARCHAR(6) NULL,
      ADD COLUMN \`codigoActivacionExpiracion\` DATETIME NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`conductores\` 
      DROP COLUMN \`codigoActivacion\`,
      DROP COLUMN \`codigoActivacionExpiracion\`
    `);
  }
} 