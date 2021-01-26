import Fuse from "fuse.js";
import { groupBy, maxBy, orderBy, sumBy } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "../data/store";
import { File } from "../types/types";
import { fireGtmEvent } from "../data/google-apis";

const fuse = new Fuse([], {
  keys: ["name", "description"],
  includeMatches: true,
  findAllMatches: true,
  useExtendedSearch: true,
});

type Crumb = { name: string; href: string };
type Result = {
  crumbs: Crumb[];
  files: File[];
};

export default function useSearchResults(items, query) {
  const pages = useSelector((state) => state.pages);
  const categories = useSelector((state) => state.categories);
  const subcategories = useSelector((state) => state.subcategories);

  const [results, setResults] = useState<Result[]>([]);

  function fixParent(file: File): File {
    const parent =
      subcategories.find(
        (s) =>
          s.id === file.parents[0] ||
          s.files.findIndex((f) => f.id === file.id) > -1
      )?.id ?? file.parents[0];
    return { ...file, parents: [parent] };
  }

  function getCrumbs(parent: string): Crumb[] {
    let tmp = parent;

    const subcategory = subcategories.find((s) => s.id === tmp);
    if (subcategory) tmp = subcategory.categoryId;

    const category = categories.find((c) => c.id === tmp);
    if (category) tmp = category.pageId;

    const page = pages.find((p) => p.id === tmp);

    return [
      { name: page.name, href: `/${page.id}` },
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

  useEffect(() => {
    const fuseResults = fuse.search<File>(query);
    const fixedParents = fuseResults.map((r) => ({
      ...r,
      item: fixParent(r.item),
    }));
    const groups = groupBy(fixedParents, "item.parents[0]");
    const orderedEntries = orderBy(
      Object.entries(groups),
      [(g) => maxBy(g, "score")],
      ["desc"]
    );
    const results = orderedEntries.map(([parent, results]) => ({
      crumbs: getCrumbs(parent),
      files: orderBy(results, ["score"], ["desc"]).map((r) => r.item),
    }));

    setResults(results);
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
