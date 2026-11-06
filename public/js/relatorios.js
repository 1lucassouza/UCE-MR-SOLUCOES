const searchInputs = document.querySelectorAll('[data-table-search]');

function updateTable(table, query, expanded) {
  const rows = Array.from(table.tBodies[0].rows);
  let visibleRows = 0;

  rows.forEach(row => {
    const matchesSearch = row.textContent.toLocaleLowerCase('pt-BR').includes(query);
    const hiddenByDefault = row.classList.contains('initially-hidden');
    const shouldHide = !matchesSearch || (!expanded && !query && hiddenByDefault);

    row.hidden = shouldHide;
    if (!shouldHide) visibleRows += 1;
  });

  const emptyState = table.parentElement.querySelector('.empty-state');
  emptyState.hidden = visibleRows > 0;
}

searchInputs.forEach(input => {
  const table = document.getElementById(input.dataset.tableSearch);
  const viewAllButton = document.querySelector(`[aria-controls="${input.dataset.tableSearch}"]`);
  let expanded = viewAllButton.getAttribute('aria-expanded') === 'true';

  const refreshTable = () => {
    const query = input.value.trim().toLocaleLowerCase('pt-BR');
    updateTable(table, query, expanded);
  };

  input.addEventListener('input', refreshTable);
  viewAllButton.addEventListener('click', () => {
    expanded = !expanded;
    viewAllButton.setAttribute('aria-expanded', String(expanded));
    viewAllButton.querySelector('span').textContent = expanded ? 'Mostrar menos' : 'Ver todos';
    refreshTable();
  });

  refreshTable();
});