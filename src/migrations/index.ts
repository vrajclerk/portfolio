import * as migration_20261019_202934_initial from './20261019_202934_initial';
import * as migration_20261031_233000_add_hidden_fields from './20261031_233000_add_hidden_fields';

export const migrations = [
  {
    up: migration_20261019_202934_initial.up,
    down: migration_20261019_202934_initial.down,
    name: '20261019_202934_initial'
  },
  {
    up: migration_20261031_233000_add_hidden_fields.up,
    down: migration_20261031_233000_add_hidden_fields.down,
    name: '20261031_233000_add_hidden_fields'
  },
];

