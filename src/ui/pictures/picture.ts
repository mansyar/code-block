/**
 * Every lesson picture is a plain SVG that sizes itself from the class its parent gives it.
 * `| undefined` is explicit because CSS-module lookups are `string | undefined` under
 * `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` rejects passing that implicitly.
 */
export type PictureProps = {
  readonly className?: string | undefined;
};
