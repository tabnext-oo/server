/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

'use strict';

const startsByDocId = new Map();
const startsByTask = new Map();

function taskKey(docId, saveKey) {
  return docId + saveKey;
}

function begin(docId) {
  startsByDocId.set(docId, Date.now());
}

function migrate(fromDocId, toDocId) {
  const t = startsByDocId.get(fromDocId);
  if (t !== undefined) {
    startsByDocId.set(toDocId, t);
    startsByDocId.delete(fromDocId);
  }
}

function bindTask(docId, saveKey) {
  const t = startsByDocId.get(docId);
  if (t !== undefined) {
    startsByTask.set(taskKey(docId, saveKey), t);
  }
}

function elapsedMs(docId, saveKey) {
  let t;
  if (saveKey) {
    t = startsByTask.get(taskKey(docId, saveKey));
  }
  if (t === undefined) {
    t = startsByDocId.get(docId);
  }
  return t !== undefined ? Date.now() - t : null;
}

function end(docId, saveKey) {
  if (saveKey) {
    startsByTask.delete(taskKey(docId, saveKey));
  }
  startsByDocId.delete(docId);
}

module.exports = {
  begin,
  migrate,
  bindTask,
  elapsedMs,
  end
};
