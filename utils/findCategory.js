export default function findCategory(pages, categoryId) {
  const pageIndex = pages.findIndex((p) =>
    p.categories.find(({ id }) => id === categoryId)
  );
  const categoryIndex = pages[pageIndex].categories.findIndex(
    ({ id }) => id === categoryId
  );

  return [pageIndex, categoryIndex];
}
