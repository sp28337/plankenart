/**
 * Shared dropdown logic for catalog filter pages (materials, objects).
 * Eliminates ~120 lines of duplicated code between materials/index and objects/index.
 */

const DURATION = 30;
const EASING = `cubic-bezier(0.50, 1, 0.90, 1)`;

export interface DropdownHandle {
  setLabel(value: string, text: string): void;
}

export function setupOverlay(overlayId: string) {
  const overlay = document.getElementById(overlayId)!;
  let openCount = 0;
  const registry: Array<() => void> = [];

  function showOverlay() {
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function hideOverlay() {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function initDropdown(
    btnId: string,
    panelId: string,
    inputId: string,
    labelId: string,
    chevronId: string,
    group: string,
  ): DropdownHandle {
    const btn = document.getElementById(btnId)!;
    const panel = document.getElementById(panelId)!;
    const input = document.getElementById(inputId) as HTMLInputElement;
    const labelEl = document.getElementById(labelId)!;
    const chevron = document.getElementById(chevronId)!;
    const items = Array.from(panel.querySelectorAll<HTMLElement>(`[data-group="${group}"]`));
    const defaultLabel = labelEl.textContent!.trim();

    let closeTimer: ReturnType<typeof setTimeout> | null = null;
    let isOpen = false;

    function resetItems() {
      items.forEach(el => {
        el.style.animation = 'none';
        el.style.transform = 'translateY(-110%)';
      });
    }

    function openPanel() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      if (isOpen) return;
      registry.forEach(fn => fn());
      isOpen = true;
      openCount++;
      resetItems();
      panel.offsetHeight; // force reflow
      panel.classList.remove('opacity-0', 'pointer-events-none');
      panel.classList.add('opacity-100');
      panel.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      chevron.style.transform = 'rotate(180deg)';
      items.forEach((el, i) => {
        el.style.animation = `menu-slide-down ${DURATION}ms ${EASING} ${i * DURATION}ms forwards`;
      });
      if (openCount === 1) showOverlay();
    }

    function closePanel() {
      if (!isOpen) return;
      isOpen = false;
      openCount = Math.max(0, openCount - 1);
      btn.setAttribute('aria-expanded', 'false');
      chevron.style.transform = 'rotate(0deg)';
      panel.classList.add('opacity-0', 'pointer-events-none');
      panel.classList.remove('opacity-100');
      panel.setAttribute('aria-hidden', 'true');
      closeTimer = setTimeout(() => { resetItems(); closeTimer = null; }, DURATION);
      if (openCount === 0) hideOverlay();
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      isOpen ? closePanel() : openPanel();
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        const value = item.dataset.slug ?? '';
        input.value = value;
        labelEl.textContent = value ? item.textContent!.trim() : defaultLabel;
        closePanel();
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    document.addEventListener('click', e => {
      if (!btn.contains(e.target as Node) && !panel.contains(e.target as Node)) {
        if (isOpen) closePanel();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
        btn.focus();
      }
    });

    overlay.addEventListener('click', () => { if (isOpen) closePanel(); });

    registry.push(closePanel);

    return {
      setLabel(v: string, text: string) {
        input.value = v;
        labelEl.textContent = v ? text : defaultLabel;
      }
    };
  }

  return { initDropdown };
}

/**
 * Generic catalog filter setup: wires dropdowns to a grid of cards.
 */
export function setupCatalogFilter(config: {
  gridId: string;
  emptyId: string;
  cardSelector: string;
  dropdowns: Array<{
    handle: DropdownHandle;
    inputId: string;
    paramKey: string;
    dataAttr: string;
    multiValue?: boolean;
  }>;
}) {
  const grid = document.getElementById(config.gridId)!;
  const emptyEl = document.getElementById(config.emptyId)!;
  const cards = Array.from(grid.querySelectorAll<HTMLElement>(config.cardSelector));

  function applyFilters() {
    let visible = 0;
    const values = config.dropdowns.map(d => ({
      value: (document.getElementById(d.inputId) as HTMLInputElement).value,
      dataAttr: d.dataAttr,
      multiValue: d.multiValue ?? false,
    }));

    cards.forEach(card => {
      const ok = values.every(({ value, dataAttr, multiValue }) => {
        if (!value) return true;
        const cardValue = card.dataset[dataAttr] ?? '';
        return multiValue ? cardValue.split(' ').includes(value) : cardValue === value;
      });
      card.style.display = ok ? '' : 'none';
      card.toggleAttribute('aria-hidden', !ok);
      if (ok) visible++;
    });

    emptyEl.classList.toggle('hidden', visible > 0);
    grid.classList.toggle('hidden', visible === 0);

    const params = new URLSearchParams();
    config.dropdowns.forEach(d => {
      const val = (document.getElementById(d.inputId) as HTMLInputElement).value;
      if (val) params.set(d.paramKey, val);
    });
    history.replaceState(null, '', params.toString() ? `?${params}` : location.pathname);
  }

  config.dropdowns.forEach(d => {
    document.getElementById(d.inputId)!.addEventListener('change', applyFilters);
  });

  document.getElementById('btn-empty-reset')?.addEventListener('click', () => {
    config.dropdowns.forEach(d => d.handle.setLabel('', ''));
    applyFilters();
  });

  // Restore filters from URL on page load
  const params = new URLSearchParams(location.search);
  let hasFilters = false;
  config.dropdowns.forEach(d => {
    const slug = params.get(d.paramKey) ?? '';
    if (slug) {
      const item = document.querySelector<HTMLElement>(`[data-group="${d.dataAttr}"][data-slug="${slug}"]`);
      if (item) d.handle.setLabel(slug, item.textContent!.trim());
      hasFilters = true;
    }
  });
  if (hasFilters) applyFilters();
}
