import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBattleHistory1776515937554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'history',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'roomId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'winnerId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'loserId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'cost',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'ownerPositions',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'guestPositions',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'history',
      new TableForeignKey({
        columnNames: ['roomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rooms',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'history',
      new TableForeignKey({
        columnNames: ['winnerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'history',
      new TableForeignKey({
        columnNames: ['loserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('history');
  }
}
