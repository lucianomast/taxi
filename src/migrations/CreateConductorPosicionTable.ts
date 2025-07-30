import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateConductorPosicionTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'conductor_posicion',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'conductorId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'lat',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'lon',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Agregar foreign key
    await queryRunner.createForeignKey(
      'conductor_posicion',
      new TableForeignKey({
        columnNames: ['conductorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'conductores',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('conductor_posicion');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('conductorId') !== -1);
      if (foreignKey) {
        await queryRunner.dropForeignKey('conductor_posicion', foreignKey);
      }
    }
    await queryRunner.dropTable('conductor_posicion');
  }
} 