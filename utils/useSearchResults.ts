import Fuse from "fuse.js";
import { groupBy, maxBy, orderBy, sumBy, debounce } from "lodash";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "../data/store";
import { File } from "../types/types";
import { fireGtmEvent } from "../data/google-apis";
import FuseResult = Fuse.FuseResult;

const fuse = new Fuse([], {
  keys: ["name", "description"],
  includeMatches: true,
  findAllMatches: true,
  useExtendedSearch: true,
  minMatchCharLength: 3,
  threshold: 0.4,
});

type Crumb = { name: string; href: string };
type Result = {
  crumbs: Crumb[];
  files: FuseResult<File>[];
};

export default function useSearchResults(items, query) {
  const pages = useSelector((state) => state.pages);
  const categories = useSelector((state) => state.categories);
  const subcategories = useSelector((state) => state.subcategories);
  const isUpdating = useSelector(
    (state) => state.modals.downloadAllFilesModalVisible
  );

  const [results, setResults] = useState<Result[]>([]);

  function getCrumbs(parent: string): Crumb[] {
    let tmp = parent;

    const subcategory = subcategories.find((s) => s.id === tmp);
    if (subcategory) tmp = subcategory.categoryId;

    const category = categories.find((c) => c.id === tmp);
    if (category) tmp = category.pageId;

    const page = pages.find((p) => p.id === tmp);

    return [
      page && { name: page.name, href: `/${page.id}` },
      category && {
        name: category.name,
        href: `/${page.id}/${category.id}`,
      },
      subcategory && {
        name: subcategory.name,
        href: `${page.id}/${category.id}#${subcategory.id}`,
      },
    ].filter((x) => !!x);
  }

  const calculateResults = useCallback(
    debounce((q) => {
      const fuseResults = fuse.search<File>(q);
      const groups = groupBy(fuseResults, "item.parents[0]");
      const orderedEntries = orderBy(
        Object.entries(groups),
        [(g) => maxBy(g, "score")],
        ["desc"]
      );
      const results = orderedEntries.map(([parent, results]) => ({
        crumbs: getCrumbs(parent),
        files: orderBy(results, ["score"], ["desc"]),
      }));

      setResults(results);
    }, 300),
    []
  );

  useEffect(() => {
    if (!isUpdating) {
      calculateResults(query);
    }
  }, [query, items.length]);

  useEffect(() => {
    fireGtmEvent("Search", {
      query,
      result_count: sumBy(results, "files.length"),
    });
  }, [query]);

  useEffect(() => {
    fuse.setCollection(items);
  }, [items.length]);

  return results;
}
