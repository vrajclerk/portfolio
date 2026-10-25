import * as migration_20261019_202934_initial from './20261019_202934_initial';

export const migrations = [
  {
    up: migration_20261019_202934_initial.up,
    down: migration_20261019_202934_initial.down,
    name: '20261019_202934_initial'
  },
];
