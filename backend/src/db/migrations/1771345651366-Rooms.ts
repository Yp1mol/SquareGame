import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateRoomsTable1771345260000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rooms',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'owner_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'guest_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status_id',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'owner_score',
            type: 'int',
            default: 0,
          },
          {
            name: 'guest_score',
            type: 'int',
            default: 0,
          },
          {
            name: 'cost',
            type: 'int',
            default: 1,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'rooms',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'rooms',
      new TableForeignKey({
        columnNames: ['guest_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('rooms');
  }
}
