export const capitalizeFirstLetter = (string: string): string => string?.charAt(0).toUpperCase() + string?.slice(1)

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const startsWithCaseUnsensitive = (str: string, prefix: string): boolean => str.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase();