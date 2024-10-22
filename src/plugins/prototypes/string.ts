import { toCamelCase, toCapitalize, toKebabCase, toLowerThenCapitalize, toStringPath } from "@/utils/string";
export {};
declare global {
  interface String {
    toCapitalize(): ReturnType<typeof toCapitalize>;
    toLowerThenCapitalize(): ReturnType<typeof toLowerThenCapitalize>;
    toStringPath(): ReturnType<typeof toStringPath>;
    toKebabCase(): ReturnType<typeof toKebabCase>;
    toCamelCase(firstLetterUppercase?: boolean): ReturnType<typeof toCamelCase>;
  }
}

String.prototype.toCapitalize = function () {
  return toCapitalize(this.toString());
};

String.prototype.toLowerThenCapitalize = function () {
  return toLowerThenCapitalize(this.toString());
};

String.prototype.toStringPath = function () {
  return toStringPath(this.toString());
};

String.prototype.toKebabCase = function () {
  return toKebabCase(this.toString());
};

String.prototype.toCamelCase = function (firstLetterUppercase) {
  return toCamelCase(this.toString(), firstLetterUppercase);
};
