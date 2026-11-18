/** Local interface translations. Records, form values and storage are never rewritten. */
export function resolveLanguage(languages = []) {
  for (const value of languages) {
    const code = String(value).toLowerCase().split(/[-_]/)[0];
    if (code === 'es' || code === 'en') return code;
  }
  return languages.length ? 'en' : 'es';
}
export function startSystemLanguage(dictionary, { exclude = '', storageKeys = [] } = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};
  const attributes = ['aria-label', 'title', 'placeholder', 'alt'];
  const protectedSelector = 'script,style,textarea,option:not([value]),code,pre,[translate="no"],[data-user-content],[contenteditable]:not([contenteditable="false"])' + (exclude ? ',' + exclude : '');
  const records = new WeakMap();
  let locale, pending = false, stopped = false;
  let protectedValues = new Set();
  const refreshProtectedValues = () => {
    protectedValues = new Set();
    const collect = value => {
      if (typeof value === 'string') protectedValues.add(normalize(value));
      else if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === 'object') Object.values(value).forEach(collect);
    };
    for (const key of storageKeys) { try { collect(JSON.parse(localStorage.getItem(key))); } catch {} }
    // Form contents remain user data even if storage is unavailable.
    document.querySelectorAll('input:not([type=hidden]):not([type=password]),textarea,[contenteditable=true]').forEach(el => {
      const value = 'value' in el ? el.value : el.textContent;
      if (value) protectedValues.add(normalize(value));
    });
  };
  const normalize = text => text.replace(/\s+/g, ' ').trim();
  const translate = raw => {
    if (locale === 'es' || protectedValues.has(normalize(raw))) return raw;
    const key = normalize(raw);
    let value = Object.hasOwn(dictionary, key) ? dictionary[key] : null;
    if (!value) {
      const count = key.match(/^(\d+) (equipo|equipos|persona|personas|ubicación|ubicaciones|préstamo|préstamos|producto|productos|modelo|modelos|cita|citas|cliente|clientes|profesional|profesionales|día|días|hora|horas|minuto|minutos)( seleccionados)?$/i);
      if (count) {
        const units = {equipo:'asset',equipos:'assets',persona:'person',personas:'people',ubicación:'location',ubicaciones:'locations',préstamo:'loan',préstamos:'loans',producto:'product',productos:'products',modelo:'model',modelos:'models',cita:'appointment',citas:'appointments',cliente:'client',clientes:'clients',profesional:'professional',profesionales:'professionals',día:'day',días:'days',hora:'hour',horas:'hours',minuto:'minute',minutos:'minutes'};
        value = count[1] + ' ' + units[count[2].toLowerCase()] + (count[3] ? ' selected' : '');
      }
      const prefixed = key.match(/^(Asignar|Devolver|Abrir ficha de|QR de) (.+)$/);
      if (prefixed) value = ({Asignar:'Assign',Devolver:'Return','Abrir ficha de':'Open record for','QR de':'QR code for'})[prefixed[1]] + ' ' + prefixed[2];
    }
    if (!value) return raw;
    return raw.match(/^\s*/)[0] + value + raw.match(/\s*$/)[0];
  };
  const update = (node, name, read, write) => {
    let state = records.get(node);
    if (!state) records.set(node, state = new Map());
    const current = read(), previous = state.get(name);
    const original = previous && current === previous.rendered ? previous.original : current;
    const rendered = translate(original);
    state.set(name, { original, rendered });
    if (current !== rendered) write(rendered);
  };
  const apply = () => {
    pending = false;
    if (stopped || !document.body) return;
    refreshProtectedValues();
    const title = document.querySelector('title');
    if (title?.firstChild) update(title.firstChild, 'text', () => title.firstChild.data, value => { title.firstChild.data = value; });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
      if (!element || element.closest(protectedSelector)) continue;
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.data.trim()) update(node, 'text', () => node.data, value => { node.data = value; });
      } else {
        for (const attr of attributes) if (node.hasAttribute(attr)) update(node, attr, () => node.getAttribute(attr), value => node.setAttribute(attr, value));
      }
    }
  };
  const schedule = () => { if (!pending && !stopped) { pending = true; queueMicrotask(apply); } };
  const change = () => {
    locale = resolveLanguage(navigator.languages?.length ? navigator.languages : [navigator.language].filter(Boolean));
    document.documentElement.lang = locale;
    document.documentElement.dataset.systemLanguage = locale;
    apply();
  };
  change();
  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.type === 'childList' || m.type === 'characterData' || attributes.includes(m.attributeName))) schedule();
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
  window.addEventListener('languagechange', change);
  return () => { stopped = true; observer.disconnect(); window.removeEventListener('languagechange', change); };
}
