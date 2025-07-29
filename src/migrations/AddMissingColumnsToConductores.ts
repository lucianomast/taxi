import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingColumnsToConductores1700000000002 implements MigrationInterface {
  name = 'AddMissingColumnsToConductores1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si las columnas existen antes de agregarlas
    const tableExists = await queryRunner.hasTable('conductores');
    if (!tableExists) {
      throw new Error('La tabla conductores no existe');
    }

    // Obtener las columnas existentes
    const columns = await queryRunner.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'Taxi' AND TABLE_NAME = 'conductores'
    `);
    
    const existingColumns = columns.map((col: any) => col.COLUMN_NAME);

    // Agregar columnas que no existen
    const columnsToAdd = [
      { name: 'ultimaPenalizacion', sql: 'ADD COLUMN `ultimaPenalizacion` DATETIME NULL' },
      { name: 'ultimoServicioNoInmediato_at', sql: 'ADD COLUMN `ultimoServicioNoInmediato_at` DATETIME NULL' },
      { name: 'created_at', sql: 'ADD COLUMN `created_at` DATE NOT NULL DEFAULT (CURDATE())' },
      { name: 'updated_at', sql: 'ADD COLUMN `updated_at` DATE NULL' },
      { name: 'deleted_at', sql: 'ADD COLUMN `deleted_at` DATE NULL' }
    ];

    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        await queryRunner.query(`ALTER TABLE \`conductores\` ${column.sql}`);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`conductores\` 
      DROP COLUMN IF EXISTS \`ultimaPenalizacion\`,
      DROP COLUMN IF EXISTS \`ultimoServicioNoInmediato_at\`,
      DROP COLUMN IF EXISTS \`created_at\`,
      DROP COLUMN IF EXISTS \`updated_at\`,
      DROP COLUMN IF EXISTS \`deleted_at\`
    `);
  }
} 