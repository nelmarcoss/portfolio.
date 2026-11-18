import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLanguage, startSystemLanguage } from '../system-language.mjs';
import dictionary from '../interface-en.mjs';
test('uses the first supported system language, including regional variants', () => {
  assert.equal(resolveLanguage(['es-ES', 'en-US']), 'es');
  assert.equal(resolveLanguage(['en-GB', 'es-ES']), 'en');
  assert.equal(resolveLanguage(['fr-FR', 'es-MX', 'en']), 'es');
  assert.equal(resolveLanguage(['de-DE', 'fr']), 'en');
  assert.equal(resolveLanguage([]), 'es');
  assert.equal(resolveLanguage(['ES_es']), 'es');
});
test('does not access browser APIs during server rendering', () => {
  assert.equal(typeof startSystemLanguage(dictionary), 'function');
});
test('includes reviewed interface copy without renaming product brands', () => {
  assert.equal(dictionary['Saltar al contenido'], 'Skip to content');
  assert.equal(dictionary['Privacidad'], 'Privacy');
  for (const name of ['amano','platto','atlas','tramo','puntual','NMC Labs']) assert.equal(Object.hasOwn(dictionary, name), false);
  for(const [source,translated] of Object.entries(dictionary)) {
    assert.equal(typeof translated, 'string', source);
    assert.ok(translated.trim(), source);
    assert.ok(!/[<>]/.test(translated), source);
  }
});
